const Resume = require("../models/Resume");
const { extractTextFromPDF } = require("../utils/pdfParser");
const { summarizeText } = require("../utils/aiService");
const fs = require("fs");
console.log("PDF Parser Import:", extractTextFromPDF);
const uploadResume = async (req, res) => {
  try {
    const jobDescription = req.body.jobDescription;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = req.file.path;

    const resumeText = await extractTextFromPDF(filePath);
    const resumeSummary = await summarizeText(resumeText);
    const jobSummary = await summarizeText(jobDescription);

    const resumeWords = resumeText.toLowerCase().split(/\W+/);
    const jobWords = jobDescription.toLowerCase().split(/\W+/);

    const commonWords = jobWords.filter(word => resumeWords.includes(word));

    const matchScore = Math.min(
      100,
      Math.round((commonWords.length / jobWords.length) * 100)
    );

    const savedResume = await Resume.create({
      user: req.user._id,
      originalText: resumeText,
      summary: resumeSummary,
      matchScore,
      jobDescription,
    });

    fs.unlinkSync(filePath);

    res.json({
      summary: resumeSummary,
      jobSummary,
      matchScore,
      resumeId: savedResume._id,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Resume processing failed" });
  }
};

module.exports = { uploadResume };