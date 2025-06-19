// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");
// const fileController = require("../controllers/fileController");

// const router = express.Router();

// // إعداد multer للرفع
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadPath = path.join(__dirname, "..", "uploads");
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath);
//     }
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = Date.now() + "-" + file.originalname;
//     cb(null, uniqueName);
//   },
// });
// const upload = multer({ storage });

// // رفع ملف واحد
// router.post("/upload", upload.single("file"), (req, res) => {
//   if (!req.file) return res.status(400).json({ error: "لم يتم رفع ملف" });
//   res.json({ message: "تم رفع الملف بنجاح", filename: req.file.filename });
// });

// // قائمة الملفات
// router.get("/files", fileController.getFiles);

// // استخراج محتوى ملف
// router.get("/extract/:filename", fileController.getFileContent);

// module.exports = router;

// // const express = require("express");
// // const router = express.Router();
// // const multer = require("multer");
// // const path = require("path");
// // const fs = require("fs");
// // const fileController = require("../controllers/fileController");

// // // إعداد multer
// // const storage = multer.diskStorage({
// //   destination: (req, file, cb) => {
// //     cb(null, "uploads/");
// //   },
// //   filename: (req, file, cb) => {
// //     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
// //     cb(null, uniqueSuffix + "-" + file.originalname);
// //   },
// // });
// // const upload = multer({ storage });

// // // رفع ملف
// // router.post("/upload", upload.single("file"), (req, res) => {
// //   if (!req.file) return res.status(400).send("لم يتم رفع ملف");
// //   res.json({ message: "تم رفع الملف بنجاح", filename: req.file.filename });
// // });

// // // الحصول على ملفات
// // router.get("/files", fileController.getFiles);

// // // استخراج محتوى ملف
// // router.get("/extract/:filename", fileController.extractFileContent);

// // module.exports = router;

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
