const { Router } = require("express");
const authcontroller = require("../../controllers/authcontroller.js");
const { adminAuthAndRoleCheck } = require("../../middlewares/authcheck.js");

const router = Router();
router.post("/signin", authcontroller.signin);
router.get("/me", adminAuthAndRoleCheck, authcontroller.me);

module.exports = router;
