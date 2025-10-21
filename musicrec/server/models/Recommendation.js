const mongoose = require("mongoose");

const RecommendationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: false // Allow null for system recommendations
  },
  track: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    artists: [{ name: String }],
    album: {
      name: String,
      images: [{ url: String }]
    },
    external_urls: {
      spotify: String
    }
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  // Track if this recommendation has been consumed/assigned to someone
  consumed: {
    type: Boolean,
    default: false
  },
  // Track who consumed this recommendation (if any)
  consumedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  // When it was consumed
  consumedAt: {
    type: Date,
    default: null
  },
  // Flag to identify system recommendations
  isSystemRecommendation: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Recommendation", RecommendationSchema); 