const express = require("express");
const {
  fileUploadController,
  getImageFromS3Controller,
  deleteImageFromS3Controller,
  multipartUploadChunkController,
  fetchLargeFileController,
} = require("../controllers/file-upload-controlller");
const router = new express.Router();

router.post("/add-file", fileUploadController);
router.get("/get-file", getImageFromS3Controller);
router.delete("/delete-file", deleteImageFromS3Controller);
router.post("/add-file-multipart", multipartUploadChunkController);
router.get("/fetch-large-file", fetchLargeFileController);

module.exports = router;
