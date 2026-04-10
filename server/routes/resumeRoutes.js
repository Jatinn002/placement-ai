const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const uploadMiddleware = require("../middleware/uploadMiddleware");
const { uploadResume, getResume } = require("../controllers/resumeController");

const router = express.Router();

router.post("/upload", authMiddleware, uploadMiddleware, uploadResume);
router.get("/", authMiddleware, getResume);

module.exports = router;
