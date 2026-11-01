const multer = require("multer");
const fs = require("fs");
const path = require("path");
const upload = require("../config/multerConfig");
const cloudinary = require("../config/cloudinaryConfig");

const UPLOAD_DIR = path.join(__dirname, "..", "..", "uploads");

// En local (UPLOAD_DRIVER=local ou Cloudinary non configuré), les images sont
// copiées dans /uploads et servies par Express. Sinon elles partent sur Cloudinary.
const useLocalStorage = () =>
  process.env.UPLOAD_DRIVER === "local" || !process.env.CLOUD_NAME;

const storeImage = async (file) => {
  if (!useLocalStorage()) {
    const result = await cloudinary.uploader.upload(file.path, { folder: "hamac-events" });
    return result.secure_url;
  }
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
  const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  fs.copyFileSync(file.path, path.join(UPLOAD_DIR, name));
  const base = process.env.PUBLIC_URL || `http://localhost:${process.env.PORT}`;
  return `${base}/uploads/${name}`;
};

exports.UPLOAD_DIR = UPLOAD_DIR;

exports.imageUpload = (req, res, next) => {
  upload.single("image")(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: "Multer error: " + err.message });
    } else if (err) {
      return res.status(400).json({ message: "Error: " + err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file provided." });
    }
    try {
      req.image = await storeImage(req.file);
      return next();
    } catch (error) {
      console.error("Image upload error:", error);
      return res.status(500).json({ message: "Error uploading image" });
    }
  });
};

exports.multipleImageUpload = (req, res, next) => {
  upload.array("images", 10)(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: "Multer error: " + err.message });
    } else if (err) {
      return res.status(500).json({ message: "Error: " + err.message });
    }

    if (!req.files || req.files.length === 0) {
      req.imageURLs = []; // Ensure `imageURLs` is always set, even when no images are uploaded.
      return next();
    }

    try {
      req.imageURLs = await Promise.all(req.files.map(storeImage));
      next();
    } catch (error) {
      console.error("Image upload error:", error);
      return res.status(500).json({ message: "Error uploading images" });
    }
  });
};
