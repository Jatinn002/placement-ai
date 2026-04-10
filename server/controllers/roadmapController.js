const Roadmap = require("../models/Roadmap");

function buildDummyRoadmap() {
  return [
    {
      title: "Week 1",
      tasks: ["Resume Improvement", "Basic DSA (Arrays)"],
      status: "in-progress",
    },
    {
      title: "Week 2",
      tasks: ["Linked List", "Aptitude Practice"],
      status: "upcoming",
    },
    {
      title: "Week 3",
      tasks: ["Medium DSA", "Mock Interview"],
      status: "upcoming",
    },
    {
      title: "Week 4",
      tasks: ["Revision", "Final Interview Prep"],
      status: "upcoming",
    },
  ];
}

const generateRoadmap = async (req, res) => {
  try {
    const userId = req.user.id;
    const weeks = buildDummyRoadmap();

    const roadmap = await Roadmap.findOneAndUpdate(
      { user: userId },
      {
        $set: { weeks },
        $setOnInsert: { user: userId, createdAt: new Date() },
      },
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(201).json({
      message: "Roadmap generated successfully",
      roadmap: formatRoadmapResponse(roadmap),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error while generating roadmap.",
      error: error.message,
    });
  }
};

const getRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({ user: req.user.id });

    if (!roadmap) {
      return res.status(404).json({
        message: "No roadmap found. Generate one using POST /api/roadmap/generate.",
      });
    }

    return res.json({
      roadmap: formatRoadmapResponse(roadmap),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error while fetching roadmap.",
      error: error.message,
    });
  }
};

function formatRoadmapResponse(doc) {
  return {
    id: doc._id,
    user: doc.user,
    weeks: doc.weeks,
    createdAt: doc.createdAt,
  };
}

module.exports = {
  generateRoadmap,
  getRoadmap,
};
