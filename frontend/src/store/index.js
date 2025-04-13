
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth";
import playerReducer from "./player";
import favoritesReducer from "./favorites"; // ✅

const store = configureStore({
  reducer: {
    auth: authReducer,
    player: playerReducer,
    favorites: favoritesReducer, // ✅
  },
});

export default store;

