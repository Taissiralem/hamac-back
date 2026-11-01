const { Router } = require("express");
const NewsletterController = require("../../controllers/Newslettercontroller.js");
const { adminAuthAndRoleCheck } = require("../../middlewares/authcheck.js");
const router = Router();

router.post("/", NewsletterController.createNewsletter);
router.get("/", adminAuthAndRoleCheck, NewsletterController.getAllNewsletters);
router.get("/count", adminAuthAndRoleCheck, NewsletterController.getAllNewslettersCount);
router.delete("/:id", adminAuthAndRoleCheck, NewsletterController.deleteNewsletter);
module.exports = router;
