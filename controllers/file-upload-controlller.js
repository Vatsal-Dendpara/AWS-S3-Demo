const {
  fileUploadService,
  getImageFromS3Service,
  deleteImageFromS3Service,
  multipartUploadChunkService,
  fetchLargeFileService,
} = require("../services/file-upload-service.js");

const fileUploadController = async (req, res) => {
  const response = await fileUploadService(req);
  res.status(response.status).json(response);
};

const getImageFromS3Controller = async (req, res) => {
  const response = await getImageFromS3Service(req.body);
  res.status(response.status).json(response);
};

const deleteImageFromS3Controller = async (req, res) => {
  const response = await deleteImageFromS3Service(req.body);
  res.status(response.status).json(response);
};

const multipartUploadChunkController = async (req, res) => {
  const response = await multipartUploadChunkService(req);
  res.status(response.status).json(response);
};

const fetchLargeFileController = async (req, res) => {
  return await fetchLargeFileService(req, res);
};

module.exports = {
  fileUploadController,
  getImageFromS3Controller,
  deleteImageFromS3Controller,
  multipartUploadChunkController,
  fetchLargeFileController,
};
