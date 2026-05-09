const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const { authenticateToken } = require("./middleware/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok", service: "HelpDesk Lite API" }));

app.use("/api/auth", authRoutes);
app.use("/api/tickets", authenticateToken, ticketRoutes);

app.use((req, res) => res.status(404).json({ message: "Route not found" }));
app.use((error, req, res, next) => {
  console.error(error);
  return res.status(500).json({ message: "Internal server error" });
});

module.exports = app;