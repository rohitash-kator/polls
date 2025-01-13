const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Blacklist = require("../models/Blacklist");

const authMiddleware = async (req, res, next) => {
  // Get the token from the header
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    // If there is no token
    return res.status(401).json({ error: "No Authorization header" });
  }

  // If the token exists, remove the "Bearer " part
  const token = authHeader.replace("Bearer ", "");

  if (!token) {
    // If there is no token
    return res.status(401).json({ error: "No token provided" });
  }

  const blacklistToken = await Blacklist.findOne({ token });

  if (blacklistToken) {
    return res.status(401).json({ error: "Invalid token provided" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user
    const user = await User.findById(decoded.id).select("-password");

    // If the user does not exist
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
};

module.exports = { authMiddleware };
