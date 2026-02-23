const fs = require("fs");
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");

const extractTextFromPDF = async (filePath) => {
  console.log("Extracting text from PDF:", filePath);

  const data = new Uint8Array(fs.readFileSync(filePath));

  const loadingTask = pdfjsLib.getDocument({ data });
  const pdf = await loadingTask.promise;

  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map(item => item.str);
    text += strings.join(" ") + "\n";
  }

  console.log("Extracted text length:", text.length);

  return text;
};

module.exports = { extractTextFromPDF };