

import { createSlice } from "@reduxjs/toolkit";

const playerSlice = createSlice({
  name: "player",
  initialState: {
    songPath: "",
    img: "",
    isPlayerDiv: false,
  },
  reducers: {
    changeSong: (state, action) => {
      state.songPath = action.payload;
    },
    changeImage: (state, action) => {
      state.img = action.payload;
    },
    setDiv: (state) => {
      state.isPlayerDiv = true;
    },
    closeDiv: (state) => {
      state.songPath = "";
      state.img = "";
      state.isPlayerDiv = false;
    },
  },
});

export const playerActions = playerSlice.actions;
export default playerSlice.reducer;

