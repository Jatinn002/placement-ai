import React, { useState, useEffect, useMemo } from "react";
import api from "../../services/api";
import {
  Users,
  UserCheck,
  UserX,
  TrendingUp,
  BarChart3,
  FileWarning,
  FileText,
  BadgeAlert,
  Gauge,
  Sparkles,
  Filter,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

// --- Helpers ---
const statusColors = {
  "Ready": "bg-green-100/10 text-green-300 border-green-500/30",
  "Improving": "bg-yellow-100/10 text-amber-300 border-amber-400/30",
  "At Risk": "bg-rose-100/10 text-rose-300 border-rose-500/30",
};
const statusBadgeIcon = (v) => {
  if (v === "Ready") return <UserCheck className="w-4 h-4 mr-1" />;
  if (v === "At Risk") return <BadgeAlert className="w-4 h-4 mr-1" />;
  return <BarChart3 className="w-4 h-4 mr-1" />;
};

const chartBarColors = {
  "Ready": "#4ade80",
  "Improving": "#fbbf24",
  "At Risk": "#fb7185",
};

// --- Main Component ---
function AdminDashboard() {
  const [filter, setFilter] = useState("All");
  const [dashStats, setDashStats] = useState(null);
  const [studentsRaw, setStudentsRaw] = useState([]);
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [dashRes, studentsRes, insightRes] = await Promise.all([
          api.get("/api/admin/dashboard"),
          api.get("/api/admin/students"),
          api.get("/api/admin/insights"),
        ]);
        setDashStats(dashRes.data);
        setStudentsRaw(studentsRes.data || []);
        setInsight(insightRes.data?.insight || "");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load admin data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const stats = dashStats
    ? [
        {
          label: "Total Students",
          value: dashStats.totalStudents,
          icon: <Users className="w-6 h-6 text-cyan-300" />,
          bg: "from-cyan-900 to-cyan-800",
        },
        {
          label: "Active Students",
          value: dashStats.activeStudents,
          icon: <UserCheck className="w-6 h-6 text-green-300" />,
          bg: "from-green-900 to-green-800",
        },
        {
          label: "Placement Ready",
          value: dashStats.placementReady,
          icon: <TrendingUp className="w-6 h-6 text-indigo-300" />,
          bg: "from-indigo-900 to-indigo-800",
        },
        {
          label: "At Risk",
          value: dashStats.atRisk,
          icon: <FileWarning className="w-6 h-6 text-rose-300" />,
          bg: "from-rose-900 to-rose-800",
        },
        {
          label: "Avg Readiness Score",
          value: `${dashStats.avgReadiness}%`,
          icon: <Gauge className="w-6 h-6 text-fuchsia-300" />,
          bg: "from-fuchsia-900 to-fuchsia-800",
        },
      ]
    : [];

  // Build chart data from students
  const chartData = useMemo(() => {
    const counts = { Ready: 0, Improving: 0, "At Risk": 0 };
    studentsRaw.forEach((s) => {
      if (counts[s.status] !== undefined) counts[s.status]++;
    });
    return [
      { status: "Ready", value: counts.Ready },
      { status: "Improving", value: counts.Improving },
      { status: "At Risk", value: counts["At Risk"] },
    ];
  }, [studentsRaw]);

  const students =
    filter === "All"
      ? studentsRaw
      : studentsRaw.filter((s) => s.status === filter);

  if (loading) {
    return (
      <main className="min-h-screen w-full flex items-center justify-center bg-slate-950">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full font-sans bg-gradient-to-br from-slate-950 via-slate-900 to-[#181c29] px-2 py-8 flex flex-col items-center">
      {/* HEADER */}
      <div className="w-full max-w-6xl mb-7 px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-2 tracking-tight drop-shadow">
              <BarChart3 className="w-8 h-8 text-cyan-400 mr-2" strokeWidth={2.2} />
              Admin Dashboard
            </h1>
            <p className="text-cyan-100/90 font-medium text-lg mt-1">
              Placement readiness overview and insights
            </p>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="w-full max-w-6xl mb-4 px-4">
          <div className="rounded-lg border border-rose-500/40 bg-rose-950/50 px-3 py-2 text-sm text-rose-200">
            {error}
          </div>
        </div>
      )}

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 w-full max-w-6xl mb-6 px-4">
        {stats.map((stat) => (
          <motion.div
            whileHover={{ scale: 1.035, y: -2, boxShadow: "0 4px 28px #0ff3f944" }}
            transition={{ type: "spring", stiffness: 220, damping: 16 }}
            key={stat.label}
            className={`group relative bg-gradient-to-br ${stat.bg} rounded-2xl border border-slate-700/70 shadow-xl p-5 flex flex-col gap-2 items-start hover:shadow-cyan-800/40 transition focus:outline-cyan-500`}
          >
            <div className="flex items-center justify-center w-11 h-11 rounded-full bg-black/40 shadow-md group-hover:scale-110 transition">
              {stat.icon}
            </div>
            <div className="text-2xl font-extrabold text-white drop-shadow">{stat.value}</div>
            <div className="font-medium text-slate-200/90">{stat.label}</div>
          </motion.div>
        )
        )}
      </div>

      {/* ANALYTICS CHART & TABLE */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-5 gap-7 px-4 mb-6">
        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-1 md:col-span-2 rounded-2xl border border-slate-700 bg-gradient-to-tr from-slate-900/70 via-indigo-950/80 to-blue-900/60 shadow-xl p-6 flex flex-col"
        >
          <div className="font-bold text-cyan-200 mb-2 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" /> Readiness Distribution
          </div>
          <div className="flex-1 min-h-[220px] h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barCategoryGap={24}>
                <XAxis dataKey="status" axisLine={false} tick={{ fill: "#bae6fd", fontWeight: 500, fontSize: 14 }}/>
                <YAxis axisLine={false} tick={{ fill: "#cbd5e1", fontWeight: 400, fontSize: 13 }} />
                <Tooltip
                  contentStyle={{ background: "#111827", borderRadius: 10, border: "none", color: "#eef2ff" }}
                  labelStyle={{ color: "#67e8f9", fontWeight: 700 }}
                  itemStyle={{ color: "#fff", fontWeight: 500 }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={chartBarColors[entry.status]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-sm text-slate-300/80 mt-2">
            <span className="text-cyan-300 font-medium">{chartData[0]?.value || 0}</span> ready,{" "}
            <span className="text-amber-300 font-medium">{chartData[1]?.value || 0}</span> improving,{" "}
            <span className="text-rose-300 font-medium">{chartData[2]?.value || 0}</span> at risk.
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-1 md:col-span-3 rounded-2xl border border-slate-700 bg-gradient-to-tl from-slate-900/70 via-blue-900/80 to-indigo-900/60 shadow-xl p-6 flex flex-col"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="font-bold text-cyan-200 flex items-center gap-2">
              <Users className="w-5 h-5" /> Student Status
            </div>
            {/* Filter */}
            <div className="flex gap-2 items-center">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="bg-slate-800 text-cyan-100 text-xs rounded py-1 px-3 border border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-cyan-600/50 transition"
              >
                <option value="All">All</option>
                <option value="Ready">Ready</option>
                <option value="Improving">Improving</option>
                <option value="At Risk">At Risk</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto min-w-full">
            <table className="min-w-full text-left">
              <thead>
                <tr>
                  <th className="py-2 px-3 text-[13px] text-slate-400 font-bold">Name</th>
                  <th className="py-2 px-3 text-[13px] text-slate-400 font-bold">Readiness Score</th>
                  <th className="py-2 px-3 text-[13px] text-slate-400 font-bold">Status</th>
                  <th className="py-2 px-3 text-[13px] text-slate-400 font-bold">Weak Area</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-5 text-slate-500 text-center">
                      No students found for this filter.
                    </td>
                  </tr>
                ) : (
                  students.map((student, idx) => (
                    <tr
                      key={student.email || idx}
                      className={`
                        ${student.status === "At Risk" ? "bg-rose-800/15" : idx % 2 === 0 ? "bg-slate-800/20" : ""}
                        hover:bg-cyan-900/20 transition group
                      `}
                    >
                      <td className="py-2 px-3 font-bold text-slate-200 whitespace-nowrap">
                        {student.name}
                      </td>
                      <td className="py-2 px-3">
                        <span className={`
                          font-semibold ${student.readinessScore >= 65 ? "text-green-300"
                          : student.readinessScore >= 50 ? "text-amber-200"
                          : "text-rose-300"}
                        `}>{student.readinessScore}</span>
                      </td>
                      <td className="py-2 px-3">
                        <span
                          className={`
                            inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-semibold
                            ${statusColors[student.status] || ""} shadow-sm
                            ${student.status === "At Risk" ? "border-rose-400 text-rose-200" : ""}
                          `}
                        >
                          {statusBadgeIcon(student.status)}
                          {student.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-cyan-300">{student.weakArea}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* AI INSIGHT PANEL */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl bg-gradient-to-tr from-cyan-950/70 via-indigo-950/80 to-blue-950/60 border border-cyan-900/50 rounded-2xl shadow-lg py-5 px-6 flex gap-4 items-start mb-2 mt-2"
      >
        <Sparkles className="w-8 h-8 flex-shrink-0 text-cyan-400 mr-3 mt-[2px] animate-pulse" strokeWidth={2.1} />
        <div>
          <div className="font-bold text-white mb-1 text-lg flex items-center gap-2">
            <span>AI Insight</span>
          </div>
          <div className="text-base text-cyan-100/90 font-medium leading-relaxed">
            {insight || "No insights available yet. Students need to complete tasks and update their progress."}
          </div>
        </div>
      </motion.div>

      {/* Styles for table responsiveness */}
      <style>{`
        @media (max-width: 900px) {
          .max-w-6xl { max-width: 100vw !important; }
        }
        @media (max-width: 700px) {
          .max-w-6xl { max-width: 99vw !important; }
          .md\\:grid-cols-5 { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 500px) {
          .max-w-6xl { max-width: 100vw !important; }
          .rounded-2xl { border-radius: 1rem !important; }
        }
      `}</style>
    </main>
  );
}

export default AdminDashboard
