const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static("public"));

// 1. Cloudinary Configuration 
// (These values will be pulled from Render Environment Variables)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// 2. Setup Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "user_uploads", // Folder name in Cloudinary
    resource_type: "auto",  // Supports images, PDFs, etc.
  },
});

const upload = multer({ storage });

// 3. Upload API
app.post("/upload", upload.single("file"), (req, res) => {
  // Cloudinary returns the file URL in req.file.path
  res.json({ 
    message: "File uploaded successfully!", 
    url: req.file.path 
  });
});

// 4. Get file list (Fetches directly from Cloudinary)
app.get("/files", async (req, res) => {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'user_uploads/' 
    });
    // Maps the results to show just the secure URLs
    const fileUrls = result.resources.map(file => file.secure_url);
    res.json(fileUrls);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch files from cloud" });
  }
});

// 5. Download / View
// Note: With Cloudinary, you don't need a download route. 
// You can just open the URL directly in the browser!

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
