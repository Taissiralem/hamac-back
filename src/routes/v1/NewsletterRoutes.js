const { Router } = require("express");
const NewsletterController = require("../../controllers/Newslettercontroller.js");
const router = Router();

router.get("/", NewsletterController.getAllNewsletters);
router.post("/", NewsletterController.createNewsletter);
router.get("/count", NewsletterController.getAllNewslettersCount);
router.delete("/:id", NewsletterController.deleteNewsletter);
module.exports = router;
