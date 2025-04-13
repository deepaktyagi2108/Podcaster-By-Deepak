

import React, { useEffect, useState } from "react";
import axios from "axios";
import PodcastCard from "../components/PodcastCard/PodcastCard";

const AllPodcasts = () => {
  const [Podcasts, setPodcasts] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get("https://podcaster-api.vercel.app/api/v1/podcast/get-podcasts");
        setPodcasts(res.data.data);
      } catch (err) {
        console.error("Failed to fetch podcasts:", err);
      }
    };

    fetch();
  }, []);

  return (
    <div className="w-full lg:px-12 py-4">
      {Podcasts.length === 0 ? (
        <div className="text-center text-xl font-semibold text-gray-600 py-20">
          🎧 Oops! No podcasts found.<br />
          Maybe everyone's too busy binge-watching cat videos! 🐱📺
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {Podcasts.map((items, i) => (
            <div key={i}>
              <PodcastCard items={items} showFavorite={true} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllPodcasts;


