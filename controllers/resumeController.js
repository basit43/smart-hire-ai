const Resume = require("../models/Resume");
const { extractTextFromPDF } = require("../utils/pdfParser");
const { summarizeText } = require("../utils/aiService");
const fs = require("fs");
console.log("PDF Parser Import:", extractTextFromPDF);
const uploadResume = async (req, res) => {
  try {
    const jobDescription = req.body.jobDescription;
    console.log("====== JOB DESCRIPTION RECEIVED ======");
    console.log(jobDescription);
    console.log("=====================================");

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = req.file.path;

    const resumeText = await extractTextFromPDF(filePath);
    const resumeSummary = await summarizeText(resumeText);
    const jobSummary = await summarizeText(jobDescription);

    // const resumeWords = resumeText.toLowerCase().split(/\W+/);
    // const jobWords = jobDescription.toLowerCase().split(/\W+/);

    // const commonWords = jobWords.filter(word => resumeWords.includes(word));

    // const matchScore = Math.min(
    //   100,
    //   Math.round((commonWords.length / jobWords.length) * 100)
    // );

    // ---- SMART MATCHING LOGIC ----

    // -------- SKILL EXTRACTION --------

// Core tech skills we care about
const techSkills = [
  "flutter","dart","rest","api","bloc","provider","riverpod",
  "mvvm","clean","architecture","firebase","jwt","oauth",
  "git","ci","cd","docker","play","store","app","store",
  "android","ios","json","authentication","secure","storage"
];

const normalize = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/);

// Resume words
const resumeWords = new Set(normalize(resumeText));

// Job words
const jobWords = new Set(normalize(jobDescription));

// Extract only tech skills from job description
const jobSkills = techSkills.filter(skill => jobWords.has(skill));

// Find matches
const matchedKeywords = jobSkills.filter(skill => resumeWords.has(skill));

// Missing skills
const missingKeywords = jobSkills.filter(skill => !resumeWords.has(skill));

// Score
let matchScore = 0;

if (jobSkills.length > 0) {
  matchScore = Math.round((matchedKeywords.length / jobSkills.length) * 100);
}

// Save result in DB
const savedResume = await Resume.create({
  user: req.user._id,
  originalText: resumeText,
  summary: resumeSummary,
  matchScore,
  jobDescription,
});

// Delete uploaded file
fs.unlinkSync(filePath);

// Send response to frontend
res.json({
  summary: resumeSummary,
  jobSummary,
  matchScore,
  matchedKeywords,
  missingKeywords,
  resumeId: savedResume._id,
});

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Resume processing failed" });
  }
};

module.exports = { uploadResume };