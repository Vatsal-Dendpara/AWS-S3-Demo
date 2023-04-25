const express = require("express");
const {
  fileUploadController,
  getImageFromS3Controller,
} = require("../controllers/file-upload-controlller");
const router = new express.Router();

router.post("/add-file", fileUploadController);
router.get("/get-file", getImageFromS3Controller);

module.exports = router;
