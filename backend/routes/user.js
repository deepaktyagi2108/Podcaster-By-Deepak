const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");
const sendEmail = require("../utils/sendEmail");

// Signup
router.post("/sign-up", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ error: "All fields are required" });

    if (username.length < 5)
      return res
        .status(400)
        .json({ error: "Username must have at least 5 characters" });

    if (password.length < 6)
      return res
        .status(400)
        .json({ error: "Password must have at least 6 characters" });

    const existingEmail = await User.findOne({ email });
    const existingUsername = await User.findOne({ username });

    if (existingEmail || existingUsername)
      return res.status(400).json({ error: "User already exists" });

    const hashedPass = await bcrypt.hash(password, 12);
    const newUser = new User({ username, email, password: hashedPass });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("podcasterUserToken", token, {
      httpOnly: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    await sendEmail(
      email,
      `👋 Welcome to Podcaster, ${username}`,
      `Hi ${username},\n\nThanks for signing up on Podcaster. We're excited to have you on board!\n\n🎙️ Podcaster Team`
    );

    return res.status(201).json({ user: newUser });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Login
router.post("/sign-in", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) return res.status(400).json({ error: "Wrong password" });

    const token = jwt.sign(
      { id: existingUser._id, email: existingUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("podcasterUserToken", token, {
      httpOnly: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.status(200).json({
      user: {
        id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
      },
      message: "Sign-in successful",
    });
  } catch (error) {
    console.error("Sign-in Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/logout", async (req, res) => {
  res.clearCookie("podcasterUserToken", {
    httpOnly: process.env.NODE_ENV === "production",
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });
  res.json({ message: "Logged out successfully" });
});

router.get("/check-cookie", async (req, res) => {
  const token = req.cookies.podcasterUserToken;
  return res.status(200).json({ message: !!token });
});

router.get("/user-details", authMiddleware, async (req, res) => {
  try {
    const { email } = req.user;
    const existingUser = await User.findOne({ email }).select("-password");
    return res.status(200).json({ user: existingUser });
  } catch (error) {
    console.error("User Details Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
