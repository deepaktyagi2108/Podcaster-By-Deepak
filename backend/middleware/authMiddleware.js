const jwt=require("jsonwebtoken")
const user=require("../models/user.js")
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.podcasterUserToken;
  try {
    // let user;
    if (!token) {
  return res.status(401).json({ message: "No token, authorization denied" });
}

    if (token) {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      const  user = await User.findById(decode.id);
      if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user=user;
    next();
    }
    

   
  } catch (error) {
    console.log(error);
    return res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;

