const fs = require("fs");
const path = require("path");
const Resume = require("../models/Resume");

const uploadsRoot = path.join(__dirname, "..", "uploads");

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded. Send a PDF or DOCX as field name \"resume\".",
      });
    }

    const userId = req.user.id;
    const fileUrl = `/uploads/${req.file.filename}`;
    const originalName = req.file.originalname;

    const existing = await Resume.findOne({ user: userId });
    if (existing && existing.fileUrl) {
      const oldRelative = existing.fileUrl.replace(/^\//, "");
      const oldPath = path.join(__dirname, "..", oldRelative);
      if (oldPath.startsWith(uploadsRoot) && fs.existsSync(oldPath)) {
        fs.unlink(oldPath, () => {});
      }
    }

    const resume = await Resume.findOneAndUpdate(
      { user: userId },
      {
        $set: {
          fileUrl,
          originalName,
          uploadedAt: new Date(),
        },
        $setOnInsert: { user: userId },
      },
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(201).json({
      message: "Resume uploaded successfully.",
      fileUrl,
      resume: {
        id: resume._id,
        user: resume.user,
        fileUrl: resume.fileUrl,
        originalName: resume.originalName,
        uploadedAt: resume.uploadedAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error while saving resume.",
      error: error.message,
    });
  }
};

const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.user.id }).populate(
      "user",
      "name email role"
    );

    if (!resume) {
      return res.status(404).json({ message: "No resume found for this user." });
    }

    return res.json({
      resume: {
        id: resume._id,
        user: resume.user,
        fileUrl: resume.fileUrl,
        originalName: resume.originalName,
        uploadedAt: resume.uploadedAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error while fetching resume.",
      error: error.message,
    });
  }
};

module.exports = {
  uploadResume,
  getResume,
};
