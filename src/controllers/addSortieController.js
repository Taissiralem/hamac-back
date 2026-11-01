const AddSortie = require("../models/addSortie.js");

// Create a new sortie
exports.createSortie = async (req, res) => {
  try {
    const { titleFr, titleEn, descFr, descEn, days, localisation, category, existingImages } = req.body;
    // Images déjà envoyées (URL) + fichiers joints à la requête
    const urls = Array.isArray(existingImages) ? existingImages : [existingImages].filter(Boolean);
    const images = [...urls, ...(req.imageURLs || [])];

    const newSortie = new AddSortie({
      titleFr,
      titleEn,
      descFr,
      descEn,
      days,
      localisation,
      category,
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
      category,
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
          ...(category && { category }),
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
    // ?all=1 : tout renvoyer d'un coup (pages du site) ; sinon pagination par 9 (admin historique)
    const pageSize = req.query.all ? 0 : 9;

    // ?category=team-building inclut les anciens programmes, qui n'ont pas de catégorie
    const filter = {};
    if (req.query.category === "sortie") filter.category = "sortie";
    else if (req.query.category === "team-building") filter.category = { $ne: "sortie" };

    const sorties = await AddSortie.find(filter)
      .sort({ createdAt: -1 })
      .skip(pageSize ? (page - 1) * pageSize : 0)
      .limit(pageSize);

    const totalCount = await AddSortie.countDocuments(filter);
    const totalPages = pageSize ? Math.ceil(totalCount / pageSize) : 1;

    res.status(200).json({ sorties, totalPages, currentPage: page });
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
