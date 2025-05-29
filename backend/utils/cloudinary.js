// utils/cloudinary.js
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary Multer Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const folder = "podcaster";

    if (file.fieldname === "frontImage") {
      return {
        folder: `${folder}/images`,
        resource_type: "image",
        format: "webp",
        public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
      };
    }

    if (file.fieldname === "audioFile") {
      return {
        folder: `${folder}/audios`,
        resource_type: "video", // audio files are uploaded as 'video' type
        format: "mp3",
        public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
      };
    }
  },
});

module.exports = { cloudinary, storage };
