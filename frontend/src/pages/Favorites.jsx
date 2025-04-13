

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PodcastCard from "../components/PodcastCard/PodcastCard";
import axios from "axios";

const Favorites = () => {
  const favoriteIds = useSelector((state) => state.favorites.items);
  const [allPodcasts, setAllPodcasts] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get("http://localhost:1000/api/v1/podcast/get-podcasts");
        setAllPodcasts(res.data.data);
      } catch (err) {
        console.error("Failed to fetch podcasts:", err);
      }
    };
    fetch();
  }, []);

  const favoritePodcasts = allPodcasts.filter((pod) =>
    favoriteIds.includes(pod._id)
  );

  return (
    <div className="px-6 py-4">
      <h2 className="text-3xl font-bold mb-4">Your Favorites ❤️</h2>
      {favoritePodcasts.length === 0 ? (
        <div className="text-center text-xl font-semibold text-gray-600 py-20">
          😢 No favorites yet?<br />
          Looks like your heart hasn’t met its favorite soundwaves! 💔🎶
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {favoritePodcasts.map((items) => (
            <PodcastCard key={items._id} items={items} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;


