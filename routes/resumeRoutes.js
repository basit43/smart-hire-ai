const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { uploadResume } = require("../controllers/resumeController");
const { getResumeHistory } = require("../controllers/resumeController");

router.post("/upload", protect, upload.single("resume"), uploadResume);
router.get("/history", protect, getResumeHistory);

module.exports = router;