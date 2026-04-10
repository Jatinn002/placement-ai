const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  updateProgress,
  getProgress,
} = require("../controllers/progressController");

const router = express.Router();

router.post("/update", authMiddleware, updateProgress);
router.get("/", authMiddleware, getProgress);

module.exports = router;
