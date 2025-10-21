const express = require("express");
const router = express.Router();
const axios = require("axios");

let accessToken = "";

async function getSpotifyToken() {
  try {
  const res = await axios.post(
    "https://accounts.spotify.com/api/token",
    new URLSearchParams({ grant_type: "client_credentials" }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
          ).toString("base64"),
      },
    }
  );
  accessToken = res.data.access_token;
    console.log("Spotify token obtained successfully");
  } catch (error) {
    console.error("Error getting Spotify token:", error.message);
  }
}

getSpotifyToken();
setInterval(getSpotifyToken, 1000 * 60 * 60); // refresh every hour

router.get("/search", async (req, res) => {
  try {
  const q = req.query.q;
    if (!q) {
      return res.status(400).json({ message: "Query parameter 'q' is required" });
    }
    
    if (!accessToken) {
      return res.status(500).json({ message: "Spotify token not available" });
    }

    console.log("Searching for:", q);
    const result = await axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=20`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
    
    console.log("Spotify response received");
    
    // Log preview URLs for debugging
    const tracks = result.data.tracks.items;
    const tracksWithPreviews = tracks.filter(track => track.preview_url);
    console.log(`Found ${tracksWithPreviews.length} tracks with preview URLs out of ${tracks.length} total tracks`);
    
    if (tracksWithPreviews.length > 0) {
      console.log("Sample tracks with previews:", tracksWithPreviews.slice(0, 3).map(t => ({ name: t.name, preview_url: t.preview_url })));
    }
    
    res.json(tracks);
  } catch (error) {
    console.error("Search error:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to search for music" });
  }
});

module.exports = router;
