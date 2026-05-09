const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config");

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) return res.status(401).json({ message: "Access token missing" });

  try {
    req.user = jwt.verify(token, jwtSecret);
    return next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}

function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: "Forbidden for this role" });
    return next();
  };
}

module.exports = { authenticateToken, authorizeRoles };