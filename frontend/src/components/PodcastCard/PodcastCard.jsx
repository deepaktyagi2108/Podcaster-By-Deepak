import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import toast from "react-hot-toast";
import { playerActions } from "../../store/player";
import { addFavorite, removeFavorite } from "../../store/favorites";
import { BASE_URL } from "../../utils/constants";

// Utility function to truncate text
const truncateText = (text, maxLength) => {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

const PodcastCard = ({ items, showFavorite = true, onDelete }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isMyPodcastPage = location.pathname === "/my-podcasts";

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const favorites = useSelector((state) => state.favorites.items);
  const isFavorited = favorites.includes(items._id);

  const [deleting, setDeleting] = useState(false);

  const handlePlay = (e) => {
    e.preventDefault();
    if (!isLoggedIn) return navigate("/signup");
    if (!items.audioFile || !items.frontImage) {
      toast.error("Audio or image missing for this podcast.");
      return;
    }

    dispatch(playerActions.changeSong(items.audioFile));
    dispatch(playerActions.changeImage(items.frontImage));
    dispatch(playerActions.setDiv());
    dispatch(playerActions.startPlaying());
  };

  const toggleFavorite = (e) => {
    e.preventDefault();
    if (!isLoggedIn) return toast.error("Please log in to favorite podcasts.");
    isFavorited
      ? dispatch(removeFavorite(items._id))
      : dispatch(addFavorite(items._id));
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) return toast.error("Please log in to delete podcasts.");
    if (!window.confirm("Are you sure you want to delete this podcast?"))
      return;

    setDeleting(true);
    try {
      const response = await fetch(
        `${BASE_URL}/podcast/delete-podcasts/${items._id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
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
      console.error(error);
      toast.error("Something went wrong.");
    }
    setDeleting(false);
  };

  return (
    <Link to={`/podcast/${items._id}`} className="no-underline text-inherit">
      <div className="relative border rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between p-4 h-full min-h-[500px] bg-white">
        {showFavorite && isLoggedIn && (
          <button
            className="absolute top-3 right-3"
            onClick={toggleFavorite}
            disabled={deleting}
          >
            <FaHeart
              className={`text-2xl ${
                isFavorited ? "text-red-500" : "text-gray-300"
              }`}
            />
          </button>
        )}

        {/* Content Section */}
        <div className="flex flex-col flex-grow">
          <img
            src={items.frontImage}
            alt={items.title}
            className="w-full h-[180px] rounded-lg object-cover mb-4"
          />

          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            {items.title}
          </h2>

          <p className="text-sm text-gray-600 mb-2">
            {truncateText(items.description, 40)}
          </p>

          <div className="mt-auto">
            <span className="inline-block px-3 py-1 text-xs font-medium bg-orange-100 text-orange-600 border border-orange-500 rounded-full">
              {items.category?.categoryName || "Unknown"}
            </span>
          </div>
        </div>

        {/* Button Section */}
        <div className="flex flex-col mt-4 gap-2">
          <button
            onClick={handlePlay}
            className="w-full bg-green-700 hover:bg-green-800 text-white py-2 rounded-lg"
            disabled={deleting}
          >
            Play Now
          </button>

          {isMyPodcastPage && (
            <>
              <button
                onClick={handleDelete}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>

              <button
                onClick={() =>
                  window.open(`/edit-podcast/${items._id}`, "_blank")
                }
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
              >
                Edit
              </button>
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

export default PodcastCard;
