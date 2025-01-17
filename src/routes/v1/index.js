const { Router } = require("express");

const router = Router();
router.use("/auth", require("./authRoutes"));
router.use("/tb", require("./addSortie"));
router.use("/contact", require("./ContactRoutes"));

module.exports = router;
