const { uploadFileToS3UsingBlob, getImageFromS3 } = require("../utils/aws");

const fileUploadService = async (params) => {
  try {
    const fileInfo = params.files.file;
    const fileData = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileInfo.name,
      Body: fileInfo.data,
      ContentType: fileInfo.mimetype,
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

module.exports = { fileUploadService, getImageFromS3Service };
