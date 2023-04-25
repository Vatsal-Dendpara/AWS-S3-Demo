const express = require("express");
const router = express.Router();
const fileUploadRouter = require("./file-upload-router");

router.use("/files", fileUploadRouter);

module.exports = router;
