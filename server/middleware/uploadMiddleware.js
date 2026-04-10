const fs = require("fs");
const multer = require("multer");
const path = require("path");

const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const safeOriginal = String(file.originalname).replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}-${safeOriginal}`);
  },
});

const allowedMime = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

function isAllowedPdfOrDocx(file) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== ".pdf" && ext !== ".docx") {
    return false;
  }
  if (allowedMime.has(file.mimetype)) {
    return true;
  }
  // Some clients send generic binary type
  if (file.mimetype === "application/octet-stream") {
    return true;
  }
  return false;
}

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (isAllowedPdfOrDocx(file)) {
      return cb(null, true);
    }
    cb(new Error("Only PDF and DOCX files are allowed."));
  },
});

/**
 * Multer middleware for a single "resume" field; returns JSON on upload errors.
 */
function uploadMiddleware(req, res, next) {
  upload.single("resume")(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ message: "File too large." });
        }
        return res.status(400).json({ message: err.message });
      }
      return res.status(400).json({
        message: err.message || "File upload failed.",
      });
    }
    next();
  });
}

module.exports = uploadMiddleware;
