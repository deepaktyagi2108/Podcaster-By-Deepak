// const jwt = require("jsonwebtoken");
// const User = require("../models/user");

// const authMiddleware = async (req, res, next) => {
//   try {
    
//     const token = req.cookies.podcasterUserToken;
   
//     let user;
//     if (!token) {
//   return res.status(401).json({ message: "No token, authorization denied" });
// }

//     if (token) {
//       const decode = jwt.verify(token, process.env.JWT_SECRET);

//       user = await User.findById(decode._id);
//     }
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     console.log(error);
//     return res.status(403).json({ message: "Invalid token" });
//   }
// };

// module.exports = authMiddleware;

const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.podcasterUserToken;

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    // ✅ Decode token (assumes payload is: { _id: user._id })
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("🛡️ Token decoded:", decoded);

    const user = await User.findById(decoded._id); // 🔥 make sure token was created with _id

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("❌ Auth error:", error);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;

