

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PodcastCard from '../PodcastCard/PodcastCard';
import { useSelector } from 'react-redux';
import { BASE_URL } from '../../utils/constants';

const YourPodcasts = ({ showFavorite = false }) => {
  const [podcasts, setPodcasts] = useState([]);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetch = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/podcast/get-user-podcasts`, {
          withCredentials: true,
        });
        setPodcasts(res.data.data);
      } catch (err) {
        console.error("Error fetching user podcasts:", err);
      }
    };

    fetch();
  }, [isLoggedIn]);

  const handleDelete = (deletedId) => {
    setPodcasts((prev) => prev.filter((podcast) => podcast._id !== deletedId));
  };

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
          podcasts.map((items) => (
            <div key={items._id}>
              <PodcastCard
                items={items}
                showFavorite={showFavorite}
                onDelete={handleDelete}
              />
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







