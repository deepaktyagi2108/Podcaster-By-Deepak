import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const Header = () => {
  const user = useSelector((state) => state.auth.user);
  const username = user?.username || "Guest";
  const email = user?.email || "Not logged in";

  const [podcastCount, setPodcastCount] = useState(0);

  useEffect(() => {
    const fetchUserPodcasts = async () => {
      try {
        const res = await axios.get("https://podcaster-api.onrender.com/api/v1/podcast/get-user-podcasts", {
          withCredentials: true,
          
        });
        setPodcastCount(res.data?.data?.length || 0);
      } catch (err) {
        console.log("Failed to fetch user podcasts", err);
      }
      console.log("User from Redux:", user);
    };

    fetchUserPodcasts();
  }, []);

  return (
    <div className="bg-zinc-100 px-6 py-4 rounded-md shadow-md mb-6">
      <h2 className="text-2xl font-bold mb-2">👋 Welcome, {username}!</h2>
      <p className="text-gray-600 mb-4">{email}</p>
      <div className="flex gap-4">
        <div className="bg-white px-4 py-2 rounded shadow text-center">
          <h3 className="text-lg font-semibold">{podcastCount}</h3>
          <p className="text-sm text-gray-500">Your Podcasts</p>
        </div>
      </div>
    </div>
  );
};

export default Header;


