const multer = require("multer");
const upload = require("../config/multerConfig");
const cloudinary = require("../config/cloudinaryConfig");

exports.imageUpload = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).send("Multer error: " + err.message);
    } else if (err) {
      return res.status(500).send("Error: " + err.message);
    }
    if (req.file) {
      cloudinary.uploader.upload(req.file.path, (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).send("Error uploading image to Cloudinary");
        }
        req.image = result.secure_url;
        return next();
      });
    } else {
      return res.status(400).send("No file provided.");
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
      // Upload images to Cloudinary
      const uploadedImages = await Promise.all(
        req.files.map((file) =>
          cloudinary.uploader
            .upload(file.path)
            .then((result) => result.secure_url)
        )
      );

      req.imageURLs = uploadedImages; // Store uploaded image URLs in request
      next();
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      return res
        .status(500)
        .json({ message: "Error uploading images to Cloudinary" });
    }
  });
};
