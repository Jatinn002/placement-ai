const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

const app = express();

// CORS CONFIGURATION (IMPORTANT)
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

// MIDDLEWARE
app.use(express.json());

// STATIC FILES
app.use("/uploads", express.static("uploads"));

// ROUTES
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/resume", require("./routes/resumeRoutes"));
app.use("/api/roadmap", require("./routes/roadmapRoutes"));
app.use("/api/progress", require("./routes/progressRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// ROOT ROUTE
app.get("/", (req, res) => {
  res.send("PlaceMentor AI Backend Running...");
});

// ERROR HANDLING
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Server Error" });
});

// SERVER START
const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;

if (require.main === module) {
  start().catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
}
