

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { playerActions } from "../store/player";

const DescriptionPage = () => {
  const { id } = useParams();
  const [Podcasts, setPodcasts] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get(
        `https://podcaster-api.vercel.app/api/v1/podcast/get-podcast/${id}`,
        { withCredentials: true }
      );
      setPodcasts(res.data.data);
    };

    fetch();
  }, [id]);

  const funnyLines = [
    "🎙️ Warning: May cause spontaneous air-guitar solos.",
    "💡 Listening level: 9000 IQ.",
    "🔥 Hotter than your ex's mixtape.",
    "🧠 Brain cells will be doing backflips.",
    "🕵️ Fun fact: Aliens might be tuning in too.",
    "🐸 Side effect: You might become mysteriously cooler.",
  ];
  const randomFunny = funnyLines[Math.floor(Math.random() * funnyLines.length)];

  const handlePlay = () => {
    if (!isLoggedIn) {
      navigate('/signup');
      return;
    }

    if (!Podcasts.audioFile || !Podcasts.frontImage) {
      alert('Audio or image missing for this podcast.');
      return;
    }

    dispatch(playerActions.changeSong(`https://podcaster-api.vercel.app/${Podcasts.audioFile}`));
    dispatch(playerActions.changeImage(`https://podcaster-api.vercel.app/${Podcasts.frontImage}`));
    dispatch(playerActions.setDiv());
    dispatch(playerActions.startPlaying());
  };

  if (!Podcasts) {
    return <div>Loading...</div>;
  }

  return (
    <div className='px-4 lg:px-12 py-4 h-auto flex flex-col md:flex-row items-start justify-between gap-5'>
      <div className='w-full md:w-2/6 flex items-center justify-center md:justify-start md:items-start'>
        <img
          src={`https://podcaster-api.vercel.app/${Podcasts.frontImage}`}
          alt="Podcast"
          className='rounded w-full h-[50vh] object-cover shadow-md'
        />
      </div>

      <div className="w-full md:w-4/6">
        <div className="text-4xl font-semibold">{Podcasts.title}</div>

        <h4 className='mt-4 text-lg'>
          {Podcasts.description}
          <p className='mt-2 italic text-xl border rounded text-gray-600 p-2'>
            {randomFunny}
          </p>
        </h4>

        <div className='mt-4 bg-orange-100 text-orange-700 border border-orange-700 rounded-full px-4 py-2 text-center inline-block'>
          🎧 Category: {Podcasts.category.categoryName}
        </div>

        {/* 🟢 New Stylish Play Now Button */}
        <button
          onClick={handlePlay}
          className="mt-6 bg-gradient-to-r from-green-600 to-emerald-500 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300 text-lg font-semibold flex items-center gap-2"
        >
          ▶️ Play Now
        </button>

        {/* Optional Funny Button */}
        <button
          className='mt-4 ml-3 bg-yellow-200 hover:bg-yellow-300 text-black px-4 py-1 rounded-full text-sm'
          onClick={() => alert("You’ve officially wasted 3.2 seconds of your life. Congrats! 🎉")}
        >
          Don't Click This
        </button>
      </div>
    </div>
  );
};

export default DescriptionPage;


