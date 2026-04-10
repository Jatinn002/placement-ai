/**
 * Admin authorization middleware.
 * Must be used AFTER authMiddleware so that req.user is populated.
 * Rejects non-admin users with 403 Forbidden.
 */
const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden. Admin access only." });
  }
  next();
};

module.exports = adminMiddleware;
