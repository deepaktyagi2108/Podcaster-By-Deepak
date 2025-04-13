

import { IoReorderThreeOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../../store/auth";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [MobileNav, setMobileNav] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Categories", path: "/categories" },
    { name: "All Podcasts", path: "/all-podcasts" },
    { name: "My Podcasts", path: "/my-podcasts" },
    { name: "Favorites", path: "/favorites" },
  ];

  const handleLogout = () => {
    dispatch(authActions.logout());
    localStorage.removeItem("user");
    setMobileNav(false);
    alert("Logged out successfully!");
    setTimeout(() => navigate("/"), 1000);
  };

  return (
    <nav className="px-6 md:px-10 lg:px-20 py-4 shadow-sm bg-white sticky top-0 z-50">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <img
            src="https://cdn-icons-png.flaticon.com/128/9043/9043096.png"
            alt="podcaster"
            className="h-10"
          />
          <Link
            to="/"
            className="text-2xl font-bold tracking-tight text-black hover:text-gray-700 transition"
          >
            Podcaster
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((item, index) => {
            if (item.name === "Favorites") {
              return (
                <button
                  key={index}
                  onClick={() => {
                    if (!isLoggedIn) {
                      alert("Please log in to view favorites.");
                      navigate("/login");
                    } else {
                      navigate(item.path);
                    }
                  }}
                  className="relative group text-gray-800 hover:text-black transition-all duration-300 font-medium"
                >
                  {item.name}
                  <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-black transition-all duration-300 group-hover:w-full"></span>
                </button>
              );
            }

            return (
              <Link
                key={index}
                to={item.path}
                className="relative group text-gray-800 hover:text-black transition-all duration-300 font-medium"
              >
                {item.name}
                <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-black transition-all duration-300 group-hover:w-full"></span>
              </Link>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-4">
          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="px-5 py-2 border border-gray-800 text-gray-800 rounded-full hover:bg-gray-100 transition duration-300"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2 bg-black text-white rounded-full hover:bg-gray-900 transition duration-300"
              >
                Signup
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/profile"
                className="px-5 py-2 bg-black text-white rounded-full hover:bg-gray-900 transition duration-300"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="px-5 py-2 border border-gray-800 text-gray-800 rounded-full hover:bg-gray-100 transition duration-300"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden">
          <button
            onClick={() => setMobileNav(true)}
            className="text-4xl text-gray-800"
          >
            <IoReorderThreeOutline />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-white flex flex-col items-center justify-center transform transition-transform duration-500 ${
          MobileNav ? "translate-y-0" : "-translate-y-full"
        } z-50`}
      >
        {/* Close Button */}
        <button
          onClick={() => setMobileNav(false)}
          className="absolute top-6 right-6 text-4xl text-gray-800"
        >
          <RxCross2 />
        </button>

        {/* Mobile Nav Links */}
        <div className="flex flex-col items-center gap-6 text-2xl font-medium">
          {navLinks.map((item, index) => {
            if (item.name === "Favorites") {
              return (
                <button
                  key={index}
                  onClick={() => {
                    setMobileNav(false);
                    if (!isLoggedIn) {
                      alert("Please log in to view favorites.");
                      navigate("/login");
                    } else {
                      navigate(item.path);
                    }
                  }}
                  className="text-gray-800 hover:text-black transition"
                >
                  {item.name}
                </button>
              );
            }

            return (
              <Link
                key={index}
                to={item.path}
                onClick={() => setMobileNav(false)}
                className="text-gray-800 hover:text-black transition"
              >
                {item.name}
              </Link>
            );
          })}

          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                onClick={() => setMobileNav(false)}
                className="text-gray-800 hover:text-black transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileNav(false)}
                className="text-gray-800 hover:text-black transition"
              >
                Signup
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/profile"
                onClick={() => setMobileNav(false)}
                className="text-gray-800 hover:text-black transition"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

