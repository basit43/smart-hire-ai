const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  uploadResume,
  getResumeHistory,
  deleteResumeHistory
} = require("../controllers/resumeController");

router.post("/upload", protect, upload.single("resume"), uploadResume);

router.get("/history", protect, getResumeHistory);

router.delete("/history/:id", protect, deleteResumeHistory);

module.exports = router;