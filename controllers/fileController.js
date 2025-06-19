// const fileModel = require("../models/fileModel");

// async function getFiles(req, res) {
//   try {
//     const files = await fileModel.listFiles();
//     res.json({ files });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }

// async function getFileContent(req, res) {
//   const filename = req.params.filename;
//   try {
//     const text = await fileModel.extractText(filename);
//     res.json({ filename, text });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }

// module.exports = {
//   getFiles,
//   getFileContent,
// };

// // const fileModel = require("../models/fileModel");

// // const getFiles = async (req, res) => {
// //   try {
// //     const files = await fileModel.readFiles();
// //     res.json(files);
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // };

// // const extractFileContent = async (req, res) => {
// //   const filename = req.params.filename;
// //   try {
// //     const content = await fileModel.extractTextFromFile(filename);
// //     res.json({ content });
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // };

// // module.exports = {
// //   getFiles,
// //   extractFileContent,
// // };

const path = require("path");
const fs = require("fs");
const fileService = require("../services/fileService.js");

exports.home = (req, res) => {
  res.send("مرحباً! السيرفر يعمل بنجاح.");
};

exports.uploadFile = (req, res) => {
  if (!req.file) return res.status(400).send("لم يتم رفع ملف");
  res.send({ message: "تم رفع الملف بنجاح", filename: req.file.filename });
};

exports.listFiles = fileService.listFiles;
exports.serveFile = fileService.serveFile;
exports.extractFileContent = fileService.extractFileContent;
exports.analyzeFile = fileService.analyzeFile;
exports.searchInFiles = fileService.searchInFiles;
exports.getStats = fileService.getStats;
exports.getFileTitle = fileService.getFileTitle;
exports.getAllTitles = fileService.getAllTitles;
exports.sortByTitle = fileService.sortByTitle;
