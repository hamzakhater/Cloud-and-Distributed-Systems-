const express = require("express");
const app = express();
const fileRoutes = require("./routes/fileRoutes");
const fs = require("fs");

if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

app.use(express.json());

app.use("/", fileRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");
// const mammoth = require("mammoth"); // لتحليل ملفات .docx
// const pdfParse = require("pdf-parse"); // لتحليل ملفات PDF

// const app = express();
// app.use(express.json());
// const PORT = 3000;

// // إعداد multer لتخزين الملفات في مجلد uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/"); // تأكد من وجود المجلد uploads
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

// // إنشاء المجلد uploads إذا لم يكن موجوداً
// if (!fs.existsSync("uploads")) {
//   fs.mkdirSync("uploads");
// }

// // نقطة رفع الملف
// app.post("/upload", upload.single("file"), (req, res) => {
//   if (!req.file) {
//     return res.status(400).send("لم يتم رفع ملف");
//   }
//   res.send({ message: "تم رفع الملف بنجاح", filename: req.file.filename });
// });

// // إضافة مسار الصفحة الرئيسية
// app.get("/", (req, res) => {
//   res.send("مرحباً! السيرفر يعمل بنجاح.");
// });

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

// app.get("/files", (req, res) => {
//   const directoryPath = path.join(__dirname, "uploads");

//   fs.readdir(directoryPath, (err, files) => {
//     if (err) {
//       return res.status(500).send("حدث خطأ في قراءة الملفات");
//     }
//     res.send(files);
//   });
// });

// // لتقديم ملف معين للتحميل أو العرض
// app.get("/files/:filename", (req, res) => {
//   const filename = req.params.filename;
//   const filepath = path.join(__dirname, "uploads", filename);

//   // تأكد من وجود الملف قبل الإرسال
//   fs.access(filepath, fs.constants.F_OK, (err) => {
//     if (err) {
//       return res.status(404).send("الملف غير موجود");
//     }
//     res.sendFile(filepath);
//   });
// });

// // استخراج محتوى الملف
// app.get("/extract/:filename", async (req, res) => {
//   const filePath = path.join(__dirname, "uploads", req.params.filename);

//   if (!fs.existsSync(filePath)) {
//     return res.status(404).send("الملف غير موجود");
//   }

//   try {
//     let content = "";

//     if (filePath.endsWith(".pdf")) {
//       const dataBuffer = fs.readFileSync(filePath);
//       const data = await pdfParse(dataBuffer);
//       content = data.text;
//     } else if (filePath.endsWith(".docx")) {
//       const data = await mammoth.extractRawText({ path: filePath });
//       content = data.value;
//     } else {
//       return res.status(400).send("نوع الملف غير مدعوم");
//     }

//     res.send({ content });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("حدث خطأ أثناء استخراج المحتوى");
//   }
// });

// // تحليل محتوى الملف
// app.post("/analyze", async (req, res) => {
//   const { filename } = req.body;
//   if (!filename) return res.status(400).json({ error: "يرجى إرسال اسم الملف" });

//   const filePath = path.join(__dirname, "uploads", filename);

//   try {
//     const result = await mammoth.extractRawText({ path: filePath });
//     const text = result.value.toLowerCase();

//     // التحليل الأساسي
//     const wordCount = text.trim().split(/\s+/).length;
//     const sentenceCount = text.split(/[.!?]+/).length - 1;

//     const words = text.match(/\w+/g) || [];
//     const freq = {};
//     for (const word of words) {
//       freq[word] = (freq[word] || 0) + 1;
//     }

//     const topWords = Object.entries(freq)
//       .sort((a, b) => b[1] - a[1])
//       .slice(0, 5)
//       .map(([word, count]) => ({ word, count }));

//     // Decision-tree like classification
//     const decisionTreeCategories = [
//       {
//         name: "Health",
//         keywords: ["health", "doctor", "medicine", "hospital", "disease"],
//       },
//       {
//         name: "Education",
//         keywords: [
//           "student",
//           "university",
//           "course",
//           "study",
//           "exam",
//           "academic",
//         ],
//       },
//       {
//         name: "Cloud",
//         keywords: [
//           "cloud",
//           "computing",
//           "storage",
//           "server",
//           "virtual",
//           "platform",
//         ],
//       },
//       {
//         name: "Business",
//         keywords: ["business", "market", "sales", "finance", "management"],
//       },
//     ];

//     let matchedCategory = "غير مصنف";
//     for (const category of decisionTreeCategories) {
//       for (const keyword of category.keywords) {
//         if (text.includes(keyword)) {
//           matchedCategory = category.name;
//           break;
//         }
//       }
//       if (matchedCategory !== "غير مصنف") break;
//     }

//     res.json({
//       filename,
//       wordCount,
//       sentenceCount,
//       topWords,
//       category: matchedCategory,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "فشل في تحليل الملف" });
//   }
// });

// // نقطة نهاية البحث داخل الملفات
// app.get("/search", async (req, res) => {
//   const query = req.query.q;
//   const sortBy = req.query.sortBy; // نقرأ قيمة الفرز من query params

//   if (!query) {
//     return res
//       .status(400)
//       .json({ error: "يرجى إرسال كلمة البحث كـ query parameter ?q=..." });
//   }

//   const directoryPath = path.join(__dirname, "uploads");

//   try {
//     const files = await fs.promises.readdir(directoryPath);

//     const results = [];

//     for (const file of files) {
//       const filePath = path.join(directoryPath, file);
//       let textContent = "";

//       if (file.endsWith(".pdf")) {
//         const dataBuffer = await fs.promises.readFile(filePath);
//         const data = await pdfParse(dataBuffer);
//         textContent = data.text;
//       } else if (file.endsWith(".docx")) {
//         const data = await mammoth.extractRawText({ path: filePath });
//         textContent = data.value;
//       } else {
//         continue;
//       }

//       const regex = new RegExp(query, "gi");
//       const matches = textContent.match(regex);
//       if (matches && matches.length > 0) {
//         results.push({
//           filename: file,
//           occurrences: matches.length,
//         });
//       }
//     }

//     // فرز النتائج بناءً على sortBy
//     if (sortBy === "occurrences") {
//       results.sort((a, b) => b.occurrences - a.occurrences); // تنازلي حسب التكرار
//     } else if (sortBy === "filename") {
//       results.sort((a, b) => a.filename.localeCompare(b.filename)); // أبجدي
//     }

//     res.json({ query, results });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "حدث خطأ أثناء البحث" });
//   }
// });

// app.get("/stats", async (req, res) => {
//   try {
//     const directoryPath = path.join(__dirname, "uploads");
//     const files = await fs.promises.readdir(directoryPath);

//     let totalSize = 0;
//     let totalWords = 0;
//     let totalSentences = 0;
//     let categoryCount = {};

//     for (const file of files) {
//       const filePath = path.join(directoryPath, file);
//       const stats = await fs.promises.stat(filePath);
//       totalSize += stats.size;

//       let textContent = "";
//       if (file.endsWith(".pdf")) {
//         const dataBuffer = await fs.promises.readFile(filePath);
//         const data = await pdfParse(dataBuffer);
//         textContent = data.text;
//       } else if (file.endsWith(".docx")) {
//         const data = await mammoth.extractRawText({ path: filePath });
//         textContent = data.value;
//       } else {
//         continue;
//       }

//       const text = textContent.toLowerCase();

//       // حساب الكلمات والجمل
//       totalWords += text.trim().split(/\s+/).length;
//       totalSentences += text.split(/[.!?]+/).length - 1;

//       // تصنيف بسيط
//       const categories = {
//         Cloud: ["cloud", "computing", "server", "storage"],
//         Education: ["student", "university", "course", "study"],
//         Health: ["health", "doctor", "medicine", "hospital"],
//         Business: ["business", "market", "sales", "finance"],
//       };

//       let matchedCategory = "غير مصنف";
//       for (const [category, keywords] of Object.entries(categories)) {
//         for (const keyword of keywords) {
//           if (text.includes(keyword)) {
//             matchedCategory = category;
//             break;
//           }
//         }
//         if (matchedCategory !== "غير مصنف") break;
//       }

//       categoryCount[matchedCategory] =
//         (categoryCount[matchedCategory] || 0) + 1;
//     }

//     res.json({
//       totalFiles: files.length,
//       totalSizeBytes: totalSize,
//       totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
//       totalWords,
//       totalSentences,
//       categoryDistribution: categoryCount,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "حدث خطأ أثناء جلب الإحصائيات" });
//   }
// });

// app.get("/title/:filename", async (req, res) => {
//   const filePath = path.join(__dirname, "uploads", req.params.filename);

//   if (!fs.existsSync(filePath)) {
//     return res.status(404).send("الملف غير موجود");
//   }

//   try {
//     const title = await extractTitleFromFile(filePath);
//     res.json({ filename: req.params.filename, title });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("فشل في استخراج العنوان");
//   }
// });

// const extractTitleFromFile = async (filePath) => {
//   const ext = path.extname(filePath).toLowerCase();
//   let textContent = "";

//   if (ext === ".pdf") {
//     const dataBuffer = await fs.promises.readFile(filePath);
//     const data = await pdfParse(dataBuffer);
//     textContent = data.text;
//   } else if (ext === ".docx") {
//     const result = await mammoth.extractRawText({ path: filePath });
//     textContent = result.value;
//   } else {
//     throw new Error("نوع الملف غير مدعوم");
//   }

//   // تقسيم النص إلى أسطر ومحاولة العثور على عنوان
//   const lines = textContent
//     .split("\n")
//     .map((line) => line.trim())
//     .filter((line) => line.length > 10); // تجاهل الأسطر القصيرة

//   // العنوان هو أول سطر غير فارغ وطوله معقول
//   const title = lines.length > 0 ? lines[0] : "عنوان غير معروف";

//   return title;
// };

// app.get("/titles", async (req, res) => {
//   const directoryPath = path.join(__dirname, "uploads");

//   try {
//     const files = await fs.promises.readdir(directoryPath);
//     const results = [];

//     for (const file of files) {
//       const filePath = path.join(directoryPath, file);
//       let title = "غير مدعوم";

//       try {
//         if (file.endsWith(".pdf")) {
//           const dataBuffer = await fs.promises.readFile(filePath);
//           const data = await pdfParse(dataBuffer);
//           // نحاول استخراج أول سطر كعنوان
//           title =
//             data.text.split("\n").find((line) => line.trim().length > 0) ||
//             "لا يوجد عنوان";
//         } else if (file.endsWith(".docx")) {
//           const data = await mammoth.extractRawText({ path: filePath });
//           // أول سطر غير فارغ كعنوان
//           title =
//             data.value.split("\n").find((line) => line.trim().length > 0) ||
//             "لا يوجد عنوان";
//         }
//       } catch (e) {
//         title = "خطأ في استخراج العنوان";
//       }

//       results.push({
//         filename: file,
//         title: title.trim(),
//       });
//     }

//     res.json(results);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "حدث خطأ أثناء جلب العناوين" });
//   }
// });

// app.get("/sort-by-title", async (req, res) => {
//   const directoryPath = path.join(__dirname, "uploads");

//   try {
//     const files = await fs.promises.readdir(directoryPath);
//     const results = [];

//     for (const file of files) {
//       const filePath = path.join(directoryPath, file);
//       let title = "غير مدعوم";

//       try {
//         if (file.endsWith(".pdf")) {
//           const dataBuffer = await fs.promises.readFile(filePath);
//           const data = await pdfParse(dataBuffer);
//           title =
//             data.text.split("\n").find((line) => line.trim().length > 0) ||
//             "لا يوجد عنوان";
//         } else if (file.endsWith(".docx")) {
//           const data = await mammoth.extractRawText({ path: filePath });
//           title =
//             data.value.split("\n").find((line) => line.trim().length > 0) ||
//             "لا يوجد عنوان";
//         }
//       } catch (e) {
//         title = "خطأ في استخراج العنوان";
//       }

//       results.push({
//         filename: file,
//         title: title.trim(),
//       });
//     }

//     // فرز حسب العنوان أبجدياً
//     results.sort((a, b) => a.title.localeCompare(b.title));

//     res.json(results);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "حدث خطأ أثناء فرز المستندات" });
//   }
// });

// app.get("/extract/:filename", async (req, res) => {
//   const filePath = path.join(__dirname, "uploads", req.params.filename);
//   const query = req.query.q; // كلمة البحث

//   if (!fs.existsSync(filePath)) {
//     return res.status(404).send("الملف غير موجود");
//   }

//   try {
//     let content = "";

//     if (filePath.endsWith(".pdf")) {
//       const dataBuffer = fs.readFileSync(filePath);
//       const data = await pdfParse(dataBuffer);
//       content = data.text;
//     } else if (filePath.endsWith(".docx")) {
//       const data = await mammoth.extractRawText({ path: filePath });
//       content = data.value;
//     } else {
//       return res.status(400).send("نوع الملف غير مدعوم");
//     }

//     // إذا جاء بحث q، نعمل تمييز للكلمة داخل النص
//     if (query) {
//       // عمل escape للكلمة للبحث الآمن داخل regex
//       const escapedQuery = query.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
//       const regex = new RegExp(`(${escapedQuery})`, "gi");

//       content = content.replace(regex, "<mark>$1</mark>");
//     }

//     res.send({ content });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("حدث خطأ أثناء استخراج المحتوى");
//   }
// });
