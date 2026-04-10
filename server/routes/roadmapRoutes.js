const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { generateRoadmap, getRoadmap } = require("../controllers/roadmapController");

const router = express.Router();

router.post("/generate", authMiddleware, generateRoadmap);
router.get("/", authMiddleware, getRoadmap);

module.exports = router;
