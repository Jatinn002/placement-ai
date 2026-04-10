import React, { useState, useEffect } from "react";
import api from "../../services/api";
import {
  BarChart2,
  Gauge,
  TrendingUp,
  FileText,
  LayoutList,
  Target,
  Clock9,
  CheckCircle2,
  Sparkles,
  ChevronRightCircle,
  LineChart,
  UserCheck,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

// Static chart data (historical trend — would be dynamic in a full system)
const progressData = [
  { name: "Wk1", Ready: 35 },
  { name: "Wk2", Ready: 42 },
  { name: "Wk3", Ready: 50 },
  { name: "Wk4", Ready: 57 },
  { name: "Wk5", Ready: 63 },
];

function Progress() {
  const [scores, setScores] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  // Fetch existing progress on mount
  useEffect(() => {
    async function fetchProgress() {
      try {
        const { data } = await api.get("/api/progress");
        setScores(data.progress);
      } catch (err) {
        // 404 means no progress yet — that's OK
        if (err.response?.status !== 404) {
          setError(err.response?.data?.message || "Failed to load progress");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProgress();
  }, []);

  // Recalculate scores from current tasks
  const handleUpdate = async () => {
    setUpdating(true);
    setError("");
    try {
      const { data } = await api.post("/api/progress/update");
      setScores(data.progress);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update progress");
    } finally {
      setUpdating(false);
    }
  };

  // Build breakdown from live scores
  const breakdown = scores
    ? [
        {
          label: "Resume",
          value: scores.resumeScore,
          icon: <FileText className="w-5 h-5 text-cyan-300" />,
          color: "from-cyan-800 to-cyan-600 shadow-cyan-800/40",
        },
        {
          label: "DSA",
          value: scores.dsaScore,
          icon: <LayoutList className="w-5 h-5 text-indigo-300" />,
          color: "from-indigo-800 to-indigo-600 shadow-indigo-800/40",
        },
        {
          label: "Aptitude",
          value: scores.aptitudeScore,
          icon: <Target className="w-5 h-5 text-fuchsia-300" />,
          color: "from-fuchsia-800 to-fuchsia-700 shadow-fuchsia-800/30",
        },
        {
          label: "Mock Interview",
          value: scores.mockInterviewScore,
          icon: <UserCheck className="w-5 h-5 text-amber-300" />,
          color: "from-amber-800 to-yellow-600 shadow-yellow-800/30",
        },
        {
          label: "Consistency",
          value: scores.consistencyScore,
          icon: <Clock9 className="w-5 h-5 text-green-300" />,
          color: "from-green-800 to-emerald-700 shadow-green-800/30",
        },
      ]
    : [];

  const readiness = scores?.readinessScore ?? 0;

  // Determine weakest area for the AI insight
  const weakest =
    breakdown.length > 0
      ? breakdown.reduce((min, cur) => (cur.value < min.value ? cur : min))
      : null;

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900/95 to-[#161a27] py-10 px-3 md:px-8 flex items-center justify-center">
      <motion.section
        initial={{ opacity: 0, y: 34 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl mx-auto flex flex-col gap-8"
      >
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BarChart2 className="w-7 h-7 text-cyan-400" strokeWidth={2.1} />
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                Your Progress
              </h1>
            </div>
            <p className="text-slate-400 text-base font-medium">
              Track your journey towards <span className="text-cyan-300 font-semibold">placement readiness</span>
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <button
              onClick={handleUpdate}
              disabled={updating}
              className="inline-flex items-center px-4 py-2 rounded-full bg-cyan-700 hover:bg-cyan-600 text-white font-semibold text-sm shadow border border-cyan-600/40 transition disabled:opacity-50"
            >
              {updating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" /> Updating…
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4 mr-1" /> Update Scores
                </>
              )}
            </button>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-cyan-900/60 text-cyan-200 font-medium text-xs shadow border border-cyan-700/40">
              <Sparkles className="w-4 h-4 mr-1" /> Premium Dashboard
            </span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-rose-500/40 bg-rose-950/50 px-3 py-2 text-sm text-rose-200">
            {error}
          </div>
        )}

        {/* No progress yet */}
        {!scores && !error && (
          <div className="text-center py-16">
            <Gauge className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg font-medium mb-4">No progress data yet</p>
            <p className="text-slate-500 text-sm mb-6">Complete some tasks, then click "Update Scores" to calculate your readiness.</p>
            <button
              onClick={handleUpdate}
              disabled={updating}
              className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold shadow hover:brightness-110 transition disabled:opacity-50"
            >
              {updating ? "Calculating…" : "Calculate My Scores"}
            </button>
          </div>
        )}

        {/* SCORES */}
        {scores && (
          <>
            {/* READINESS SCORE */}
            <motion.div
              initial={{ opacity: 0, scale: 0.93 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full flex flex-col md:flex-row items-center md:items-stretch gap-6"
            >
              <div className="flex-1 flex items-center justify-center md:justify-start">
                <div className="relative bg-gradient-to-br from-cyan-700/50 via-slate-900/80 to-indigo-800/50 p-7 rounded-2xl border border-cyan-800/50 shadow-lg flex flex-col items-center min-w-[220px] max-w-xs w-full group hover:shadow-xl hover:-translate-y-1 transition">
                  <span className="absolute top-3 right-3 bg-cyan-700/70 text-cyan-100 text-xs px-2 py-0.5 rounded-full shadow border border-cyan-800/30 font-bold select-none">Placement Readiness</span>
                  <div className="flex items-center gap-2 mt-5 mb-4">
                    <Gauge className="w-11 h-11 text-cyan-200 drop-shadow-[0_0_12px_#22d3ee44]" strokeWidth={2.2} />
                    <span className="text-[54px] font-black text-white leading-none tracking-tight drop-shadow-lg">
                      {readiness}%
                    </span>
                  </div>
                  <div className="text-sm text-cyan-200 font-bold uppercase tracking-wide mb-1">
                    Ready Level
                  </div>
                  <div className="text-slate-300 text-base font-medium text-center">
                    {readiness >= 60
                      ? "Great work! You're on track for placements."
                      : weakest
                        ? <>Focus more on <span className="text-cyan-200 font-semibold">{weakest.label}</span> to improve faster</>
                        : "Keep completing tasks to build your readiness!"}
                  </div>
                </div>
              </div>

              {/* SCORE BREAKDOWN */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {breakdown.map((cat, i) => (
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 * i }}
                    key={cat.label}
                    className={`flex items-center gap-3 rounded-xl p-4 bg-gradient-to-tr ${cat.color} border border-slate-800 shadow-md hover:scale-[1.03] group transition transform duration-170 cursor-pointer relative`}
                  >
                    <span className="flex-shrink-0 rounded-full bg-black/10 border border-slate-700 p-2 mr-1 shadow-sm group-hover:bg-black/20 transition">{cat.icon}</span>
                    <div>
                      <div className="text-[16px] font-semibold text-white flex items-center gap-1">
                        {cat.label}
                        {cat.label === "Resume" &&
                          <CheckCircle2 className="w-4 h-4 ml-1 text-cyan-200" />
                        }
                      </div>
                      <div className="flex items-end gap-1">
                        <span className="text-[27px] font-black text-cyan-50">{cat.value}</span>
                        <span className="text-xs font-bold text-slate-400 mb-1">/ 100</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Progress Chart & Improvement Snapshot */}
            <div className="w-full flex flex-col lg:flex-row gap-6 mt-2">
              {/* PROGRESS CHART */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex-1 bg-gradient-to-br from-indigo-900/60 via-slate-900/90 to-cyan-900/60 rounded-2xl shadow-xl p-6 border border-indigo-900 relative overflow-hidden"
              >
                <div className="flex items-center gap-2 mb-2">
                  <LineChart className="w-5 h-5 text-indigo-300" />
                  <div className="text-base font-bold text-indigo-100">Readiness Growth</div>
                  <span className="ml-2 px-2 py-0.5 bg-indigo-800/40 text-indigo-200 rounded-full text-xs font-semibold">Last 5 weeks</span>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <ReLineChart data={progressData}>
                    <defs>
                      <linearGradient id="colorReady" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#67e8f9" stopOpacity={0.65}/>
                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0.16}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" axisLine={false} tick={{ fill: "#bae6fd", fontSize: 13, fontWeight: "bold" }} tickLine={false} />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{ background: "#13194b", borderRadius: 13, border: "1px solid #6ee7b7", color:'#fff'}}
                      labelStyle={{ color: "#67e8f9", fontWeight: 600 }}
                      itemStyle={{ color: "#fff" }}
                    />
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <Line
                      type="monotone"
                      dataKey="Ready"
                      stroke="#22d3ee"
                      strokeWidth={3.8}
                      dot={{ r: 5, fill: "#cffafe", stroke: "#0ea5e9", strokeWidth: 2 }}
                      activeDot={{ r: 8, fill: "#fef9c3", stroke: "#22d3ee", strokeWidth: 3 }}
                      fill="url(#colorReady)"
                    />
                  </ReLineChart>
                </ResponsiveContainer>
              </motion.div>

              {/* IMPROVEMENT SNAPSHOT */}
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16 }}
                className="rounded-2xl bg-slate-900/90 border border-cyan-900 p-6 shadow-lg flex-1 min-w-[230px] flex flex-col"
              >
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-teal-300" />
                  <span className="font-bold text-teal-100 text-base">Score Breakdown</span>
                </div>
                <div className="mt-2 space-y-5">
                  {breakdown.slice(0, 3).map((item, idx) => (
                    <div key={item.label} className="flex items-center gap-4">
                      <span className="rounded-lg p-2 bg-teal-900/70 border border-teal-700 shadow-sm">{item.icon}</span>
                      <div className="flex flex-col">
                        <span className="text-[16px] font-semibold text-cyan-100 flex gap-1">
                          {item.label}
                          <span className="text-xs bg-cyan-900/60 rounded px-2 py-0.5 ml-2 font-bold text-cyan-200">{item.label}</span>
                        </span>
                        <div className="flex items-center gap-2 font-mono text-base">
                          <motion.span
                            initial={{ scale: 0.7 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 330, damping: 17, delay: 0.01 + 0.06*idx }}
                            className="font-extrabold text-cyan-300 drop-shadow"
                          >
                            {item.value}
                          </motion.span>
                          <span className="text-slate-500 text-xs">/ 100</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* AI INSIGHT PANEL */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 bg-gradient-to-tr from-cyan-950/70 via-indigo-950/80 to-blue-950/60 border border-cyan-900/50 rounded-2xl shadow-lg py-6 px-6 flex gap-4 items-start"
            >
              <Sparkles className="w-8 h-8 flex-shrink-0 text-cyan-400 mr-3 mt-[2px] animate-pulse" strokeWidth={2.1} />
              <div>
                <div className="font-bold text-white mb-1 text-lg flex items-center gap-2">
                  <span>AI Insight</span>
                </div>
                <div className="text-base text-cyan-100/90 font-medium leading-relaxed">
                  {weakest
                    ? <>Your weakest area is <span className="text-indigo-200 font-semibold">{weakest.label}</span> ({weakest.value}/100). Focus on improving it to boost your overall readiness score.</>
                    : "Keep building your scores to unlock personalised insights!"}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </motion.section>
      {/* Extra Styles */}
      <style>{`
        .recharts-tooltip-label { font-weight: bold; color: #67e8f9; }
        .recharts-tooltip-item-list { color: #fff; }
        @media (max-width: 800px) {
          .max-w-5xl { max-width: 99vw !important; }
          .md\\:flex-row { flex-direction: column !important; }
          .lg\\:flex-row { flex-direction: column !important; }
        }
        @media (max-width: 600px) {
          .max-w-5xl { max-width: 100vw !important; }
        }
      `}</style>
    </main>
  );
}

export default Progress
