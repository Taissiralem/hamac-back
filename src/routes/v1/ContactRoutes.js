const { Router } = require("express");
const Contactcontroller = require("../../controllers/Contactcontroller.js");
const { adminAuthAndRoleCheck } = require("../../middlewares/authcheck.js");
const router = Router();

router.post("/create", Contactcontroller.createContactMessage);
router.get("/", adminAuthAndRoleCheck, Contactcontroller.getAllMessage);
router.get("/stats", adminAuthAndRoleCheck, Contactcontroller.getContactStats);
router.patch("/:id", adminAuthAndRoleCheck, Contactcontroller.updateContact);
router.delete("/:id", adminAuthAndRoleCheck, Contactcontroller.deleteContact);

module.exports = router;
