const Chef = require("../models/chefs");
const bcrypt = require("bcryptjs");

// Get chef profile by ID
exports.getChefProfile = async (req, res) => {
  try {
    const chefId = req.params.id;
    const chef = await Chef.findById(chefId).select("-password");
    if (!chef) {
      return res.status(404).json({ message: "Chef not found" });
    }
    res.json(chef);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update chef profile
exports.updateChefProfile = async (req, res) => {
  try {
    const chefId = req.params.id;
    const { username, email, password, image } = req.body; // Including image URL
    const updateData = { username, email, image }; // Image URL saved to DB

    // If password is provided, hash it before saving
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    // Update the chef's profile
    const updatedChef = await Chef.findByIdAndUpdate(chefId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password"); // Exclude the password in the response

    if (!updatedChef) {
      return res.status(404).json({ message: "Chef not found" });
    }

    res.json(updatedChef);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
