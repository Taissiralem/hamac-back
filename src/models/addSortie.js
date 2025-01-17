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
  },
  {
    timestamps: true,
  }
);

const AddSortie = mongoose.model("AddSortie", addSortieSchema);

module.exports = AddSortie;
