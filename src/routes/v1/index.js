const { Router } = require("express");

const router = Router();
router.use("/auth", require("./authRoutes"));
// router.use("/newsletter", require("./NewsletterRoutes"));

module.exports = router;
