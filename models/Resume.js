const mongoose = require("mongoose");

const resumeSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    originalText: {
      type: String,
    },
    summary: {
      type: String,
    },
    matchScore: {
      type: Number,
    },
    jobDescription: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model("Resume", resumeSchema);

module.exports = Resume;