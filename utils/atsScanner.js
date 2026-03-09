const scanATS = (resumeText) => {

  const warnings = [];

  const lower = resumeText.toLowerCase();

  // check for common resume sections
  if (!lower.includes("skills")) {
    warnings.push("Resume missing a dedicated Skills section.");
  }

  if (!lower.includes("experience")) {
    warnings.push("Resume missing Experience section.");
  }

  if (!lower.includes("education")) {
    warnings.push("Resume missing Education section.");
  }

  // formatting warnings
  if (resumeText.includes("|")) {
    warnings.push("Resume may contain tables which ATS systems struggle to parse.");
  }

  if (resumeText.length < 1000) {
    warnings.push("Resume content is short. ATS prefers detailed resumes.");
  }

  // compute score
  let score = 100 - warnings.length * 10;

  if (score < 50) score = 50;

  return {
    atsScore: score,
    atsWarnings: warnings
  };
};

module.exports = { scanATS };