const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    readinessScore: {
      type: Number,
      default: 0,
    },
    resumeScore: {
      type: Number,
      default: 0,
    },
    dsaScore: {
      type: Number,
      default: 0,
    },
    aptitudeScore: {
      type: Number,
      default: 0,
    },
    mockInterviewScore: {
      type: Number,
      default: 0,
    },
    consistencyScore: {
      type: Number,
      default: 0,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Progress", progressSchema);
