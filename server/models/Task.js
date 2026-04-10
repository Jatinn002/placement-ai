const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["DSA", "Resume", "Aptitude", "Interview"],
  },
  priority: {
    type: String,
    required: true,
    enum: ["High", "Medium", "Low"],
  },
  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },
  timeEstimate: {
    type: String,
    trim: true,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Task", taskSchema);
