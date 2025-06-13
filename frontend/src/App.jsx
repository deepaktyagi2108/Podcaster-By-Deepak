

import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "./store/auth";
import { Toaster } from "react-hot-toast";

// Pages & Components
import AudioPlayer from "./components/AudioPlayer/AudioPlayer";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import AllPodcasts from "./pages/AllPodcasts";
import YourPodcasts from "./components/Profile/YourPodcasts";
import Favorites from "./pages/Favorites";
import DescriptionPage from "./pages/DescriptionPage";
import CategoriesPage from "./pages/CategoriesPage";
import AddPodcast from "./pages/AddPodcast";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ErrorPage from "./pages/ErrorPage";
import Profile from "./pages/Profile"; // ✅ Ensure this file exists and is correctly exported
import EditPodcast from "./pages/EditPodcast";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      dispatch(authActions.login(storedUser));
    }
  }, [dispatch]);

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:cat" element={<CategoriesPage />} />
          <Route path="/all-podcasts" element={<AllPodcasts />} />
          <Route path="/my-podcasts" element={<YourPodcasts />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/podcast/:id" element={<DescriptionPage />} />
          <Route path="/edit-podcast/:id" element={<EditPodcast />} />
          <Route path="/add-podcast" element={<AddPodcast />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
        <AudioPlayer />
      </Router>
      <Toaster />
    </>
  );
};

export default App;



