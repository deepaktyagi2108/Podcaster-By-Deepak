
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
require("./conn/conn.js");


app.use(
  cors({
    origin: ["http://localhost:5173","https://podcaster-six-blush.vercel.app" , "https://podcaster-api.onrender.com"],
    credentials: true,
  })
);

//  Then built-in middleware
app.use(express.json());
app.use(cookieParser());

//  Static files
app.use("/uploads", express.static("uploads"));

// Routes
const userApi = require("./routes/user.js");
const CatApi = require("./routes/categories");
const PodcastApi = require("./routes/podcast.js");

app.use("/api/v1/user", userApi);
app.use("/api/v1/categories", CatApi);
app.use("/api/v1/podcast", PodcastApi);

//  Listen
app.listen(process.env.PORT, () => {
  console.log(`Server is running on: ${process.env.PORT}`);
});


module.exports=app;



