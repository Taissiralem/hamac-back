const mongoose = require("mongoose");

const { Schema } = mongoose;

const NEED_TYPES = ["salon", "team-building", "sortie", "autre"];
const STATUSES = ["nouveau", "en-cours", "traite"];

const ContactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
    },
    company: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    phonenumber: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    // Type de besoin choisi dans le formulaire
    type: {
      type: String,
      enum: NEED_TYPES,
      default: "autre",
    },
    // Page d'origine du formulaire (ancien champ, conservé)
    motif: {
      type: String,
    },
    status: {
      type: String,
      enum: STATUSES,
      default: "nouveau",
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Contact = mongoose.model("Contact", ContactSchema);

module.exports = Contact;
module.exports.NEED_TYPES = NEED_TYPES;
module.exports.STATUSES = STATUSES;
