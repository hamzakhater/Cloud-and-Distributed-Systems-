const fs = require("fs");
const path = require("path");
const mammoth = require("mammoth");
const pdfParse = require("pdf-parse");

const uploadsDir = path.join(__dirname, "..", "uploads");

async function listFiles() {
  return fs.promises.readdir(uploadsDir);
}

async function extractText(filename) {
  const filePath = path.join(uploadsDir, filename);

  if (!fs.existsSync(filePath)) {
    throw new Error("File not found");
  }

  if (filename.endsWith(".pdf")) {
    const dataBuffer = await fs.promises.readFile(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  }

  if (filename.endsWith(".docx")) {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  throw new Error("Unsupported file format");
}

module.exports = {
  listFiles,
  extractText,
};

// const fs = require("fs");
// const path = require("path");
// const mammoth = require("mammoth");
// const pdfParse = require("pdf-parse");

// const uploadsDir = path.join(__dirname, "..", "uploads");

// const readFiles = async () => {
//   return fs.promises.readdir(uploadsDir);
// };

// const extractTextFromFile = async (filename) => {
//   const filePath = path.join(uploadsDir, filename);
//   if (!fs.existsSync(filePath)) throw new Error("File not found");

//   if (filename.endsWith(".pdf")) {
//     const dataBuffer = await fs.promises.readFile(filePath);
//     const data = await pdfParse(dataBuffer);
//     return data.text;
//   } else if (filename.endsWith(".docx")) {
//     const result = await mammoth.extractRawText({ path: filePath });
//     return result.value;
//   } else {
//     throw new Error("Unsupported file type");
//   }
// };

// module.exports = {
//   readFiles,
//   extractTextFromFile,
// };
