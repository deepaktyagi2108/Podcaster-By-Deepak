// middleware/multer.js
const multer = require("multer");
const { storage } = require("../utils/cloudinary");

const upload = multer({ storage });

module.exports = upload.fields([
  { name: "frontImage", maxCount: 1 },
  { name: "audioFile", maxCount: 1 },
]);
