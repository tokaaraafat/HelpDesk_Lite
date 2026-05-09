const express = require("express");
const jwt = require("jsonwebtoken");
const { jwtSecret, tokenExpiresIn } = require("../config");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

function toSafeUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

router.post("/register", (req, res) => {
  const store = req.app.locals.store;
  const { name, email, password, role } = req.body || {};

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "Name, email, password, and role are required" });
  }
  if (!["admin", "agent", "user"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const exists = store.users.some((user) => user.email === normalizedEmail);
  if (exists) return res.status(409).json({ message: "Email already exists" });

  const nextId = store.users.reduce((max, user) => Math.max(max, user.id), 0) + 1;
  const newUser = {
    id: nextId,
    name: name.trim(),
    email: normalizedEmail,
    password,
    role
  };

  store.users.push(newUser);
  return res.status(201).json(toSafeUser(newUser));
});

router.post("/login", (req, res) => {
  const store = req.app.locals.store;
  const { email, password, role } = req.body || {};
  if (!email || !password || !role) {
    return res.status(400).json({ message: "Email, password, and role are required" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = store.users.find(
    (item) => item.email === normalizedEmail && item.password === password && item.role === role
  );

  if (!user) return res.status(401).json({ message: "Invalid credentials or role mismatch" });

  const payload = toSafeUser(user);
  const token = jwt.sign(payload, jwtSecret, { expiresIn: tokenExpiresIn });
  return res.json({ token, user: payload });
});

router.get("/me", authenticateToken, (req, res) => res.json(req.user));

router.get("/users", authenticateToken, (req, res) => {
  const store = req.app.locals.store;
  const users = store.users.map((user) => toSafeUser(user));
  return res.json(users);
});

router.get("/agents", authenticateToken, authorizeRoles("admin", "agent"), (req, res) => {
  const store = req.app.locals.store;
  const agents = store.users
    .filter((user) => user.role === "agent")
    .map((user) => toSafeUser(user));
  return res.json(agents);
});

module.exports = router;