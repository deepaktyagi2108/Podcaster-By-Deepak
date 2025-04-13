import React from "react";

const UserStats = ({ totalPodcasts, favorites = 0, categories = 0 }) => {
  return (
    <div className="flex gap-6 mt-2 text-white text-sm">
      <div>
        <strong className="text-lg">{totalPodcasts}</strong>Podcasts
      </div>
      <div>
        <strong className="text-lg">{favorites}</strong>Favorites
      </div>
      <div>
        <strong className="text-lg">{categories}</strong> Categories
      </div>
    </div>
  );
};

export default UserStats;
