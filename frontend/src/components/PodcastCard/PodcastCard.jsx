// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link, useNavigate } from "react-router-dom";
// import { playerActions } from "../../store/player";
// import { FaHeart } from "react-icons/fa";
// import toast from "react-hot-toast";
// import { addFavorite, removeFavorite } from "../../store/favorites";
// import { BASE_URL } from "../../utils/constants";

// const PodcastCard = ({ items, showFavorite = true, onDelete }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [deleting, setDeleting] = useState(false);
//   const [updating, setUpdating] = useState(false);
//   const [editTitle, setEditTitle] = useState(items.title);
//   const [editDesc, setEditDesc] = useState(items.description);
//   const [showEditForm, setShowEditForm] = useState(false);

//   const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
//   const favorites = useSelector((state) => state.favorites.items);

//   const isFavorited = favorites.includes(items._id);

//   // Play handler
//   const handlePlay = (e) => {
//     e.preventDefault();
//     if (!isLoggedIn) return navigate("/signup");
//     if (!items.audioFile || !items.frontImage) {
//       toast.error("Audio or image missing for this podcast.");
//       return;
//     }

//     dispatch(playerActions.changeSong(items.audioFile));
//     dispatch(playerActions.changeImage(items.frontImage));
//     dispatch(playerActions.setDiv());
//     dispatch(playerActions.startPlaying());
//   };

//   // Favorite toggle
//   const toggleFavorite = (e) => {
//     e.preventDefault();
//     if (!isLoggedIn) return toast.error("Please log in to favorite podcasts.");
//     isFavorited
//       ? dispatch(removeFavorite(items._id))
//       : dispatch(addFavorite(items._id));
//   };

//   // Delete podcast
//   const handleDelete = async (e) => {
//     e.preventDefault();
//     if (!isLoggedIn) return toast.error("Please log in to delete podcasts.");
//     if (!window.confirm("Are you sure you want to delete this podcast?")) return;

//     setDeleting(true);
//     try {
//       const response = await fetch(`${BASE_URL}/podcast/delete-podcasts/${items._id}`, {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//       });

//       const data = await response.json();
//       if (response.ok) {
//         toast.success("Podcast deleted successfully!");
//         if (onDelete) onDelete(items._id);
//       } else {
//         toast.error(data.message || "Failed to delete podcast.");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Something went wrong.");
//     }
//     setDeleting(false);
//   };

//   // Update podcast
//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     if (!isLoggedIn) return toast.error("Please log in to update podcasts.");

//     setUpdating(true);
//     try {
//       const response = await fetch(`${BASE_URL}/podcast/update-podcast/${items._id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify({
//           title: editTitle,
//           description: editDesc,
//         }),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         toast.success("Podcast updated successfully!");
//         setShowEditForm(false);
//       } else {
//         toast.error(data.message || "Failed to update podcast.");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Something went wrong.");
//     }
//     setUpdating(false);
//   };

//   return (
//     <div className="relative border p-4 rounded flex flex-col shadow-2xl hover:shadow-2xl transition-all duration-300">
//       {/* Favorite button */}
//       {showFavorite && isLoggedIn && (
//         <button
//           className="absolute top-2 right-2 transition"
//           onClick={toggleFavorite}
//           disabled={deleting || updating}
//           aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
//         >
//           <FaHeart
//             className={`text-2xl ${
//               isFavorited ? "text-red-500" : "text-gray-300"
//             } transition-all duration-300`}
//           />
//         </button>
//       )}

//       {/* Podcast Image and Info */}
//       <Link to={`/podcast/${items._id}`} className="flex flex-col gap-2">
//         <div>
//           <img
//             src={items.frontImage}
//             className="rounded size-[42vh] object-cover"
//             alt={items.title}
//           />
//         </div>
//         <div className="mt-2 text-xl font-bold">
//           {items.title?.slice(0, 30) || "Untitled"}
//         </div>
//         <div className="mt-2 leading-5 text-slate-500">
//           {items.description?.slice(0, 120) || "No Description"}
//         </div>
//         <div className="mt-2 bg-orange-100 text-orange-300 border border-orange-700 rounded-full px-4 py-2 text-center">
//           {items.category?.categoryName || "Unknown"}
//         </div>
//       </Link>

//       {/* Play Button */}
//       <button
//         onClick={handlePlay}
//         className="bg-green-900 text-white px-4 py-2 rounded mt-2 flex items-center justify-center hover:bg-green-800 transition-all duration-300"
//         disabled={deleting || updating}
//       >
//         Play Now
//       </button>

//       {/* Delete Button */}
//       <button
//         onClick={handleDelete}
//         className="bg-red-600 text-white px-4 py-2 rounded mt-2 hover:bg-red-700 transition-all duration-300"
//         disabled={deleting}
//       >
//         {deleting ? "Deleting..." : "Delete"}
//       </button>

//       {/* Edit Button */}
//       <button
//         onClick={() => setShowEditForm(!showEditForm)}
//         className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600 transition-all duration-300"
//         disabled={updating}
//       >
//         {showEditForm ? "Cancel Edit" : "Edit"}
//       </button>

//       {/* Edit Form */}
//       {showEditForm && (
//         <form onSubmit={handleUpdate} className="mt-4 flex flex-col gap-2">
//           <input
//             value={editTitle}
//             onChange={(e) => setEditTitle(e.target.value)}
//             placeholder="Edit Title"
//             className="border rounded p-2"
//           />
//           <textarea
//             value={editDesc}
//             onChange={(e) => setEditDesc(e.target.value)}
//             placeholder="Edit Description"
//             className="border rounded p-2"
//           />
//           <button
//             type="submit"
//             className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-all duration-300"
//             disabled={updating}
//           >
//             {updating ? "Updating..." : "Save Changes"}
//           </button>
//         </form>
//       )}
//     </div>
//   );
// };

// export default PodcastCard;

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { playerActions } from "../../store/player";
import { FaHeart } from "react-icons/fa";
import toast from "react-hot-toast";
import { addFavorite, removeFavorite } from "../../store/favorites";
import { BASE_URL } from "../../utils/constants";

const PodcastCard = ({ items, showFavorite = true, onDelete, onUpdate }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [editTitle, setEditTitle] = useState(items.title);
  const [editDesc, setEditDesc] = useState(items.description);
  const [showEditForm, setShowEditForm] = useState(false);

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const favorites = useSelector((state) => state.favorites.items);

  const isFavorited = favorites.includes(items._id);

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
    if (!window.confirm("Are you sure you want to delete this podcast?")) return;

    setDeleting(true);
    try {
      const response = await fetch(`${BASE_URL}/podcast/delete-podcasts/${items._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

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

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) return toast.error("Please log in to update podcasts.");

    setUpdating(true);
    try {
      const response = await fetch(`${BASE_URL}/podcast/update-podcast/${items._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title: editTitle,
          description: editDesc,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Podcast updated successfully!");
        setShowEditForm(false);

        // ✅ Update parent state to reflect changes immediately
        if (onUpdate) {
          onUpdate(items._id, {
            title: editTitle,
            description: editDesc,
          });
        }
      } else {
        toast.error(data.message || "Failed to update podcast.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }
    setUpdating(false);
  };

  return (
    <div className="relative border p-4 rounded flex flex-col shadow-2xl hover:shadow-2xl transition-all duration-300">
      {showFavorite && isLoggedIn && (
        <button
          className="absolute top-2 right-2 transition"
          onClick={toggleFavorite}
          disabled={deleting || updating}
          aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
        >
          <FaHeart
            className={`text-2xl ${
              isFavorited ? "text-red-500" : "text-gray-300"
            } transition-all duration-300`}
          />
        </button>
      )}

      <Link to={`/podcast/${items._id}`} className="flex flex-col gap-2">
        <div>
          <img
            src={items.frontImage}
            className="rounded size-[42vh] object-cover"
            alt={items.title}
          />
        </div>
        <div className="mt-2 text-xl font-bold">
          {editTitle?.slice(0, 30) || "Untitled"}
        </div>
        <div className="mt-2 leading-5 text-slate-500">
          {editDesc?.slice(0, 120) || "No Description"}
        </div>
        <div className="mt-2 bg-orange-100 text-orange-300 border border-orange-700 rounded-full px-4 py-2 text-center">
          {items.category?.categoryName || "Unknown"}
        </div>
      </Link>

      <button
        onClick={handlePlay}
        className="bg-green-900 text-white px-4 py-2 rounded mt-2 flex items-center justify-center hover:bg-green-800 transition-all duration-300"
        disabled={deleting || updating}
      >
        Play Now
      </button>

      <button
        onClick={handleDelete}
        className="bg-red-600 text-white px-4 py-2 rounded mt-2 hover:bg-red-700 transition-all duration-300"
        disabled={deleting}
      >
        {deleting ? "Deleting..." : "Delete"}
      </button>

      <button
        onClick={() => setShowEditForm(!showEditForm)}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600 transition-all duration-300"
        disabled={updating}
      >
        {showEditForm ? "Cancel Edit" : "Edit"}
      </button>

      {showEditForm && (
        <form onSubmit={handleUpdate} className="mt-4 flex flex-col gap-2">
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Edit Title"
            className="border rounded p-2"
          />
          <textarea
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            placeholder="Edit Description"
            className="border rounded p-2"
          />
          <button
            type="submit"
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-all duration-300"
            disabled={updating}
          >
            {updating ? "Updating..." : "Save Changes"}
          </button>
        </form>
      )}
    </div>
  );
};

export default PodcastCard;






