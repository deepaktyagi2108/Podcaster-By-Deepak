

import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoPlaySkipBack, IoPlaySkipForward } from "react-icons/io5";
import { FaRegCirclePause, FaPlay } from "react-icons/fa6";
import { ImCross } from "react-icons/im";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { playerActions } from '../../store/player';

const AudioPlayer = () => {
  const dispatch = useDispatch();
  const isVisible = useSelector(state => state.player.isPlayerDiv);
  const songPath = useSelector(state => state.player.songPath);
  const songImage = useSelector(state => state.player.img);

  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play().then(() => setIsPlaying(true)).catch(err => {
        console.warn("Play failed:", err);
      });
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (e) => {
    const time = Number(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  };

  const handleClose = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setIsPlaying(false);
    dispatch(playerActions.closeDiv());
    dispatch(playerActions.changeSong(""));
    dispatch(playerActions.changeImage(""));
  };

  const forward = () => {
    const audio = audioRef.current;
    if (audio) audio.currentTime = Math.min(audio.currentTime + 10, duration);
  };

  const backward = () => {
    const audio = audioRef.current;
    if (audio) audio.currentTime = Math.max(audio.currentTime - 10, 0);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio && songPath) {
      audio.src = songPath;
      audio.load();
      audio.play().then(() => setIsPlaying(true)).catch(err => {
        console.warn("Autoplay blocked:", err);
      });
    }
  }, [songPath]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl bg-zinc-900/90 backdrop-blur-md border border-zinc-700 text-white p-4 rounded-xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 z-50 animate-fadeInUp transition-all duration-300 ease-in-out">
      
      {/* Left: Album Art */}
      <div className="w-full md:w-1/5 flex justify-center md:justify-start">
        <img
          src={songImage}
          alt="cover"
          className="w-14 h-14 rounded-full object-cover border-2 border-indigo-400 shadow-md transition-transform hover:scale-105"
        />
      </div>

      {/* Center Controls */}
      <div className="w-full md:w-3/5 flex flex-col items-center justify-center gap-2">
        <div className="flex items-center justify-center gap-6 text-2xl">
          <button onClick={backward} className="hover:scale-110 transition-transform text-gray-300 hover:text-white">
            <IoPlaySkipBack />
          </button>

          <button
            onClick={togglePlay}
            className="bg-gradient-to-tr from-indigo-500 to-purple-600 text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform duration-200"
          >
            {isPlaying ? <FaRegCirclePause /> : <FaPlay />}
          </button>

          <button onClick={forward} className="hover:scale-110 transition-transform text-gray-300 hover:text-white">
            <IoPlaySkipForward />
          </button>
        </div>

        <div className="w-full flex flex-col mt-2">
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-gray-600 rounded-full accent-indigo-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="w-full md:w-1/5 flex justify-center md:justify-end gap-5 text-xl">
        <button onClick={toggleMute} className="hover:text-indigo-400 transition-colors duration-150">
          {isMuted ? <HiSpeakerXMark /> : <HiSpeakerWave />}
        </button>
        <button
          onClick={handleClose}
          className="text-red-400 hover:text-red-600 transition-all hover:scale-110"
        >
          <ImCross />
        </button>
      </div>

      {/* Hidden Audio */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        preload="metadata"
      />
    </div>
  );
};

const formatTime = (time) => {
  const min = Math.floor(time / 60);
  const sec = Math.floor(time % 60);
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
};

export default AudioPlayer;



