const mongoose = require("mongoose");
const Task = require("../models/Task");

const CATEGORIES = ["DSA", "Resume", "Aptitude", "Interview"];
const PRIORITIES = ["High", "Medium", "Low"];

function formatTask(doc) {
  if (!doc) return null;
  const o = doc.toObject ? doc.toObject() : doc;
  return {
    id: o._id,
    user: o.user,
    title: o.title,
    category: o.category,
    priority: o.priority,
    status: o.status,
    timeEstimate: o.timeEstimate,
    createdAt: o.createdAt,
  };
}

const createTask = async (req, res) => {
  try {
    const { title, category, priority, status, timeEstimate } = req.body;

    if (!title || !String(title).trim()) {
      return res.status(400).json({ message: "Title is required." });
    }
    if (!category || !CATEGORIES.includes(category)) {
      return res.status(400).json({
        message: `Category must be one of: ${CATEGORIES.join(", ")}.`,
      });
    }
    if (!priority || !PRIORITIES.includes(priority)) {
      return res.status(400).json({
        message: `Priority must be one of: ${PRIORITIES.join(", ")}.`,
      });
    }

    let taskStatus = "pending";
    if (status !== undefined && status !== "") {
      if (!["pending", "completed"].includes(status)) {
        return res.status(400).json({
          message: "Status must be pending or completed.",
        });
      }
      taskStatus = status;
    }

    const task = await Task.create({
      user: req.user.id,
      title: String(title).trim(),
      category,
      priority,
      status: taskStatus,
      timeEstimate: timeEstimate != null ? String(timeEstimate).trim() : "",
    });

    return res.status(201).json({
      message: "Task created",
      task: formatTask(task),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error while creating task.",
      error: error.message,
    });
  }
};

const getTasks = async (req, res) => {
  try {
    const filter = { user: req.user.id };
    const { category } = req.query;

    if (category) {
      if (!CATEGORIES.includes(category)) {
        return res.status(400).json({
          message: `Invalid category filter. Use one of: ${CATEGORIES.join(", ")}.`,
        });
      }
      filter.category = category;
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 }).lean();

    return res.json({
      tasks: tasks.map((t) => formatTask(t)),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error while fetching tasks.",
      error: error.message,
    });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid task ID." });
    }

    const task = await Task.findOne({ _id: id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    task.status = task.status === "pending" ? "completed" : "pending";
    await task.save();

    return res.json({
      message: "Task updated",
      task: formatTask(task),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error while updating task.",
      error: error.message,
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid task ID." });
    }

    const deleted = await Task.findOneAndDelete({ _id: id, user: req.user.id });
    if (!deleted) {
      return res.status(404).json({ message: "Task not found." });
    }

    return res.json({ message: "Task deleted" });
  } catch (error) {
    return res.status(500).json({
      message: "Server error while deleting task.",
      error: error.message,
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTaskStatus,
  deleteTask,
};
