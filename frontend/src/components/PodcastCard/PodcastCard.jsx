

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { playerActions } from "../../store/player";
import { FaHeart } from "react-icons/fa";
import toast from "react-hot-toast";
import { addFavorite, removeFavorite } from "../../store/favorites";
import { BASE_URL } from "../../utils/constants";
const PodcastCard = ({ items, showFavorite = true, onDelete }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  // const token = useSelector((state) => state.auth.token);
  const favorites = useSelector((state) => state.favorites.items);

  const isFavorited = favorites.includes(items._id);

  // Play podcast handler
  const handlePlay = (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      navigate("/signup");
      return;
    }

    if (!items.audioFile || !items.frontImage) {
      toast.error("Audio or image missing for this podcast.");
      return;
    }

    dispatch(
      playerActions.changeSong(
        `${items.audioFile}`
      )
    );
    dispatch(
      playerActions.changeImage(
        `${items.frontImage}`
      )
    );
    dispatch(playerActions.setDiv());
    dispatch(playerActions.startPlaying());
  };

  // Toggle favorite handler
  const toggleFavorite = (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast.error("Please log in to favorite podcasts.");
      return;
    }

    if (isFavorited) {
      dispatch(removeFavorite(items._id));
    } else {
      dispatch(addFavorite(items._id));
    }
  };

  // Delete podcast handler
  const handleDelete = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast.error("Please log in to delete podcasts.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this podcast?")) return;

    setDeleting(true);

    try {
     const response = await fetch(
  `${BASE_URL}/podcast/delete-podcasts/${items._id}`,
  {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // <-- This line is essential
  }
);


      const data = await response.json();

      if (response.ok) {
        toast.success("Podcast deleted successfully!");
        if (onDelete) onDelete(items._id);
      } else {
        toast.error(data.message || "Failed to delete podcast.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
      console.error(error);
    }

    setDeleting(false);
  };

  return (
    <div className="relative border p-4 rounded flex flex-col shadow-2xl hover:shadow-2xl transition-all duration-300">
      {/* Favorite button */}
      {showFavorite && isLoggedIn && (
        <button
          className="absolute top-2 right-2 transition"
          onClick={toggleFavorite}
          disabled={deleting}
          aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
        >
          <FaHeart
            className={`text-2xl ${
              isFavorited ? "text-red-500" : "text-gray-300"
            } transition-all duration-300`}
          />
        </button>
      )}

      {/* Podcast Link & Info */}
      <Link to={`/podcast/${items._id}`} className="flex flex-col gap-2">
        <div>
          <img
            src={`${items.frontImage}`}
            className="rounded size-[42vh] object-cover"
            alt={items.title}
          />
        </div>
        <div className="mt-2 text-xl font-bold">
          {items.title?.slice(0, 30) || "Untitled"}
        </div>
        <div className="mt-2 leading-5 text-slate-500">
          {items.description?.slice(0, 120) || "No Description"}
        </div>
        <div className="mt-2 bg-orange-100 text-orange-300 border border-orange-700 rounded-full px-4 py-2 text-center">
          {items.category?.categoryName || "Unknown"}
        </div>
      </Link>

      {/* Play Button */}
      <button
        onClick={handlePlay}
        className="bg-green-900 text-white px-4 py-2 rounded mt-2 flex items-center justify-center hover:bg-green-800 transition-all duration-300"
        disabled={deleting}
      >
        Play Now
      </button>

      {/* Delete Button */}
      <button
        onClick={handleDelete}
        className="bg-red-600 text-white px-4 py-2 rounded mt-2 hover:bg-red-700 transition-all duration-300"
        disabled={deleting}
      >
        {deleting ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
};

export default PodcastCard;
