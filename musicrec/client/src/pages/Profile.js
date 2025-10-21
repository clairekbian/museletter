// src/pages/Profile.js
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch profile data when component mounts
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setProfile(res.data);
      } catch (err) {
        setError("Failed to load profile. Please login.");
      }
    };

    fetchProfile();
  }, []);

  if (error) return <p>{error}</p>;

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div>
      <h1>Welcome, {profile.username}!</h1>
      <p>Email: {profile.email}</p>
      {/* Show other profile info here */}
    </div>
  );
}
