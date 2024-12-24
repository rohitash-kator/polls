const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Get the token from the header
  const authHeader = req.headers("Authorization");
  if (!authHeader) {
    // If there is no token
    return res.status(401).json({ error: "No token provided" });
  }

  // If the token exists, remove the "Bearer " part
  const token = authHeader.replace("Bearer ", "");

  if (!token) {
    // If there is no token
    return res.status(401).json({ error: "No token provided" });
  }
  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = { authMiddleware };
