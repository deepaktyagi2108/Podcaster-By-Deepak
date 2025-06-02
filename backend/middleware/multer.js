const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");


const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    if (file.fieldname === "frontImage") {
      return {
        folder: "podcaster/images",
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png"],
      };
    }

    if (file.fieldname === "audioFile") {
      return {
        folder: "podcaster/audios",
        resource_type: "video", 
        allowed_formats: ["mp3", "wav", "m4a"],
      };
    }

    throw new Error("Invalid field name");
  },
});


const upload = multer({ storage }).fields([
  { name: "frontImage", maxCount: 1 },
  { name: "audioFile", maxCount: 1 },
]);

module.exports = upload;
