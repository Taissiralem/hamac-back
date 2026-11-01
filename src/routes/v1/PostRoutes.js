const { Router } = require("express");
const postController = require("../../controllers/postController.js");
const { adminAuthAndRoleCheck } = require("../../middlewares/authcheck.js");

const router = Router();
// Public
router.get("/", postController.getPublishedPosts);
router.get("/slug/:slug", postController.getPublishedPostBySlug);
// Admin
router.get("/admin", adminAuthAndRoleCheck, postController.getAllPosts);
router.get("/admin/:id", adminAuthAndRoleCheck, postController.getPostById);
router.post("/", adminAuthAndRoleCheck, postController.createPost);
router.put("/:id", adminAuthAndRoleCheck, postController.updatePostById);
router.delete("/:id", adminAuthAndRoleCheck, postController.deletePostById);

module.exports = router;
