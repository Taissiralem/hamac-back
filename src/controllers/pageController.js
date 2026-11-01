const Page = require("../models/Page.js");

const KEY_PATTERN = /^[a-z0-9-]+$/;

// Récupérer le contenu d'une page (objet vide si elle n'a jamais été éditée)
exports.getPage = async (req, res) => {
  try {
    const { key } = req.params;
    const page = await Page.findOne({ key });
    res.status(200).json({ key, data: page ? page.data : {}, updatedAt: page?.updatedAt });
  } catch (error) {
    console.error("Error fetching page:", error);
    res.status(500).json({ error: "Failed to fetch page" });
  }
};

exports.getAllPages = async (req, res) => {
  try {
    const pages = await Page.find({}, { key: 1, updatedAt: 1 }).sort({ key: 1 });
    res.status(200).json(pages);
  } catch (error) {
    console.error("Error fetching pages:", error);
    res.status(500).json({ error: "Failed to fetch pages" });
  }
};

// Créer ou remplacer le contenu d'une page
exports.upsertPage = async (req, res) => {
  try {
    const { key } = req.params;
    const { data } = req.body;
    if (!KEY_PATTERN.test(key)) {
      return res.status(400).json({ error: "Invalid page key" });
    }
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return res.status(400).json({ error: "`data` must be an object" });
    }
    const page = await Page.findOneAndUpdate(
      { key },
      { $set: { data } },
      { new: true, upsert: true }
    );
    res.status(200).json(page);
  } catch (error) {
    console.error("Error saving page:", error);
    res.status(500).json({ error: "Failed to save page" });
  }
};
