// L'image a déjà été stockée (Cloudinary ou disque local) par le middleware imageUpload
exports.uploadImage = (req, res) => {
  res.status(201).json({ url: req.image });
};
