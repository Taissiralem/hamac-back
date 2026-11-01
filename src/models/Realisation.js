const mongoose = require("mongoose");
const i18nField = require("./i18nField");
const { Schema } = mongoose;

const CATEGORIES = ["salons", "team-building", "sorties"];

const RealisationSchema = new Schema(
  {
    title: i18nField(true),
    description: i18nField(),
    client: { type: String, default: "" },
    location: { type: String, default: "" },
    date: { type: String, default: "" },
    category: { type: String, enum: CATEGORIES, default: "salons" },
    images: [{ type: String }],
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Realisation = mongoose.model("Realisation", RealisationSchema);

module.exports = Realisation;
module.exports.CATEGORIES = CATEGORIES;
