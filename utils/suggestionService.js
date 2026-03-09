const generateSuggestions = (missingKeywords) => {
  const suggestions = [];

  const suggestionMap = {
    oauth: "Mention OAuth authentication implementation.",
    jwt: "Highlight JWT based authentication implementation.",
    cicd: "Add CI/CD pipeline experience.",
    docker: "Mention Docker usage in development or deployment.",
    performance: "Highlight Flutter performance optimization.",
    testing: "Mention automated testing practices.",
    monitoring: "Add application monitoring experience.",
    storage: "Mention secure local storage implementation.",
  };

  missingKeywords.forEach((keyword) => {
    const suggestion = suggestionMap[keyword];
    if (suggestion) {
      suggestions.push(suggestion);
    }
  });

  return suggestions;
};

module.exports = { generateSuggestions };