
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "./store/auth";



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
import Profile from "./pages/Profile"; // ✅ Make sure this import exists

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      dispatch(authActions.login(storedUser));
    }
  }, [dispatch]);

  return (
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
        <Route path="/add-podcast" element={<AddPodcast />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* ✅ ADD THIS ROUTE */}
        <Route path="/profile" element={<Profile />} />

        {/* fallback */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <AudioPlayer />
    </Router>
  );
};

export default App;


