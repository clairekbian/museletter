const express = require("express");
const router = express.Router();
const axios = require("axios");

// Spotify OAuth configuration
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI || "http://127.0.0.1:3000/callback";

// Generate Spotify authorization URL
router.get("/auth", (req, res) => {
  const scope = "user-top-read user-read-recently-played";
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(scope)}`;
  
  res.json({ authUrl });
});

// Handle the callback from Spotify
router.get("/callback", async (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    return res.status(400).json({ message: "Authorization code not found" });
  }

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post("https://accounts.spotify.com/api/token", 
      new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: REDIRECT_URI,
        client_id: SPOTIFY_CLIENT_ID,
        client_secret: SPOTIFY_CLIENT_SECRET
      }), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    const { access_token, refresh_token } = tokenResponse.data;
    
    // Get user profile
    const userResponse = await axios.get("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const userProfile = userResponse.data;
    
    // Store tokens (in a real app, you'd save these to a database)
    // For now, we'll return them to the client
    res.json({
      success: true,
      access_token,
      refresh_token,
      user: userProfile
    });

  } catch (error) {
    console.error("Spotify callback error:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to authenticate with Spotify" });
  }
});

// Refresh Spotify access token
router.post("/refresh", async (req, res) => {
  const { refresh_token } = req.body;
  console.log("Refresh request received");
  console.log("Refresh token provided:", !!refresh_token);
  
  if (!refresh_token) {
    console.log("No refresh token in request body");
    return res.status(400).json({ message: "Refresh token required" });
  }
  
  try {
    console.log("Calling Spotify API to refresh token...");
    const tokenResponse = await axios.post("https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token,
        client_id: SPOTIFY_CLIENT_ID,
        client_secret: SPOTIFY_CLIENT_SECRET
      }), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );
    
    console.log("Spotify refresh successful");
    console.log("New access token received:", !!tokenResponse.data.access_token);
    
    res.json({
      access_token: tokenResponse.data.access_token,
      expires_in: tokenResponse.data.expires_in
    });
  } catch (error) {
    console.error("Spotify refresh error details:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to refresh token" });
  }
});

// Get user's top tracks
router.get("/top-tracks", async (req, res) => {
  const { access_token } = req.headers;
  
  if (!access_token) {
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    const response = await axios.get("https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=short_term", {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching top tracks:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to fetch top tracks" });
  }
});

// Get user's recently played tracks
router.get("/recent-tracks", async (req, res) => {
  const { access_token } = req.headers;
  
  if (!access_token) {
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    const response = await axios.get("https://api.spotify.com/v1/me/player/recently-played?limit=20", {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching recent tracks:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to fetch recent tracks" });
  }
});

module.exports = router; 