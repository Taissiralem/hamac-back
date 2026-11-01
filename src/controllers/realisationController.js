const Realisation = require("../models/Realisation.js");

const pickFields = (body) => {
  const { title, description, client, location, date, category, images, featured, order } = body;
  const fields = { title, description, client, location, date, category, images, featured, order };
  Object.keys(fields).forEach((k) => fields[k] === undefined && delete fields[k]);
  return fields;
};

// Liste publique, filtrable par catégorie et/ou mise en avant
exports.getRealisations = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.featured === "true") filter.featured = true;
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);

    const realisations = await Realisation.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .limit(limit);
    res.status(200).json(realisations);
  } catch (error) {
    console.error("Error fetching realisations:", error);
    res.status(500).json({ error: "Failed to fetch realisations" });
  }
};

exports.getRealisationById = async (req, res) => {
  try {
    const realisation = await Realisation.findById(req.params.id);
    if (!realisation) {
      return res.status(404).json({ error: "Realisation not found" });
    }
    res.status(200).json(realisation);
  } catch (error) {
    console.error("Error fetching realisation:", error);
    res.status(500).json({ error: "Failed to fetch realisation" });
  }
};

exports.createRealisation = async (req, res) => {
  try {
    const realisation = await Realisation.create(pickFields(req.body));
    res.status(201).json(realisation);
  } catch (error) {
    console.error("Error creating realisation:", error);
    res.status(400).json({ error: "Failed to create realisation", details: error.message });
  }
};

exports.updateRealisationById = async (req, res) => {
  try {
    const updated = await Realisation.findByIdAndUpdate(
      req.params.id,
      { $set: pickFields(req.body) },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Realisation not found" });
    }
    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating realisation:", error);
    res.status(400).json({ error: "Failed to update realisation", details: error.message });
  }
};

exports.deleteRealisationById = async (req, res) => {
  try {
    const deleted = await Realisation.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Realisation not found" });
    }
    res.status(200).json({ message: "Realisation deleted successfully" });
  } catch (error) {
    console.error("Error deleting realisation:", error);
    res.status(500).json({ error: "Failed to delete realisation" });
  }
};
