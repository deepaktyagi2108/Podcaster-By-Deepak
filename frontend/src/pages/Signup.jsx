import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../store/auth";
import { Navigate } from "react-router-dom";

 


const Signup = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [value, setValue] = useState({
    username: "",
    email: "",
    password: "",
  });

  const change = (e) => {
    const { name, value } = e.target;
    setValue((prev) => ({ ...prev, [name]: value }));
  };

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(value.email)) {
      alert("Please enter a valid email address");
      return;
    }

    try {
      const res = await axios.post("http://localhost:1000/api/v1/user/sign-up", value, {
        withCredentials: true,
      });

      dispatch(authActions.login(res.data.user)); // auto login
      alert("Signup successful!");
      setTimeout(() => navigate("/profile"), 1000);
    } catch (error) {
      alert(error.response?.data?.error || "Signup failed");
    }
  };

  return (
    <>
      {isLoggedIn ? (
        <Navigate to="/profile" />
      ) : (
        <div className="h-screen bg-green-100 flex items-center justify-center">
          <div className="w-4/6 md:w-3/6 flex flex-col items-center justify-center">
            <Link to="/" className="text-xl font-bold text-center w-full">
              PODCASTER
            </Link>

            <div className="mt-6 w-full">
              <form onSubmit={handleSubmit}>
                <div className="w-full flex flex-col">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    className="mt-2 px-2 py-2 rounded outline-none border-2 border-black bg-white"
                    required
                    placeholder="Username"
                    name="username"
                    value={value.username}
                    onChange={change}
                  />
                </div>

                <div className="w-full flex flex-col mt-2">
                  <label htmlFor="email">E-mail</label>
                  <input
                    type="email"
                    className="mt-2 px-2 py-2 rounded outline-none border-2 border-black bg-white"
                    required
                    placeholder="E-mail"
                    name="email"
                    value={value.email}
                    onChange={change}
                  />
                </div>

                <div className="w-full flex flex-col mt-2">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    className="mt-2 px-2 py-2 rounded outline-none border-2 border-black bg-white"
                    required
                    placeholder="Password"
                    name="password"
                    value={value.password}
                    onChange={change}
                  />
                </div>

                <div className="w-full flex flex-col mt-2">
                  <button type="submit" className="bg-green-900 cursor-pointer font-semibold text-xl text-white rounded py-2">
                    Signup
                  </button>
                </div>
              </form>

              <div className="w-full flex flex-col mt-2">
                <p className="text-center">
                  Already have an account?{" "}
                  <Link to="/login" className="font-semibold hover:text-blue-600">
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Signup;


