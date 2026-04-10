const User = require("../models/User");
const Progress = require("../models/Progress");
const Task = require("../models/Task");

// ──────────────────────────────────────────────
// Helper: determine the weakest area from scores
// ──────────────────────────────────────────────
function getWeakArea(progress) {
  const areas = {
    DSA: progress.dsaScore,
    Resume: progress.resumeScore,
    Aptitude: progress.aptitudeScore,
    Interview: progress.mockInterviewScore,
  };

  let weakArea = "N/A";
  let lowest = Infinity;

  for (const [area, score] of Object.entries(areas)) {
    if (score < lowest) {
      lowest = score;
      weakArea = area;
    }
  }

  return weakArea;
}

// ──────────────────────────────────────────────
// Helper: classify readiness status
// ──────────────────────────────────────────────
function getStatus(readinessScore) {
  if (readinessScore >= 60) return "Ready";
  if (readinessScore >= 50) return "Improving";
  return "At Risk";
}

// ──────────────────────────────────────────────
// A) GET /api/admin/dashboard
// ──────────────────────────────────────────────
const getDashboardStats = async (_req, res) => {
  try {
    // Count all students
    const totalStudents = await User.countDocuments({ role: "student" });

    // Get all student IDs
    const studentIds = await User.find({ role: "student" })
      .select("_id")
      .lean();
    const ids = studentIds.map((s) => s._id);

    // Students who have at least one task OR a progress record → "active"
    const [studentsWithTasks, studentsWithProgress] = await Promise.all([
      Task.distinct("user", { user: { $in: ids } }),
      Progress.distinct("user", { user: { $in: ids } }),
    ]);

    const activeSet = new Set([
      ...studentsWithTasks.map(String),
      ...studentsWithProgress.map(String),
    ]);
    const activeStudents = activeSet.size;

    // Aggregate readiness buckets
    const progressDocs = await Progress.find({ user: { $in: ids } })
      .select("readinessScore")
      .lean();

    let placementReady = 0;
    let atRisk = 0;
    let totalScore = 0;

    for (const p of progressDocs) {
      totalScore += p.readinessScore;
      if (p.readinessScore >= 60) placementReady++;
      if (p.readinessScore < 50) atRisk++;
    }

    const avgReadiness =
      progressDocs.length > 0
        ? Math.round(totalScore / progressDocs.length)
        : 0;

    return res.status(200).json({
      totalStudents,
      activeStudents,
      placementReady,
      atRisk,
      avgReadiness,
    });
  } catch (error) {
    console.error("getDashboardStats error:", error.message);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// ──────────────────────────────────────────────
// B) GET /api/admin/students
// ──────────────────────────────────────────────
const getStudentAnalytics = async (_req, res) => {
  try {
    const students = await User.find({ role: "student" })
      .select("name email")
      .lean();

    const studentIds = students.map((s) => s._id);

    // Fetch all progress docs in one query, keyed by user id
    const progressDocs = await Progress.find({ user: { $in: studentIds } })
      .lean();

    const progressMap = new Map();
    for (const p of progressDocs) {
      progressMap.set(String(p.user), p);
    }

    const analytics = students.map((student) => {
      const progress = progressMap.get(String(student._id));
      const readinessScore = progress ? progress.readinessScore : 0;

      return {
        name: student.name,
        email: student.email,
        readinessScore,
        status: getStatus(readinessScore),
        weakArea: progress ? getWeakArea(progress) : "N/A",
      };
    });

    return res.status(200).json(analytics);
  } catch (error) {
    console.error("getStudentAnalytics error:", error.message);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// ──────────────────────────────────────────────
// C) GET /api/admin/at-risk
// ──────────────────────────────────────────────
const getAtRiskStudents = async (_req, res) => {
  try {
    // Progress docs with readinessScore < 50, populated with user info
    const atRiskProgress = await Progress.find({ readinessScore: { $lt: 50 } })
      .populate("user", "name email")
      .lean();

    const result = atRiskProgress
      .filter((p) => p.user) // guard against orphaned docs
      .map((p) => ({
        name: p.user.name,
        email: p.user.email,
        readinessScore: p.readinessScore,
        weakArea: getWeakArea(p),
        lastActive: p.updatedAt || p.createdAt,
      }));

    return res.status(200).json(result);
  } catch (error) {
    console.error("getAtRiskStudents error:", error.message);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// ──────────────────────────────────────────────
// D) GET /api/admin/insights
// ──────────────────────────────────────────────
const getAdminInsights = async (_req, res) => {
  try {
    const progressDocs = await Progress.find().lean();

    if (progressDocs.length === 0) {
      return res
        .status(200)
        .json({ insight: "No student data available yet." });
    }

    // Tally how often each area is the weakest
    const weakCount = { DSA: 0, Resume: 0, Aptitude: 0, Interview: 0 };

    for (const p of progressDocs) {
      const weak = getWeakArea(p);
      if (weak in weakCount) weakCount[weak]++;
    }

    // Sort areas by frequency (descending)
    const sorted = Object.entries(weakCount).sort((a, b) => b[1] - a[1]);
    const topWeak = sorted[0];
    const secondWeak = sorted[1];

    // Build human-readable insight
    const suggestions = {
      DSA: "Recommend a focused DSA bootcamp or daily problem-solving sessions.",
      Resume: "Recommend resume-building workshops and peer reviews.",
      Aptitude: "Recommend aptitude practice tests and quantitative drills.",
      Interview: "Recommend mock interview sessions and soft-skill workshops.",
    };

    let insight = `Most students are weak in ${topWeak[0]} (${topWeak[1]} students). ${suggestions[topWeak[0]]}`;

    if (secondWeak && secondWeak[1] > 0) {
      insight += ` Additionally, ${secondWeak[0]} is a common weak area (${secondWeak[1]} students). ${suggestions[secondWeak[0]]}`;
    }

    return res.status(200).json({ insight });
  } catch (error) {
    console.error("getAdminInsights error:", error.message);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getStudentAnalytics,
  getAtRiskStudents,
  getAdminInsights,
};
