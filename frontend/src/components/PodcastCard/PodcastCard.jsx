

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { playerActions } from "../../store/player";
import { FaHeart } from "react-icons/fa";
import {
  addFavorite,
  removeFavorite,
} from "../../store/favorites";

const PodcastCard = ({ items, showFavorite = true }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const favorites = useSelector((state) => state.favorites.items);

  const isFavorited = favorites.includes(items._id);

  const handlePlay = (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      navigate("/signup");
      return;
    }

    if (!items.audioFile || !items.frontImage) {
      alert("Audio or image missing for this podcast.");
      return;
    }

    dispatch(playerActions.changeSong(`https://podcaster-api.vercel.app/${items.audioFile}`));
    dispatch(playerActions.changeImage(`https://podcaster-api.vercel.app/${items.frontImage}`));
    dispatch(playerActions.setDiv());
    dispatch(playerActions.startPlaying());
  };

  const toggleFavorite = (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert("Please log in to favorite podcasts.");
      return;
    }

    if (isFavorited) {
      dispatch(removeFavorite(items._id));
    } else {
      dispatch(addFavorite(items._id));
    }
  };

  return (
    <div className="relative border p-4 rounded flex flex-col shadow-2xl hover:shadow-2xl transition-all duration-300">
      {/* Favorite Heart - Only when logged in */}
      {showFavorite && isLoggedIn && (
        <button
          className="absolute top-2 right-2 transition"
          onClick={toggleFavorite}
        >
          <FaHeart
            className={`text-2xl ${
              isFavorited ? "text-red-500" : "text-gray-300"
            } transition-all duration-300`}
          />
        </button>
      )}

      {/* Podcast Content */}
      <Link to={`/podcast/${items._id}`} className="flex flex-col gap-2">
        <div>
          <img
            src={`https://podcaster-api.vercel.app/${items.frontImage}`}
            className="rounded size-[42vh] object-cover"
            alt={items.title}
          />
        </div>
        <div className="mt-2 text-xl font-bold">
          {items.title?.slice(0, 30) || "Untitled"}
        </div>
        <div className="mt-2 leading-5 text-slate-500">
          {items.description?.slice(0, 120)||"No Description"}
        </div>
        <div className="mt-2 bg-orange-100 text-orange-300 border border-orange-700 rounded-full px-4 py-2 text-center">
          {items.category?.categoryName || "Unknown"}
        </div>

        <button
          onClick={handlePlay}
          className="bg-green-900 text-white px-4 py-2 rounded mt-2 flex items-center justify-center hover:bg-green-800 transition-all duration-300"
        >
          Play Now
        </button>
      </Link>
    </div>
  );
};

export default PodcastCard;



