const path = require("path");
const fs = require("fs");
const mammoth = require("mammoth");
const pdfParse = require("pdf-parse");
const extractTitle = require("../utils/extractTitle.js");

const uploadsDir = path.join(__dirname, "..", "uploads");

// جلب جميع أسماء الملفات
exports.listFiles = (req, res) => {
  fs.readdir(uploadsDir, (err, files) => {
    if (err) return res.status(500).send("خطأ في قراءة الملفات");
    res.json(files);
  });
};

// عرض محتوى ملف معين
exports.serveFile = (req, res) => {
  const filePath = path.join(uploadsDir, req.params.filename);
  if (!fs.existsSync(filePath)) return res.status(404).send("الملف غير موجود");
  res.sendFile(filePath);
};

// استخراج المحتوى من ملف PDF أو DOCX
exports.extractFileContent = async (req, res) => {
  try {
    const filePath = path.join(uploadsDir, req.params.filename);
    const ext = path.extname(filePath).toLowerCase();

    if (!fs.existsSync(filePath))
      return res.status(404).send("الملف غير موجود");

    let text = "";

    if (ext === ".pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      text = data.text;
    } else if (ext === ".docx") {
      const data = await mammoth.extractRawText({ path: filePath });
      text = data.value;
    } else {
      return res.status(400).send("النوع غير مدعوم");
    }

    res.send({ content: text.trim() });
  } catch (err) {
    res.status(500).send("حدث خطأ أثناء استخراج المحتوى");
  }
};

// تحليل نص للعثور على كلمات متكررة
exports.analyzeFile = async (req, res) => {
  const filename = req.query.filename;
  if (!filename) return res.status(400).send("يرجى تحديد اسم الملف");

  const filePath = path.join(__dirname, "..", "uploads", filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("الملف غير موجود");
  }

  try {
    let text = "";

    if (filename.endsWith(".docx")) {
      const result = await mammoth.extractRawText({ path: filePath });
      text = result.value;
    } else if (filename.endsWith(".pdf")) {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      text = data.text;
    } else {
      return res.status(400).send("نوع الملف غير مدعوم");
    }

    const words = text.toLowerCase().match(/\b\w+\b/g);
    const wordCounts = {};
    words.forEach((word) => {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });

    const sorted = Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([word, count]) => ({ word, count }));

    res.json(sorted.slice(0, 20));
  } catch (err) {
    res.status(500).send("حدث خطأ أثناء معالجة الملف");
  }
};
// البحث في جميع الملفات
exports.searchInFiles = async (req, res) => {
  const query = req.query.q?.toLowerCase();
  if (!query) return res.status(400).send("يرجى تحديد كلمة البحث");

  try {
    const files = fs.readdirSync(uploadsDir);
    const matches = [];

    for (const file of files) {
      const filePath = path.join(uploadsDir, file);
      const ext = path.extname(file).toLowerCase();
      let text = "";

      if (ext === ".pdf") {
        const buffer = fs.readFileSync(filePath);
        const data = await pdfParse(buffer);
        text = data.text;
      } else if (ext === ".docx") {
        const data = await mammoth.extractRawText({ path: filePath });
        text = data.value;
      }

      if (text.toLowerCase().includes(query)) {
        matches.push(file);
      }
    }

    res.json(matches);
  } catch (err) {
    res.status(500).send("حدث خطأ أثناء البحث");
  }
};

// إحصائيات عدد الملفات حسب النوع
exports.getStats = (req, res) => {
  fs.readdir(uploadsDir, (err, files) => {
    if (err) return res.status(500).send("خطأ في قراءة الملفات");

    const stats = { pdf: 0, docx: 0 };

    files.forEach((file) => {
      const ext = path.extname(file).toLowerCase();
      if (ext === ".pdf") stats.pdf++;
      else if (ext === ".docx") stats.docx++;
    });

    res.json(stats);
  });
};

// استخراج عنوان من ملف واحد
exports.getFileTitle = async (req, res) => {
  try {
    const filePath = path.join(uploadsDir, req.params.filename);
    if (!fs.existsSync(filePath))
      return res.status(404).send("الملف غير موجود");

    const ext = path.extname(filePath).toLowerCase();
    let text = "";

    if (ext === ".pdf") {
      const data = await pdfParse(fs.readFileSync(filePath));
      text = data.text;
    } else if (ext === ".docx") {
      const data = await mammoth.extractRawText({ path: filePath });
      text = data.value;
    }

    const title = extractTitle(text);
    res.json({ title });
  } catch (err) {
    res.status(500).send("حدث خطأ في استخراج العنوان");
  }
};

// استخراج عناوين جميع الملفات
exports.getAllTitles = async (req, res) => {
  try {
    const files = fs.readdirSync(uploadsDir);
    const titles = [];

    for (const file of files) {
      const filePath = path.join(uploadsDir, file);
      const ext = path.extname(file).toLowerCase();
      let text = "";

      if (ext === ".pdf") {
        const data = await pdfParse(fs.readFileSync(filePath));
        text = data.text;
      } else if (ext === ".docx") {
        const data = await mammoth.extractRawText({ path: filePath });
        text = data.value;
      }

      const title = extractTitle(text);
      titles.push({ file, title });
    }

    res.json(titles);
  } catch (err) {
    res.status(500).send("حدث خطأ في استخراج العناوين");
  }
};

// ترتيب الملفات حسب العنوان
exports.sortByTitle = async (req, res) => {
  try {
    const files = fs.readdirSync(uploadsDir);
    const titles = [];

    for (const file of files) {
      const filePath = path.join(uploadsDir, file);
      const ext = path.extname(file).toLowerCase();
      let text = "";

      if (ext === ".pdf") {
        const data = await pdfParse(fs.readFileSync(filePath));
        text = data.text;
      } else if (ext === ".docx") {
        const data = await mammoth.extractRawText({ path: filePath });
        text = data.value;
      }

      const title = extractTitle(text);
      titles.push({ file, title });
    }

    titles.sort((a, b) => a.title.localeCompare(b.title));
    res.json(titles);
  } catch (err) {
    res.status(500).send("حدث خطأ أثناء الترتيب");
  }
};
