const fs = require("fs");
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");

const extractTextFromPDF = async (filePath) => {
  console.log("Extracting text from PDF:", filePath);

  const data = new Uint8Array(fs.readFileSync(filePath));
  console.log("PDF file read successfully, size:", data.length);

  const loadingTask = pdfjsLib.getDocument({ data });
  console.log("PDF loading task created");
  const pdf = await loadingTask.promise;
  console.log("PDF loaded successfully, number of pages:", pdf.numPages);

  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map(item => item.str);
    text += strings.join(" ") + "\n";
  }

  console.log("Extracted text length:", text.length);
  console.log("Extracted text preview:", text.substring(0, 500)); // Log the first 500 characters

  return text;
};

module.exports = { extractTextFromPDF };