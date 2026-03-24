const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// Create uploads folder if not exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // This points to the exact location of the Render Disk
    const uploadDir = path.join(__dirname, 'uploads'); 
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});


const upload = multer({ storage });

// Upload API
const uploadPath = "/uploads";
app.post("/upload", upload.single("file"), (req, res) => {
  res.json({ message: "File uploaded successfully!" });
});

// Get file list
app.get("/files", (req, res) => {
  fs.readdir("uploads", (err, files) => {
    if (err) return res.status(500).json({ error: "Unable to read files" });
    res.json(files);
  });
});

// Download file
app.get("/download/:filename", (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.params.filename);
  res.download(filePath);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
