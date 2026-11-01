const Contact = require("../models/Contact.js");
const { NEED_TYPES, STATUSES } = require("../models/Contact.js");

exports.createContactMessage = async (req, res) => {
  try {
    const { email, name, firstName, company, message, phonenumber, motif, type, website } =
      req.body;

    // Champ piège anti-spam : rempli uniquement par les robots
    if (website) {
      return res.status(201).json({ message: "ok" });
    }

    const newContact = new Contact({
      email,
      name,
      firstName,
      company,
      message,
      phonenumber,
      motif,
      type: NEED_TYPES.includes(type) ? type : "autre",
    });

    const savedContact = await newContact.save();
    res.status(201).json({ message: "ok", id: savedContact._id });
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Missing required fields" });
    }
    res.status(500).json({ error: "Failed to create Contact" });
  }
};

exports.getAllMessage = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;
    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    if (req.query.status) filter.status = req.query.status;

    const totalCount = await Contact.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / pageSize);
    const Contacts = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.status(200).json({ Contacts, totalPages, totalCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch Contacts" });
  }
};

exports.getContactStats = async (req, res) => {
  try {
    const [byStatus, byType] = await Promise.all([
      Contact.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Contact.aggregate([{ $group: { _id: "$type", count: { $sum: 1 } } }]),
    ]);
    res.status(200).json({ byStatus, byType });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Suivi d'une demande : statut et notes internes
exports.updateContact = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const update = {};
    if (status !== undefined) {
      if (!STATUSES.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      update.status = status;
    }
    if (notes !== undefined) update.notes = notes;

    const contact = await Contact.findByIdAndUpdate(req.params.id, { $set: update }, { new: true });
    if (!contact) {
      return res.status(404).json({ error: "contact not found" });
    }
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      return res.status(404).json({ error: "contact not found" });
    }
    res.status(200).json({ message: "contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
