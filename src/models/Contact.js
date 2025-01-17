const mongoose = require("mongoose");

const { Schema } = mongoose;

const ContactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    firstName: {
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
  },
  {
    timestamps: true,
  }
);

const Contact = mongoose.model("Contact", ContactSchema);

module.exports = Contact;
