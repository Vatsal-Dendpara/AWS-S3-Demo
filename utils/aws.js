const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  AbortMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  HeadObjectCommand,
} = require("@aws-sdk/client-s3");
require("dotenv").config();

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { createReadStream } = require("fs");
const archiver = require("archiver");

/**
 *  S3 configuration
 */
const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_APP_USER_ACCESS_KEY,
    secretAccessKey: process.env.AWS_APP_USER_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_DEFAULT_REGION,
});

/**
 * Upload file to S3
 */
const uploadFileToS3UsingBlob = async (fileData) => {
  try {
    const command = new PutObjectCommand(fileData);
    const res = await s3.send(command);
    if (!res) {
      return {
        status: 400,
        message: "Somewhere went wrong!",
      };
    }
    return {
      status: 200,
      message: "File uploaded successfully!",
    };
  } catch (error) {
    return {
      status: 500,
      message: error,
    };
  }
};

/**
 *
 * To get image data from the S3
 *
 *
 */
const getImageFromS3 = async (fileInfo) => {
  try {
    const temp = new HeadObjectCommand(fileInfo);
    const res = await s3.send(temp)
  
    const imageData = new GetObjectCommand(fileInfo);
    //signed url
    //this url will expire after 1 hour
    const url = await getSignedUrl(s3, imageData, { expiresIn: 3600 });

    // to get base64 response

    // const res = await s3.send(imageData);
    // const base64 = await res.Body?.transformToString("base64");
    if (!url) {
      return {
        status: 400,
        message: "Somewhere went wrong!",
      };
    }
    return {
      status: 200,
      data: url,
    };
  } catch (error) {
    if(error.$metadata.httpStatusCode === 404){
      return{
        status:404,
        message:'The file you requested was not found'
      }
    }
    return {
      status: 500,
      message: error,
    };
  }
};

const deleteImageFromS3 = async (fileInfo) => {
  try {
    const image = new DeleteObjectCommand(fileInfo);

    await s3.send(image);

    return {
      status: 200,
      message: "File deleted successfully",
    };
  } catch (error) {
    return {
      status: 500,
      message: error,
    };
  }
};

/**
 *  initiate the multipart upload
 */
async function initiateMultipartUpload(initParams) {
  try {
    const ans = await s3.send(new CreateMultipartUploadCommand(initParams));

    return ans;
  } catch (err) {
    return err;
  }
}

/**
 *  this function upload data to S3 chunk by chunk.
 */
async function UploadPart(body, UploadId, partNumber, key) {
  const partParams = {
    Key: key,
    Bucket: process.env.S3_BUCKET_NAME,
    Body: body,
    UploadId: UploadId,
    PartNumber: partNumber,
  };
  return new Promise(async (resolve, reject) => {
    try {
      let part = await s3.send(new UploadPartCommand(partParams));
      resolve({ PartNumber: partNumber, ETag: part.ETag });
    } catch (error) {
      reject({ partNumber, error });
    }
  });
}

/**
 *  this function is divides the buffer blocks and uploads to S3 one by one
 */
const s3UploadBlobUsingMultipart = async (params) => {
  const key = params.Key;

  const file = params.data; // file to upload

  const fileSize = params.size; // total size of file
  const chunkSize = 1024 * 1024 * 5; // 5MB defined as each parts size
  const numParts = Math.ceil(fileSize / chunkSize); // number of parts based on the chunkSize specified
  const promise = []; // array to hold each async upload call
  const slicedData = []; // array to contain our sliced data
  let Parts = []; //  to hold all Promise.allSettled resolve and reject response
  let MP_UPLOAD_ID = null; // contain the upload ID to use for all processes
  let FailedUploads = []; // array to populate failed upload
  let CompletedParts = []; //array to hold all completed upload even from retry upload as will be seen later
  let RetryPromise = [];

  // MAIN LOGIC GOES HERE
  try {
    //Initialize multipart upload to S3
    const initParams = {
      Key: key,
      Bucket: process.env.S3_BUCKET_NAME,
    };
    const initResponse = await initiateMultipartUpload(initParams); // in real life senerio handle error with an if_else

    MP_UPLOAD_ID = initResponse["UploadId"];

    //Array to create upload objects for promise
    for (let index = 1; index <= numParts; index++) {
      let start = (index - 1) * chunkSize;
      let end = index * chunkSize;

      promise.push(
        UploadPart(
          index < numParts ? file.slice(start, end) : file.slice(start),
          MP_UPLOAD_ID,
          index,
          key
        )
      );

      slicedData.push({
        PartNumber: index,
        buffer: Buffer.from(file.slice(start, end + 1)),
      });
    }

    // promise to upload
    Parts = await Promise.allSettled(promise);

    //check if any upload failed
    FailedUploads = Parts.filter((f) => f.status == "rejected");

    try {
      if (FailedUploads.length) {
        for (let i = 0; i < FailedUploads.length; i++) {
          let [data] = slicedData.filter(
            (f) => f.PartNumber == FailedUploads[i].value.PartNumber
          );
          let s = await UploadPart(
            data.buffer,
            MP_UPLOAD_ID,
            data.PartNumber,
            key
          );
          RetryPromise.push(s);
        }
      }

      CompletedParts = Parts.map((m) => m.value);
      CompletedParts.push(...RetryPromise);

      const s3ParamsComplete = {
        Key: key,
        Bucket: process.env.S3_BUCKET_NAME,
        UploadId: MP_UPLOAD_ID,
        MultipartUpload: {
          Parts: CompletedParts,
        },
      };

      const result = await s3.send(
        new CompleteMultipartUploadCommand(s3ParamsComplete)
      );
    } catch (error) {
      // handle error
      const initParams = {
        Key: key,
        Bucket: process.env.S3_BUCKET_NAME,
        UploadId: MP_UPLOAD_ID,
      };
      await AbortMultipartUploadCommand(initParams);
      return {
        status: 500,
        message: error,
      };
    }
    return {
      status: 200,
      message: "File upload completed successfully",
    };
  } catch (error) {
    // Handle error or cancel like below
    const initParams = {
      Key: key,
      Bucket: process.env.S3_BUCKET_NAME,
      UploadId: MP_UPLOAD_ID,
    };
    await AbortMultipartUploadCommand(initParams);
    return {
      status: 500,
      message: error,
    };
  }
};

/**
 *  this function is creating a zip file from the file names and streams directly to the client without creating a zip file into the server
 *  do not test endpoint in postman try this endpoint directly to the browser
 */
const fetchLargeFile = async (res) => {
  try {
    // list of file name to download as zip
    const files = [
      "1682069590965_Treadmill Running 500fps (1) (another copy).mp4",
      "john-towner-JgOeRuGD_Y4-unsplash.jpg",
    ];
    // Define the files to include in the ZIP file
    const fileKeys = files;
    // Define the S3 bucket name
    const bucketName = process.env.S3_BUCKET_NAME;

    // Create a new archiver instance and set the output to be streamed
    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.on("error", (err) => {
      throw err;
    });

    // Add each file to the archive by streaming its contents from S3
    for (const fileKey of fileKeys) {
      const params = { Bucket: bucketName, Key: fileKey };
      const data = new GetObjectCommand(params);
      const response = await s3.send(data);
      archive.append(response.Body, {
        name: fileKey,
      });
    }

    // Set the content-disposition header to force download of the ZIP file
    const headers = {
      "Content-Disposition": `attachment; filename="Files_${new Date().getSeconds()}.zip"`,
    };

    // Pipe the ZIP file to the HTTP response object
    archive.pipe(res.set(headers));

    // When the archive is finalized, end the response
    archive.on("finish", () => {
      console.log(`ZIP file created and streamed`);
      res.end();
    });

    // Generate the ZIP file and start streaming it to the HTTP response object
    archive.finalize();
  } catch (error) {
    throw error;
  }
};

module.exports = {
  uploadFileToS3UsingBlob,
  getImageFromS3,
  deleteImageFromS3,
  s3UploadBlobUsingMultipart,
  fetchLargeFile,
};
