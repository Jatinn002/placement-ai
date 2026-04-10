import React, { useState, useEffect, useMemo } from "react";
import api from "../../services/api";
import {
  AlertTriangle,
  BadgeAlert,
  CheckCircle2,
  User,
  FileWarning,
  BarChart3,
  Search,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";

// risk colors & badges
const riskBadge = {
  High:
    "bg-rose-900/60 text-rose-200 border border-rose-500/40 shadow-rose-900/20",
  Medium:
    "bg-amber-900/60 text-amber-200 border border-amber-400/40 shadow-yellow-900/20",
  Low:
    "bg-green-900/60 text-green-200 border border-green-400/40 shadow-green-900/20",
};
const riskRow = {
  High: "bg-rose-900/20",
  Medium: "bg-yellow-900/10",
  Low: "",
};

function riskIcon(risk) {
  if (risk === "High")
    return <AlertTriangle className="w-4 h-4 mr-1 -ml-0.5 text-rose-300" />;
  if (risk === "Medium")
    return <BadgeAlert className="w-4 h-4 mr-1 -ml-0.5 text-amber-300" />;
  return <CheckCircle2 className="w-4 h-4 mr-1 -ml-0.5 text-green-300" />;
}

function getRiskLevel(score) {
  if (score < 40) return "High";
  if (score < 50) return "Medium";
  return "Low";
}

function formatLastActive(dateStr) {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
}

const filterVals = ["All", "High", "Medium", "Low"];

// --- Main ---
function AtRiskStudents() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [studentsRaw, setStudentsRaw] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAtRisk() {
      try {
        const { data } = await api.get("/api/admin/at-risk");
        setStudentsRaw(data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load at-risk students");
      } finally {
        setLoading(false);
      }
    }
    fetchAtRisk();
  }, []);

  // Enrich with risk level
  const enriched = useMemo(
    () =>
      studentsRaw.map((s) => ({
        ...s,
        risk: getRiskLevel(s.readinessScore),
        lastActiveFormatted: formatLastActive(s.lastActive),
      })),
    [studentsRaw]
  );

  // Summary cards
  const summaryCards = useMemo(() => {
    const counts = { High: 0, Medium: 0, Low: 0 };
    enriched.forEach((s) => counts[s.risk]++);
    return [
      {
        label: "High Risk",
        value: counts.High,
        color: "from-rose-800 to-rose-700 shadow-rose-900/30",
        icon: <AlertTriangle className="w-7 h-7 text-rose-300" />,
      },
      {
        label: "Medium Risk",
        value: counts.Medium,
        color: "from-amber-800 to-yellow-700 shadow-yellow-900/30",
        icon: <BadgeAlert className="w-7 h-7 text-amber-300" />,
      },
      {
        label: "Low Risk",
        value: counts.Low,
        color: "from-green-800 to-emerald-700 shadow-green-800/30",
        icon: <CheckCircle2 className="w-7 h-7 text-green-300" />,
      },
    ];
  }, [enriched]);

  let students = enriched;
  if (filter !== "All")
    students = students.filter((s) => s.risk === filter);
  if (search.trim())
    students = students.filter((s) =>
      s.name.toLowerCase().includes(search.trim().toLowerCase())
    );

  if (loading) {
    return (
      <main className="min-h-screen w-full flex items-center justify-center bg-slate-950">
        <Loader2 className="w-8 h-8 text-rose-400 animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full font-sans bg-gradient-to-tr from-slate-950 via-slate-900/95 to-[#191e2d] px-4 py-10 flex flex-col items-center">
      {/* HEADER */}
      <div className="w-full max-w-5xl mb-7">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-2 tracking-tight drop-shadow">
              <FileWarning className="w-8 h-8 text-rose-400 mr-2" strokeWidth={2.1} />
              At-Risk Students
            </h1>
            <p className="text-rose-100/90 font-medium text-lg mt-1">
              Students who need immediate attention
            </p>
          </div>
          <div className="flex gap-2 mt-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-rose-900/60 text-rose-200 font-medium text-xs shadow border border-rose-700/40">
              <BarChart3 className="w-4 h-4 mr-1" /> Premium Dashboard
            </span>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="w-full max-w-5xl mb-4">
          <div className="rounded-lg border border-rose-500/40 bg-rose-950/50 px-3 py-2 text-sm text-rose-200">
            {error}
          </div>
        </div>
      )}

      {/* ALERT CARDS */}
      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-8">
        {summaryCards.map((card) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -3, scale: 1.04, boxShadow: "0 0 32px #f43f5e40" }}
            className={`group bg-gradient-to-tr ${card.color} rounded-2xl border border-slate-800 shadow-lg px-7 py-6 flex flex-col gap-2 items-start focus:outline-rose-500`}
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-black/40 shadow-md group-hover:scale-110 transition">
              {card.icon}
            </div>
            <div className="text-3xl font-extrabold text-white drop-shadow">{card.value}</div>
            <div className="font-medium text-slate-200/85">{card.label}</div>
          </motion.div>
        ))}
      </div>

      {/* FILTER + SEARCH */}
      <div className="w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between mb-3 gap-3 px-0">
        <div className="flex flex-wrap gap-2">
          {filterVals.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition
                ${f === filter
                  ? "bg-slate-800/90 border-rose-600 text-rose-300 shadow"
                  : "bg-slate-900/80 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-rose-200"}
              `}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-52">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search student…"
              className="pl-9 pr-3 py-1.5 rounded-md bg-slate-900 text-slate-200 border border-slate-700 focus:border-rose-500 focus:ring-rose-500 w-full text-sm transition shadow"
            />
            <Search className="absolute top-1.5 left-2 w-5 h-5 text-slate-500" />
          </div>
        </div>
      </div>

      {/* STUDENTS TABLE */}
      <div className="w-full max-w-5xl overflow-x-auto bg-gradient-to-tr from-slate-900/80 via-slate-900/40 to-rose-950/40 border border-slate-800 rounded-2xl shadow-lg">
        <table className="min-w-full divide-y divide-slate-800">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-slate-400 text-xs font-semibold uppercase">Name</th>
              <th className="px-4 py-3 text-left text-slate-400 text-xs font-semibold uppercase">Readiness Score</th>
              <th className="px-4 py-3 text-left text-slate-400 text-xs font-semibold uppercase">Risk Level</th>
              <th className="px-4 py-3 text-left text-slate-400 text-xs font-semibold uppercase">Weak Area</th>
              <th className="px-4 py-3 text-left text-slate-400 text-xs font-semibold uppercase">Last Active</th>
              <th className="px-4 py-3 text-left text-slate-400 text-xs font-semibold uppercase">Action</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400 text-lg">
                  {studentsRaw.length === 0
                    ? "No at-risk students found — great news! 🎉"
                    : "No students found for this filter."}
                </td>
              </tr>
            ) : (
              students.map((s, idx) => (
                <tr
                  key={s.email || idx}
                  className={`transition hover:bg-slate-800/70 ${
                    riskRow[s.risk]
                  } ${s.risk === "High" ? "ring-2 ring-rose-500/40" : ""}`}
                >
                  <td className="py-3 px-4 font-semibold text-slate-200 flex items-center gap-2">
                    <User className="w-4 h-4 mr-1 text-slate-400" />
                    {s.name}
                  </td>
                  <td className="py-3 px-4 text-cyan-300 font-bold">{s.readinessScore}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-semibold text-xs ${riskBadge[s.risk]}`}>
                      {riskIcon(s.risk)}
                      {s.risk}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-rose-200 font-medium">{s.weakArea}</td>
                  <td className="py-3 px-4 text-slate-400">{s.lastActiveFormatted}</td>
                  <td className="py-3 px-4">
                    <button
                      className="inline-flex items-center px-3 py-1 rounded-md bg-rose-700/80 hover:bg-rose-700 text-rose-50 text-xs font-semibold shadow border border-rose-900/30 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-0 transition"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* AI ALERT PANEL */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl bg-gradient-to-br from-rose-900/50 via-slate-950/70 to-[#220a15] border border-rose-900/50 rounded-2xl shadow-lg py-5 px-6 flex gap-4 items-start mt-8"
      >
        <AlertTriangle className="w-7 h-7 flex-shrink-0 text-rose-300 mr-3 mt-[2px] animate-pulse" strokeWidth={2} />
        <div>
          <div className="font-bold text-white mb-1 text-lg flex items-center gap-2">
            <span>AI Alert</span>
          </div>
          <div className="text-base text-rose-100/90 font-medium leading-relaxed">
            {studentsRaw.length > 0
              ? `${studentsRaw.length} student${studentsRaw.length === 1 ? " is" : "s are"} at risk. Students with low consistency and poor performance need targeted intervention.`
              : "All students are performing well. No at-risk alerts at this time."}
          </div>
        </div>
      </motion.div>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 900px) {
          .max-w-5xl { max-width: 99vw !important; }
        }
        @media (max-width: 700px) {
          .max-w-5xl { max-width: 100vw !important; }
          .sm\\:grid-cols-2 { grid-template-columns: 1fr !important; }
          .md\\:grid-cols-3 { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 500px) {
          .max-w-5xl { max-width: 100vw !important; }
          .rounded-2xl { border-radius: 1rem !important; }
          table, thead, tbody, th, td, tr { display: block !important; }
          th, td { padding: 0.7rem 1rem !important; }
        }
      `}</style>
    </main>
  );
}

export default AtRiskStudents;
