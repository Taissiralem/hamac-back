const mongoose = require("mongoose");
const bcrypte = require("bcryptjs");
const { Schema } = mongoose;

const addSortieSchema = new Schema(
  {
    titleFr: {
      type: String,
      required: true,
    },
    titleEn: {
      type: String,
      required: true,
    },
    descFr: {
      type: String,
      required: true,
      unique: true,
    },
    descEn: {
      type: String,
      required: true,
    },
    days: {
      type: String,
    },
    localisation: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    // Page du site où le programme apparaît (les anciens programmes n'ont pas ce champ : team building)
    category: {
      type: String,
      enum: ["team-building", "sortie"],
      default: "team-building",
    },
  },
  {
    timestamps: true,
  }
);

const AddSortie = mongoose.model("AddSortie", addSortieSchema);

module.exports = AddSortie;
