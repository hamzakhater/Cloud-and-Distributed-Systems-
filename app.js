const express = require("express");
const app = express();
const fileRoutes = require("./routes/fileRoutes");
const PORT = 3000;

app.use(express.json());
app.use("/", fileRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
