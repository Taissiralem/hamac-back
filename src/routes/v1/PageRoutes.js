const { Router } = require("express");
const pageController = require("../../controllers/pageController.js");
const { adminAuthAndRoleCheck } = require("../../middlewares/authcheck.js");

const router = Router();
router.get("/", adminAuthAndRoleCheck, pageController.getAllPages);
router.get("/:key", pageController.getPage);
router.put("/:key", adminAuthAndRoleCheck, pageController.upsertPage);

module.exports = router;
