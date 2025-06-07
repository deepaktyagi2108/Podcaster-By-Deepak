const jwt = require("jsonwebtoken");
const User = require("../models/user.js"); // 

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.podcasterUserToken;
     console.log("Token from cookies:", token);

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Auth Error:", error.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
