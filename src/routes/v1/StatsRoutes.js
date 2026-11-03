const express = require("express");
const statsController = require("../../controllers/statsController");
const { adminAuthAndRoleCheck } = require("../../middlewares/authcheck");

const router = express.Router();

// sendBeacon envoie du text/plain (pas de requête CORS préalable)
router.post("/collect", express.text({ type: "*/*", limit: "4kb" }), statsController.collect);
router.get("/summary", adminAuthAndRoleCheck, statsController.summary);

module.exports = router;
