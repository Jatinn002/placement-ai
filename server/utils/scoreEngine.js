/**
 * Generate a random integer between min and max (inclusive).
 */
function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Calculate placement readiness score and sub-scores based on task completion.
 *
 * @param {Object} params
 * @param {number} params.totalTasks   - Total number of tasks for the user
 * @param {number} params.completedTasks - Number of completed tasks
 * @returns {Object} Score breakdown
 */
function calculateReadinessScore({ totalTasks, completedTasks }) {
  const completionRate = totalTasks > 0 ? completedTasks / totalTasks : 0;

  const readinessScore = Math.round(completionRate * 100);

  // Realistic dummy sub-scores
  const resumeScore = randomBetween(50, 80);
  const dsaScore = randomBetween(40, 75);
  const aptitudeScore = randomBetween(50, 80);
  const mockInterviewScore = randomBetween(30, 70);

  // Consistency derived from how steadily the user completes tasks
  const consistencyScore = Math.round(completionRate * 100);

  return {
    readinessScore,
    resumeScore,
    dsaScore,
    aptitudeScore,
    mockInterviewScore,
    consistencyScore,
  };
}

module.exports = { calculateReadinessScore };
