import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { BASE_URL } from "../utils/constants";
import axios from "axios"; // Make sure axios is imported

const EditPodcast = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

useEffect(() => {
  console.log("Podcast ID from URL:", id);
  const fetchPodcast = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/podcast/get-podcast/${id}`);
      const data = res.data.data; // ✅ Access podcast inside data
      setTitle(data.title);
      setDescription(data.description);
    } catch (err) {
      toast.error("Error fetching podcast");
    } finally {
      setLoading(false);
    }
  };
  fetchPodcast();
}, [id]);



  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/podcast/update-podcast/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, description }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Podcast updated!");
        navigate("/my-podcasts");
      } else {
        toast.error(data.message || "Failed to update");
      }
    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (loading) return <div className="p-10 text-xl">Loading...</div>;

 return (
  <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-md">
    <h1 className="text-2xl font-bold mb-6 text-center">Edit Podcast</h1>
    <form onSubmit={handleUpdate} className="flex flex-col gap-4">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border border-gray-300 rounded-md p-3 text-lg focus:ring-2 focus:ring-blue-400"
        placeholder="Podcast Title"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border border-gray-300 rounded-md p-3 text-lg h-40 resize-none focus:ring-2 focus:ring-blue-400"
        placeholder="Podcast Description"
      />
      
      <div className="flex justify-between">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md text-lg"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={() => navigate("/my-podcasts")}
          className="bg-gray-300 hover:bg-gray-400 text-black py-3 px-6 rounded-md text-lg"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
);

};

export default EditPodcast;
