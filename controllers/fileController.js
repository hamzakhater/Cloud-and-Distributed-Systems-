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
