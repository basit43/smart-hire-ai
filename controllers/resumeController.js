const Resume = require("../models/Resume");
const { extractTextFromPDF } = require("../utils/pdfParser");
const { summarizeText } = require("../utils/aiService");
const { generateSuggestions } = require("../utils/suggestionService");
const { scanATS } = require("../utils/atsScanner");
const fs = require("fs");
const skillDictionary = require("../utils/skillDictionary");

const uploadResume = async (req, res) => {
  try {

    const jobDescription = req.body.jobDescription;

    if (!jobDescription || jobDescription.trim() === "") {
      return res.status(400).json({
        message: "Job description is required"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded"
      });
    }

    const filePath = req.file.path;

    const resumeText = await extractTextFromPDF(filePath);

    const { atsScore, atsWarnings } = scanATS(resumeText);

    const resumeSummary = await summarizeText(resumeText);

    const resumeTextNormalized = (resumeText || "").toLowerCase();
    const jobTextNormalized = (jobDescription || "").toLowerCase();

    // Extract skills from JD
    const jobSkills = skillDictionary.filter(skill =>
      jobTextNormalized.includes(skill)
    );

    // Extract skills from Resume
    const resumeSkills = skillDictionary.filter(skill =>
      resumeTextNormalized.includes(skill)
    );

    const matchedKeywords = jobSkills.filter(skill =>
      resumeSkills.includes(skill)
    );

    const missingKeywords = jobSkills.filter(skill =>
      !resumeSkills.includes(skill)
    );

    let matchScore = 0;

    if (jobSkills.length > 0) {
      matchScore = Math.round(
        (matchedKeywords.length / jobSkills.length) * 100
      );
    }

    const suggestions = generateSuggestions(missingKeywords);

    const savedResume = await Resume.create({
      user: req.user._id,
      originalText: resumeText,
      summary: resumeSummary,
      matchScore,
      jobDescription
    });

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({
      summary: resumeSummary,
      matchScore,
      matchedKeywords,
      missingKeywords,
      suggestions,
      atsScore,
      atsWarnings,
      resumeId: savedResume._id
    });

  } catch (error) {

    console.error("UPLOAD ERROR:", error);

    res.status(500).json({
      message: "Resume processing failed",
      error: error.message
    });

  }
};

const getResumeHistory = async (req,res)=>{

try{

const resumes = await Resume
.find({user:req.user._id})
.sort({createdAt:-1});

res.json(resumes);

}catch(error){

res.status(500).json({
message:"Failed to fetch resume history"
});

}

};

const deleteResumeHistory = async (req, res) => {

  try {

    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found"
      });
    }

    await resume.deleteOne();

    res.json({
      message: "History deleted successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to delete history"
    });

  }

};

module.exports={
uploadResume,
getResumeHistory,
deleteResumeHistory
};