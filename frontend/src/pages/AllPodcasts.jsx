import React, { useEffect, useState } from "react";
import axios from "axios";
import PodcastCard from "../components/PodcastCard/PodcastCard";

const AllPodcasts = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [search, setSearch] = useState("");      // actual search term sent to backend
  const [inputValue, setInputValue] = useState(""); // input field controlled state

  const fetchPodcasts = async () => {
    try {
      const endpoint = search
        ? `https://podcaster-api.onrender.com/api/v1/podcast/search?query=${search}`
        : `https://podcaster-api.onrender.com/api/v1/podcast/get-podcasts`;

      const res = await axios.get(endpoint);
      setPodcasts(res.data.data);
    } catch (err) {
      console.error("Failed to fetch podcasts:", err);
    }
  };

  useEffect(() => {
    fetchPodcasts();
  }, [search]);

  const handleDeleteFromList = (deletedId) => {
    setPodcasts((prev) => prev.filter((podcast) => podcast._id !== deletedId));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setSearch(inputValue.trim()); // set search term on Enter key press
    }
  };

  return (
    <div className="w-full lg:px-12 py-4">
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search podcasts by title..."
          className="w-full max-w-md px-4 py-2 border rounded-xl shadow-sm focus:outline-none"
        />
      </div>

      {podcasts.length === 0 ? (
        <div className="text-center text-xl font-semibold text-gray-600 py-20">
          🎧 Oops! No podcasts found.<br />
          Maybe everyone's too busy binge-watching cat videos! 🐱📺
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {podcasts.map((items) => (
            <div key={items._id}>
              <PodcastCard items={items} showFavorite={true} onDelete={handleDeleteFromList} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllPodcasts;
