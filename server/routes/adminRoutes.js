const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const {
  getDashboardStats,
  getStudentAnalytics,
  getAtRiskStudents,
  getAdminInsights,
} = require("../controllers/adminController");

const router = express.Router();

// All admin routes require authentication + admin role
router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/dashboard", getDashboardStats);
router.get("/students", getStudentAnalytics);
router.get("/at-risk", getAtRiskStudents);
router.get("/insights", getAdminInsights);

module.exports = router;
