import React, { useState, useEffect, useMemo, useCallback } from "react";
import api from "../../services/api";
import {
  CheckCircle,
  AlarmClock,
  BadgeCheck,
  ClipboardList,
  Bolt,
  User,
  AlertCircle,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";

const CATEGORY_ICONS = {
  DSA: <Bolt className="w-5 h-5 text-indigo-400 mr-2" strokeWidth={2.2} />,
  Resume: <ClipboardList className="w-5 h-5 text-amber-400 mr-2" strokeWidth={2.2} />,
  Aptitude: <AlertCircle className="w-5 h-5 text-green-400 mr-2" strokeWidth={2.2} />,
  Interview: <User className="w-5 h-5 text-pink-400 mr-2" strokeWidth={2.2} />,
};

const FILTERS = [
  { label: "All", value: "All" },
  { label: "DSA", value: "DSA" },
  { label: "Resume", value: "Resume" },
  { label: "Aptitude", value: "Aptitude" },
  { label: "Interview", value: "Interview" },
];

const CATEGORIES = ["DSA", "Resume", "Aptitude", "Interview"];
const PRIORITIES = ["High", "Medium", "Low"];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function ProgressBar({ value, max }) {
  const percent = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-700"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null); // id of task being acted on

  // New-task form state
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("DSA");
  const [newPriority, setNewPriority] = useState("Medium");
  const [newEstimate, setNewEstimate] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // ─── Fetch tasks ───
  const fetchTasks = useCallback(async () => {
    try {
      setError("");
      const { data } = await api.get("/api/tasks");
      setTasks(data.tasks || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // ─── Create task ───
  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);
    try {
      const { data } = await api.post("/api/tasks", {
        title: newTitle,
        category: newCategory,
        priority: newPriority,
        timeEstimate: newEstimate,
      });
      setTasks((prev) => [data.task, ...prev]);
      setNewTitle("");
      setNewEstimate("");
      setShowForm(false);
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to create task");
    } finally {
      setFormLoading(false);
    }
  };

  // ─── Toggle status ───
  const toggleStatus = async (id) => {
    setActionLoading(id);
    try {
      const { data } = await api.put(`/api/tasks/${id}`);
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? data.task : t))
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task");
    } finally {
      setActionLoading(null);
    }
  };

  // ─── Delete task ───
  const deleteTask = async (id) => {
    setActionLoading(id);
    try {
      await api.delete(`/api/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete task");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredTasks = useMemo(() => {
    if (filter === "All") return tasks;
    return tasks.filter((task) => task.category === filter);
  }, [filter, tasks]);

  const completedCount = useMemo(
    () => tasks.filter((t) => t.status === "completed").length,
    [tasks]
  );

  // ─── Loading state ───
  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-start p-0 md:p-8">
      {/* Header */}
      <header className="w-full max-w-2xl pt-10 pb-2 px-4 md:px-0">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
          Today's Missions
        </h1>
        <h2 className="text-lg text-slate-400 font-medium mb-6">
          Complete tasks to improve your placement readiness
        </h2>

        {/* Error banner */}
        {error && (
          <div className="mb-4 rounded-lg border border-rose-500/40 bg-rose-950/50 px-3 py-2 text-sm text-rose-200">
            {error}
          </div>
        )}

        {/* Progress Bar */}
        <div className="flex items-center mb-8">
          <ProgressBar value={completedCount} max={tasks.length} />
          <span className="ml-4 text-slate-300 text-sm font-semibold min-w-fit">
            {completedCount}/{tasks.length} completed
          </span>
        </div>

        {/* Filter Bar + Add Button */}
        <div className="flex items-center justify-between mb-6">
          <nav className="flex gap-2 sm:gap-4 overflow-x-auto">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                className={classNames(
                  "px-3 py-1 rounded-full text-sm font-semibold border transition-all duration-200",
                  filter === f.value
                    ? "bg-indigo-600 border-indigo-500 text-white shadow"
                    : "bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
                onClick={() => setFilter(f.value)}
                tabIndex={0}
              >
                {f.label}
              </button>
            ))}
          </nav>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-sm font-semibold shadow hover:brightness-110 transition"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>

        {/* New task form */}
        {showForm && (
          <form
            onSubmit={handleCreate}
            className="mb-6 p-4 bg-slate-900 rounded-2xl border border-slate-700 flex flex-col gap-3"
          >
            {formError && (
              <p className="text-sm text-rose-300">{formError}</p>
            )}
            <input
              type="text"
              placeholder="Task title"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
            />
            <div className="flex gap-3 flex-wrap">
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-white focus:outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className="rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-white focus:outline-none"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Time estimate (e.g. 30 min)"
                value={newEstimate}
                onChange={(e) => setNewEstimate(e.target.value)}
                className="flex-1 rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={formLoading}
              className="self-end px-5 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-500 disabled:opacity-50 transition"
            >
              {formLoading ? "Creating…" : "Create Task"}
            </button>
          </form>
        )}
      </header>

      {/* Task Cards Container */}
      <section className="w-full max-w-2xl px-2 md:px-0 grid grid-cols-1 gap-5">
        {filteredTasks.length === 0 && (
          <div className="text-slate-500 p-6 bg-slate-900 rounded-2xl text-center font-medium shadow">
            {tasks.length === 0
              ? "No tasks yet — create your first task! 🚀"
              : "No tasks in this category 🎉"}
          </div>
        )}
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={classNames(
              "rounded-2xl p-5 md:p-6 transition-all bg-slate-900 shadow-card relative flex flex-col md:flex-row md:items-center gap-4 md:gap-8 border border-transparent group",
              task.status === "completed"
                ? "opacity-60 border-slate-700"
                : "hover:shadow-xl hover:border-indigo-500"
            )}
          >
            {/* Icon and Main Info */}
            <div className="flex-shrink-0 flex items-start md:items-center">
              {CATEGORY_ICONS[task.category]}
            </div>
            <div className="flex-1">
              <div
                className={classNames(
                  "font-semibold text-lg md:text-xl mb-1 transition-all",
                  task.status === "completed"
                    ? "text-slate-500 line-through"
                    : "text-white group-hover:text-indigo-200"
                )}
              >
                {task.title}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm mt-1 text-slate-400">
                <span className="bg-slate-800 px-2 py-0.5 rounded-full mr-2">
                  {task.category}
                </span>
                <span
                  className={classNames(
                    "font-semibold rounded-full px-2 py-0.5",
                    task.priority === "High"
                      ? "bg-pink-600 text-white"
                      : task.priority === "Medium"
                      ? "bg-indigo-700 text-slate-100"
                      : "bg-slate-700 text-slate-200"
                  )}
                >
                  {task.priority} Priority
                </span>
                {task.timeEstimate && (
                  <span className="ml-2 bg-slate-700 px-2 py-0.5 rounded-full text-slate-300 flex items-center gap-1">
                    <AlarmClock className="w-4 h-4 text-slate-400 inline" strokeWidth={2} />
                    {task.timeEstimate}
                  </span>
                )}
                <span
                  className={classNames(
                    "ml-2 px-2 py-0.5 rounded-full font-semibold",
                    task.status === "completed"
                      ? "bg-green-700 text-green-200"
                      : "bg-yellow-900 text-yellow-400"
                  )}
                >
                  {task.status === "completed" ? "Completed" : "Pending"}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 items-end min-w-[120px]">
              {task.status === "completed" ? (
                <button
                  onClick={() => toggleStatus(task.id)}
                  disabled={actionLoading === task.id}
                  className="flex items-center text-green-400 font-semibold hover:text-green-300 transition disabled:opacity-50"
                >
                  <CheckCircle className="w-6 h-6 mr-1" strokeWidth={2.2} />
                  Done
                </button>
              ) : (
                <button
                  onClick={() => toggleStatus(task.id)}
                  disabled={actionLoading === task.id}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-medium rounded-xl shadow transition-all hover:brightness-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
                  aria-label="Mark as done"
                >
                  {actionLoading === task.id ? "Updating…" : "Mark as Done"}
                </button>
              )}
              <button
                onClick={() => deleteTask(task.id)}
                disabled={actionLoading === task.id}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-rose-400 transition disabled:opacity-50"
                aria-label="Delete task"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
            {/* Fade layer animation when done */}
            {task.status === "completed" && (
              <div className="absolute inset-0 bg-slate-950/60 rounded-2xl pointer-events-none transition-all" />
            )}
          </div>
        ))}
      </section>
      {/* Extra bottom padding for mobile */}
      <div className="h-10" />
    </main>
  );
}

export default Tasks;
