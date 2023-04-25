const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const expressFileUpload = require("express-fileupload");
const routes = require("./routes/index.js");

const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(expressFileUpload());
app.use("/v1", routes);

app.listen(port, () => {
  console.log("App listening on port " + port);
});
