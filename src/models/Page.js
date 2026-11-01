const mongoose = require("mongoose");
const { Schema } = mongoose;

// Contenu éditable d'une page (ou des paramètres globaux, key = "settings").
// La structure de `data` est définie côté front par le schéma de chaque page.
const PageSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    data: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, minimize: false }
);

const Page = mongoose.model("Page", PageSchema);

module.exports = Page;
