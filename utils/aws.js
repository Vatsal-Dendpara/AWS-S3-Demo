const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
require("dotenv").config();

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_APP_USER_ACCESS_KEY,
    secretAccessKey: process.env.AWS_APP_USER_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_DEFAULT_REGION,
});

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

const getImageFromS3 = async (fileInfo) => {
  try {
    const imageData = new GetObjectCommand(fileInfo);
    const url = await getSignedUrl(s3, imageData, { expiresIn: 3600 });

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
    return {
      status: 500,
      message: error,
    };
  }
};

module.exports = {
  uploadFileToS3UsingBlob,
  getImageFromS3,
};
