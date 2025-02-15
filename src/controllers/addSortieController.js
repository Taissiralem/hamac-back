const AddSortie = require("../models/addSortie.js");

// Create a new sortie
exports.createSortie = async (req, res) => {
  try {
    const { titleFr, titleEn, descFr, descEn, days, localisation } = req.body;
    const images = req.imageURLs || [];

    const newSortie = new AddSortie({
      titleFr,
      titleEn,
      descFr,
      descEn,
      days,
      localisation,
      images,
    });

    const savedSortie = await newSortie.save();
    res.status(201).json(savedSortie);
  } catch (error) {
    console.error("Error creating sortie:", error);
    res.status(500).json({ error: "Failed to create sortie", error });
  }
};

// Update a sortie by ID
exports.updateSortieById = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      titleFr,
      titleEn,
      descFr,
      descEn,
      days,
      localisation,
      existingImages, // Expect this as an array
    } = req.body;

    const newImages = req.imageURLs || []; // New images from middleware

    // Ensure existingImages is always an array
    const validExistingImages = Array.isArray(existingImages)
      ? existingImages
      : [existingImages].filter(Boolean); // Convert single string to array if necessary

    // Merge existing and new images
    const updatedImages =
      newImages.length > 0
        ? [...validExistingImages, ...newImages]
        : validExistingImages;

    // Update the sortie
    const updatedSortie = await AddSortie.findByIdAndUpdate(
      id,
      {
        $set: {
          titleFr,
          titleEn,
          descFr,
          descEn,
          days,
          localisation,
          images: updatedImages, // Use merged images
        },
      },
      { new: true } // Return the updated document
    );

    if (!updatedSortie) {
      return res.status(404).json({ error: "Sortie not found" });
    }

    res.status(200).json(updatedSortie);
  } catch (error) {
    console.error("Error updating sortie:", error);
    res
      .status(500)
      .json({ error: "Failed to update sortie", details: error.message });
  }
};

// Get all sorties
exports.getAllSorties = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;

    const sorties = await AddSortie.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const totalCount = await AddSortie.countDocuments();
    const totalPages = Math.ceil(totalCount / pageSize);

    res.status(200).json({ sorties, totalPages });
  } catch (error) {
    console.error("Error fetching sorties:", error);
    res.status(500).json({ error: "Failed to fetch sorties" });
  }
};

// Get a sortie by ID
exports.getSortieById = async (req, res) => {
  try {
    const { id } = req.params;
    const sortie = await AddSortie.findById(id);

    if (!sortie) {
      return res.status(404).json({ error: "Sortie not found" });
    }

    res.status(200).json(sortie);
  } catch (error) {
    console.error("Error fetching sortie:", error);
    res.status(500).json({ error: "Failed to fetch sortie" });
  }
};

// Delete a sortie by ID
exports.deleteSortieById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSortie = await AddSortie.findByIdAndDelete(id);

    if (!deletedSortie) {
      return res.status(404).json({ error: "Sortie not found" });
    }

    res.status(200).json({ message: "Sortie deleted successfully" });
  } catch (error) {
    console.error("Error deleting sortie:", error);
    res.status(500).json({ error: "Failed to delete sortie" });
  }
};
