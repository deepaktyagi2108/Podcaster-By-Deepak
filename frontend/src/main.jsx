
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";

import store from "./store"; // assuming store.js is in src/store/index.js or src/store.js
import "./index.css"; // this imports Tailwind CSS

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
    <>
      <App />
      
      </>
    </Provider>
  </React.StrictMode>
);
