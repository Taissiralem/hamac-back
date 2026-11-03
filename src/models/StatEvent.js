const mongoose = require("mongoose");
const { Schema } = mongoose;

// Mesure d'audience interne, anonyme : ni cookie ni adresse IP enregistrés.
// `visitor` est une empreinte quotidienne (IP + navigateur + jour + sel) qui change chaque jour.
const EVENT_TYPES = ["pageview", "lead", "click_to_call", "click_email", "vr_tour_start"];

const StatEventSchema = new Schema(
  {
    type: { type: String, enum: EVENT_TYPES, required: true },
    path: { type: String, default: "/" },
    locale: { type: String, default: "" },
    visitor: { type: String, required: true },
    // Arrivée sur le site (première page vue depuis l'extérieur) : porte la source
    entry: { type: Boolean, default: false },
    source: { type: String, default: "" },
    medium: { type: String, default: "" },
    campaign: { type: String, default: "" },
    device: { type: String, enum: ["mobile", "tablet", "desktop"], default: "desktop" },
    detail: { type: String, default: "" }, // ex. type de demande pour un lead
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

StatEventSchema.index({ createdAt: -1, type: 1 });
// Les données de plus de 13 mois sont supprimées automatiquement
StatEventSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 400 });

module.exports = mongoose.model("StatEvent", StatEventSchema);
module.exports.EVENT_TYPES = EVENT_TYPES;
