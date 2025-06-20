const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const fileController = require("../controllers/fileController.js");

// إعداد مجلد الرفع
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// إنشاء مجلد uploads إن لم يكن موجوداً
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

router.get("/", fileController.home);
router.post("/upload", upload.single("file"), fileController.uploadFile);
router.get("/files", fileController.listFiles);
router.get("/files/:filename", fileController.serveFile);
router.get("/extract/:filename", fileController.extractFileContent);
router.post("/analyze", fileController.analyzeFile);
router.get("/search", fileController.searchInFiles);
router.get("/stats", fileController.getStats);
router.get("/title/:filename", fileController.getFileTitle);
router.get("/titles", fileController.getAllTitles);
router.get("/sort-by-title", fileController.sortByTitle);

module.exports = router;
