const { Router } = require("express");

const router = Router();
router.use("/auth", require("./authRoutes"));
router.use("/tb", require("./addSortie"));
router.use("/contact", require("./ContactRoutes"));
router.use("/newsletter", require("./NewsletterRoutes"));
router.use("/pages", require("./PageRoutes"));
router.use("/posts", require("./PostRoutes"));
router.use("/realisations", require("./RealisationRoutes"));
router.use("/upload", require("./UploadRoutes"));
router.use("/stats", require("./StatsRoutes"));

module.exports = router;
