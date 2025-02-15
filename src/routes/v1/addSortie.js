const { Router } = require("express");
const addSortieController = require("../../controllers/addSortieController");
const {
  multipleImageUpload,
  imageUpload,
} = require("../../middlewares/ImageUpload.js");

const router = Router();
router.post(
  "/addSortie",
  multipleImageUpload,
  addSortieController.createSortie
);
router.get("/addSortie", addSortieController.getAllSorties);
router.get("/addSortie/:id", addSortieController.getSortieById);
router.put(
  "/addSortie/:id",
  multipleImageUpload,
  addSortieController.updateSortieById
);
router.delete("/addSortie/:id", addSortieController.deleteSortieById);

module.exports = router;
