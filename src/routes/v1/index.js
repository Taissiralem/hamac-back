const { Router } = require("express");

const router = Router();
router.use("/auth", require("./authRoutes"));
router.use("/tb", require("./addSortie"));
router.use("/contact", require("./ContactRoutes"));
router.use("/newsletter", require("./NewsletterRoutes"));

module.exports = router;
