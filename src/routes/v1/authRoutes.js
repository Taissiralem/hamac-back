const { Router } = require("express");
const authcontroller = require("../../controllers/authcontroller.js");

const router = Router();
router.post("/signin", authcontroller.signin);
router.post("/signup", authcontroller.signup);

module.exports = router;
