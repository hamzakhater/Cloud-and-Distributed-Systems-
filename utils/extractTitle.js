module.exports = function extractTitle(text) {
  if (!text) return "بدون عنوان";
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  return lines[0] || "بدون عنوان";
};
