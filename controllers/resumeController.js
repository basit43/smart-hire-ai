const Resume = require("../models/Resume");
const { extractTextFromPDF } = require("../utils/pdfParser");
const { summarizeText } = require("../utils/aiService");
const { generateSuggestions } = require("../utils/suggestionService");
const { scanATS } = require("../utils/atsScanner");
const fs = require("fs");
const skillDictionary = require("../utils/skillDictionary");

const TECH_KEYWORDS = [
"node","nestjs","react","angular","vue","flutter","dart",
"docker","kubernetes","aws","gcp","azure",
"postgresql","mysql","mongodb","redis",
"jwt","oauth","passport","authentication",
"api","rest","graphql","microservices",
"typescript","javascript",
"ci","cd","testing","jest","mocha",
"swagger","openapi",
"prisma","typeorm"
];

const normalize = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s]/g, " ")
    .split(/\s+/);

const uploadResume = async (req,res)=>{

try{

const jobDescription = req.body.jobDescription;

if(!req.file){
return res.status(400).json({message:"No file uploaded"});
}

const filePath = req.file.path;

const resumeText = await extractTextFromPDF(filePath);

const { atsScore, atsWarnings } = scanATS(resumeText);

const resumeSummary = await summarizeText(resumeText);

const resumeTextNormalized = resumeText.toLowerCase();
const jobTextNormalized = jobDescription.toLowerCase();

// Extract skills from JD
const jobSkills = skillDictionary.filter(skill =>
  jobTextNormalized.includes(skill)
);

// Extract skills from Resume
const resumeSkills = skillDictionary.filter(skill =>
  resumeTextNormalized.includes(skill)
);

// Matched
const matchedKeywords = jobSkills.filter(skill =>
  resumeSkills.includes(skill)
);

// Missing
const missingKeywords = jobSkills.filter(skill =>
  !resumeSkills.includes(skill)
);

// Score
let matchScore = 0;

if (jobSkills.length > 0) {
  matchScore = Math.round(
    (matchedKeywords.length / jobSkills.length) * 100
  );
}

const suggestions = generateSuggestions(missingKeywords);

const savedResume = await Resume.create({
user:req.user._id,
originalText:resumeText,
summary:resumeSummary,
matchScore,
jobDescription
});

fs.unlinkSync(filePath);

res.json({
summary:resumeSummary,
matchScore,
matchedKeywords,
missingKeywords,
suggestions,
atsScore,
atsWarnings,
resumeId:savedResume._id
});

}catch(error){

console.error(error);

res.status(500).json({
message:"Resume processing failed"
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

module.exports={
uploadResume,
getResumeHistory
};