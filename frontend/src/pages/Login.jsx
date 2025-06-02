

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store/auth";
import toast from "react-hot-toast";
import { BASE_URL } from "../utils/constants";
import { Navigate } from "react-router-dom";

const Login = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [value, setValue] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const change = (e) => {
    const { name, value } = e.target;
    setValue((prev) => ({ ...prev, [name]: value }));
  };

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!isValidEmail(value.email)) {
      toast.error("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${BASE_URL}/user/sign-in`,
        value,
        { withCredentials: true }
      );

      dispatch(authActions.login(res.data.user));
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success(res.data.message || "Login successful!");

     
      setTimeout(() => navigate("/profile"), 1000);
    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDummyLogin = async () => {
    const dummyCredentials = {
      email: "demo@example.com",
      password: "password123",
    };

    setValue(dummyCredentials);
    setLoading(true);

    try {
      const res = await axios.post(
        `${BASE_URL}/user/sign-in`,
        dummyCredentials,
        { withCredentials: true }
      );

      dispatch(authActions.login(res.data.user));
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success(res.data.message || "Login successful!");

      setTimeout(() => navigate("/profile"), 1000);
    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-xl font-semibold">Logging you in...</p>
      </div>
    );
  }

  if (isLoggedIn) {
    return <Navigate to="/profile" />;
  }

  return (
    <div className="h-screen bg-green-100 flex items-center justify-center">
     
      <div className="w-4/6 md:w-3/6 flex flex-col items-center justify-center">
        <Link to="/" className="text-xl font-bold text-center w-full">
          PODCASTER
        </Link>

        <div className="mt-6 w-full">
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

          <div className="w-full flex flex-col md:flex-row gap-4 mt-4">
            <button
              className="bg-green-900 font-semibold text-xl text-white cursor-pointer rounded py-2 px-4 w-full"
              onClick={handleSubmit}
            >
              Login
            </button>
            <button
              className="bg-blue-700 font-semibold text-xl text-white cursor-pointer rounded py-2 px-4 w-full"
              onClick={handleDummyLogin}
            >
              Login with Dummy
            </button>
          </div>

          <div className="w-full flex flex-col mt-4">
            <p className="text-center">
              Create an account{" "}
              <Link
                to="/signup"
                className="font-semibold hover:text-blue-600"
              >
                Signup
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;








