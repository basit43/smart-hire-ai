const axios = require("axios");

const summarizeText = async (text) => {
  try {
    const response = await axios.post(
      "https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn",
      {
        inputs: text.substring(0, 1000),
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // HuggingFace sometimes returns different response formats
    if (Array.isArray(response.data) && response.data[0]?.summary_text) {
      return response.data[0].summary_text;
    }

    if (response.data?.summary_text) {
      return response.data.summary_text;
    }

    return "No summary generated";
  } catch (error) {
    console.error("AI Error FULL:", error.response?.data || error.message);
    return "AI summary failed";
  }
};

module.exports = { summarizeText };