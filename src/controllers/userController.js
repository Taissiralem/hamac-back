const User = require("../models/user.js");

// Fetch a user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.authuser.id !== id && req.authuser.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};