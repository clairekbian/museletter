const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Get user profile
router.get("/", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token missing" });
  
  try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id, "-password");
    if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
  } catch (err) {
    if (err.name === "JsonWebTokenError") return res.status(403).json({ message: "Invalid token" });
    res.status(500).json({ message: "Server error" });
  }
});

// Update user profile
router.put("/", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token missing" });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { name, profilePicture, country } = req.body;
    
    console.log("Profile update request for user:", decoded.id);
    console.log("Update data:", { 
      name: name ? "provided" : "not provided", 
      profilePicture: profilePicture ? "base64 data present" : "not provided", 
      country: country ? "provided" : "not provided" 
    });
    
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    // Update fields if provided
    if (name !== undefined) user.name = name;
    if (profilePicture !== undefined) user.profilePicture = profilePicture;
    if (country !== undefined) user.country = country;
    
    await user.save();
    console.log("Profile updated successfully for user:", decoded.id);
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Profile update error:", err);
    if (err.name === "JsonWebTokenError") return res.status(403).json({ message: "Invalid token" });
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
