const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const protect = require("./middleware/authMiddleware");
console.log("Protect middleware:", protect);
dotenv.config();
const app = express();

// Connect Database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/resume", require("./routes/resumeRoutes"));

app.get("/", (req, res) => {
  res.send("Smart Hire API is running 🚀");
});

app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "You accessed protected route",
    user: req.user,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});