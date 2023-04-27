const {
  uploadFileToS3UsingBlob,
  getImageFromS3,
  deleteImageFromS3,
  s3UploadBlobUsingMultipart,
  fetchLargeFile,
} = require("../utils/aws");

/**
 *
 * File upload service
 * you can use this service for multiple uploads also for that you have to add loop to upload file one by one
 */
const fileUploadService = async (params) => {
  try {
    const fileInfo = params.files.file;
    const fileData = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileInfo.name, //filename
      Body: fileInfo.data, //file buffer
      ContentType: fileInfo.mimetype, //content type
    };
    const response = await uploadFileToS3UsingBlob(fileData);
    return response;
  } catch (error) {
    return {
      status: 500,
      message: error,
    };
  }
};

/**
 *
 * get image service
 * by default it return signed url for single file you can do this for multiple files also just need to add loop for fetching data from S3
 */
const getImageFromS3Service = async (params) => {
  try {
    const fileInfo = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: params.fileName,
    };
    const response = await getImageFromS3(fileInfo);
    return response;
  } catch (error) {
    return {
      status: 500,
      message: error,
    };
  }
};

/**
 *  this function deletes file from the S3
 */
const deleteImageFromS3Service = async (params) => {
  try {
    const fileInfo = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: params.fileName,
    };
    return await deleteImageFromS3(fileInfo);
  } catch (error) {
    return {
      status: 500,
      message: error,
    };
  }
};

/**
 *  this function uploads file into S3 chunk by chunk
 */
const multipartUploadChunkService = async (params) => {
  const fileInfo = params.files.file;
  const fileData = {
    Key: fileInfo.name, //filename
    data: fileInfo.data, //file buffer
    ContentType: fileInfo.mimetype, //content type
    size: fileInfo.size, //file size
  };
  return await s3UploadBlobUsingMultipart(fileData);
};

/**
 *  this function is creating a zip file from the file names and streams directly to the client without creating a zip file into the server
 *  do not test endpoint in postman try this endpoint directly to the browser
 */
const fetchLargeFileService = async (req, res) => {
  return await fetchLargeFile(res);
};
module.exports = {
  fileUploadService,
  getImageFromS3Service,
  deleteImageFromS3Service,
  multipartUploadChunkService,
  fetchLargeFileService,
};
