const User = require("../models/User"); // Assuming your User model is at this path

const getUserProfile = async (req, res) => {
  try {
    // req.user is set by auth middleware and should have an id or _id property
    const userId = req.user.id || req.user._id;

    if (!userId) {
      return res.status(400).json({ message: "User ID not found in request." });
    }

    // Exclude password and sensitive fields
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user profile.", error: error.message });
  }
};

module.exports = {
  getUserProfile,
};