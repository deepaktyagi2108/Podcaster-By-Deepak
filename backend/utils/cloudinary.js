// utils/cloudinary.js
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: "YOUR_CLOUD_NAME",     // replace with your Cloudinary cloud name
  api_key: "YOUR_API_KEY",           // replace with your Cloudinary API key
  api_secret: "YOUR_API_SECRET",     // replace with your Cloudinary API secret
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "podcasts",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "mp3", "wav", "m4a", "aac", "ogg"],
  },
});

module.exports = { storage };
