const Task = require("../models/Task");
const Progress = require("../models/Progress");
const { calculateReadinessScore } = require("../utils/scoreEngine");

/**
 * POST /api/progress/update
 * Recalculate and upsert the user's progress document.
 */
const updateProgress = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all tasks belonging to this user
    const tasks = await Task.find({ user: userId });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(
      (t) => t.status === "completed"
    ).length;

    const scores = calculateReadinessScore({ totalTasks, completedTasks });

    // Upsert: update if exists, create if not
    const progress = await Progress.findOneAndUpdate(
      { user: userId },
      {
        ...scores,
        updatedAt: Date.now(),
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({
      message: "Progress updated",
      progress: {
        readinessScore: progress.readinessScore,
        resumeScore: progress.resumeScore,
        dsaScore: progress.dsaScore,
        aptitudeScore: progress.aptitudeScore,
        mockInterviewScore: progress.mockInterviewScore,
        consistencyScore: progress.consistencyScore,
      },
    });
  } catch (error) {
    console.error("updateProgress error:", error.message);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * GET /api/progress
 * Return the current user's progress document.
 */
const getProgress = async (req, res) => {
  try {
    const userId = req.user.id;

    const progress = await Progress.findOne({ user: userId });

    if (!progress) {
      return res.status(404).json({ message: "No progress found" });
    }

    return res.status(200).json({ progress });
  } catch (error) {
    console.error("getProgress error:", error.message);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { updateProgress, getProgress };
