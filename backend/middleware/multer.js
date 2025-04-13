
const multer = require("multer");
const path = require("path");

// Set storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter (optional: only allow images/audio)
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  const allowedAudioTypes = ["audio/mpeg", "audio/wav", "audio/mp3", "audio/x-wav", "audio/x-m4a", "audio/aac", "audio/ogg"];

  if (
    (file.fieldname === "frontImage" && allowedImageTypes.includes(file.mimetype)) ||
    (file.fieldname === "audioFile" && allowedAudioTypes.includes(file.mimetype))
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

// Initialize upload
const upload = multer({
  storage,
  fileFilter,
}).fields([
  { name: "frontImage", maxCount: 1 },
  { name: "audioFile", maxCount: 1 },
]);

module.exports = upload;


