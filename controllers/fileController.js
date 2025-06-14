// const fileModel = require("../models/fileModel");

// const getFiles = async (req, res) => {
//   try {
//     const files = await fileModel.readFiles();
//     res.json(files);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const extractFileContent = async (req, res) => {
//   const filename = req.params.filename;
//   try {
//     const content = await fileModel.extractTextFromFile(filename);
//     res.json({ content });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// module.exports = {
//   getFiles,
//   extractFileContent,
// };

const fileModel = require("../models/fileModel");

async function getFiles(req, res) {
  try {
    const files = await fileModel.listFiles();
    res.json({ files });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getFileContent(req, res) {
  const filename = req.params.filename;
  try {
    const text = await fileModel.extractText(filename);
    res.json({ filename, text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getFiles,
  getFileContent,
};
