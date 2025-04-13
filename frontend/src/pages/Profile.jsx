import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../store/auth";

import Header from "../components/Profile/Header";
import YourPodcasts from "../components/Profile/YourPodcasts";
import ErrorPage from "./ErrorPage";

const Profile = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      dispatch(authActions.login(user)); // Sync Redux
    }

    setCheckingAuth(false); // Done checking
  }, [dispatch]);

  if (checkingAuth) {
    return <div>Loading...</div>; // prevent flicker
  }

  return (
    <div>
      {isLoggedIn ? (
        <>
          <Header />
          <YourPodcasts showFavorite={false} />
        </>
      ) : (
        <ErrorPage />
      )}
    </div>
  );
};

export default Profile;

