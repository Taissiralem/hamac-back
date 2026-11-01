const { Router } = require("express");
const uploadController = require("../../controllers/uploadController.js");
const { imageUpload } = require("../../middlewares/ImageUpload.js");
const { adminAuthAndRoleCheck } = require("../../middlewares/authcheck.js");

const router = Router();
router.post("/", adminAuthAndRoleCheck, imageUpload, uploadController.uploadImage);

module.exports = router;
