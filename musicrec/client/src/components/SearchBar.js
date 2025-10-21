import React, { useState } from "react";
import axios from "axios";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`/music/search?q=${encodeURIComponent(query)}`);
      setResults(response.data);
    } catch (err) {
      setError("Failed to search for music");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for music..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: "8px", marginRight: "8px", width: "300px" }}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {results.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Search Results:</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {results.map((track) => (
              <li key={track.id} style={{ 
                margin: "10px 0", 
                padding: "15px", 
                border: "1px solid #ddd",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
                  <img
                    src={track.album.images[0]?.url || "https://via.placeholder.com/50x50?text=No+Image"}
                    alt={`${track.album.name} cover`}
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "4px",
                      marginRight: "15px",
                      objectFit: "cover"
                    }}
                  />
                  <div>
                    <strong>{track.name}</strong> - {track.artists.map(artist => artist.name).join(", ")}
                    <br />
                    <small>{track.album.name}</small>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <a
                    href={track.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: "5px 10px",
                      borderRadius: "4px",
                      border: "1px solid #1db954",
                      background: "#1db954",
                      color: "white",
                      textDecoration: "none",
                      fontSize: "12px"
                    }}
                  >
                    🎵 Open in Spotify
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 