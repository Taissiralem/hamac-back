const { Router } = require("express");
const realisationController = require("../../controllers/realisationController.js");
const { adminAuthAndRoleCheck } = require("../../middlewares/authcheck.js");

const router = Router();
router.get("/", realisationController.getRealisations);
router.get("/:id", realisationController.getRealisationById);
router.post("/", adminAuthAndRoleCheck, realisationController.createRealisation);
router.put("/:id", adminAuthAndRoleCheck, realisationController.updateRealisationById);
router.delete("/:id", adminAuthAndRoleCheck, realisationController.deleteRealisationById);

module.exports = router;
