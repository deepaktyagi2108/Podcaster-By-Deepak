
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PodcastCard from '../PodcastCard/PodcastCard';
import { useSelector } from 'react-redux';

const YourPodcasts = ({ showFavorite = false }) => {
  const [podcasts, setPodcasts] = useState([]);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetch = async () => {
      try {
        const res = await axios.get("https://podcaster-api.onrender.com/api/v1/podcast/get-user-podcasts", {
          withCredentials: true,
        });
        setPodcasts(res.data.data);
      } catch (err) {
        console.error("Error fetching user podcasts:", err);
      }
    };

    fetch();
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
        <p className="text-gray-600 mb-2">Please log in to view your podcasts.</p>
        <Link to="/login" className="bg-slate-800 text-white px-6 py-2 rounded hover:bg-slate-700 transition">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className='px-4 lg:px-12 my-4'>
      <div className='flex items-center justify-between gap-4'>
        <h1 className='text-xl font-semibold md:font-bold'>Your Podcasts</h1>
        <Link
          to="/add-podcast"
          className="px-4 py-2 bg-slate-800 text-white rounded font-semibold"
        >
          Add Podcast
        </Link>
      </div>

      <div className="w-full lg:px-12 py-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {podcasts.length > 0 ? (
          podcasts.map((items, i) => (
            <div key={i}>
              <PodcastCard items={items} showFavorite={showFavorite} />
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-center col-span-full">
            No podcasts found. Add your first one!
          </div>
        )}
      </div>
    </div>
  );
};

export default YourPodcasts;






