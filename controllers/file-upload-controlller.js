const {
  fileUploadService,
  getImageFromS3Service,
} = require("../services/file-upload-service.js");
const fileUploadController = async (req, res) => {
  const response = await fileUploadService(req);
  res.status(response.status).json(response);
};

const getImageFromS3Controller = async (req, res) => {
  const response = await getImageFromS3Service(req.body);
  res.status(response.status).json(response);
};

module.exports = {
  fileUploadController,
  getImageFromS3Controller,
};
