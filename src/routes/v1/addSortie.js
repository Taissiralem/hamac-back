const { Router } = require("express");
const addSortieController = require("../../controllers/addSortieController");
const { multipleImageUpload } = require("../../middlewares/ImageUpload.js");
const { adminAuthAndRoleCheck } = require("../../middlewares/authcheck.js");

const router = Router();
router.post(
  "/addSortie",
  adminAuthAndRoleCheck,
  multipleImageUpload,
  addSortieController.createSortie
);
router.get("/addSortie", addSortieController.getAllSorties);
router.get("/addSortie/:id", addSortieController.getSortieById);
router.put(
  "/addSortie/:id",
  adminAuthAndRoleCheck,
  multipleImageUpload,
  addSortieController.updateSortieById
);
router.delete("/addSortie/:id", adminAuthAndRoleCheck, addSortieController.deleteSortieById);

module.exports = router;
