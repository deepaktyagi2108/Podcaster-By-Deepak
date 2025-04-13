const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authMiddleware = async (req, res, next) => {
  try {
    
    const token = req.cookies.podcasterUserToken;
   
    let user;

    if (token) {
      const decode = jwt.verify(token, process.env.JWT_SECRET);

      user = await User.findById(decode.id);
    }
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
