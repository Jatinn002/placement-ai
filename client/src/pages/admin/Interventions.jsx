import { useState, useEffect } from "react";
import api from "../../services/api";
import {
  Brain,
  BookOpenCheck,
  UserCircle,
  FileText,
  BatteryWarning,
  Sparkles,
  Users,
  ClipboardCheck,
  UserCheck,
  User,
  ChevronRight,
  GraduationCap,
  BarChartBig,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";

// Static suggestion cards (action plans for admin)
const aiSuggestions = [
  {
    title: "DSA Bootcamp",
    desc: "Organize a 2-week DSA bootcamp for students with low problem-solving scores.",
    icon: <GraduationCap className="w-7 h-7 text-cyan-300" strokeWidth={2} />,
    color: "bg-gradient-to-tr from-cyan-900/60 to-cyan-900/30 border-cyan-700/40 shadow-cyan-900/25"
  },
  {
    title: "Resume Workshop",
    desc: "Conduct a resume building session to improve ATS scores.",
    icon: <ClipboardCheck className="w-7 h-7 text-fuchsia-300" strokeWidth={2} />,
    color: "bg-gradient-to-tr from-fuchsia-900/60 to-fuchsia-900/40 border-fuchsia-800/30 shadow-fuchsia-900/30"
  },
  {
    title: "Mock Interview Drive",
    desc: "Schedule mock interviews for students below 60% readiness.",
    icon: <UserCheck className="w-7 h-7 text-indigo-300" strokeWidth={2} />,
    color: "bg-gradient-to-tr from-indigo-900/60 to-blue-900/30 border-indigo-800/30 shadow-indigo-900/25"
  },
];

function Interventions() {
  const [applied, setApplied] = useState([false, false, false]);
  const [insight, setInsight] = useState("");
  const [atRiskStudents, setAtRiskStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [insightRes, atRiskRes] = await Promise.all([
          api.get("/api/admin/insights"),
          api.get("/api/admin/at-risk"),
        ]);
        setInsight(insightRes.data?.insight || "");
        setAtRiskStudents(atRiskRes.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load intervention data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Build summary cards from at-risk data
  const dsaCount = atRiskStudents.filter((s) => s.weakArea === "DSA").length;
  const resumeCount = atRiskStudents.filter((s) => s.weakArea === "Resume").length;
  const othersCount = atRiskStudents.length - dsaCount - resumeCount;

  const summaryCards = [
    {
      label: "DSA Help Needed",
      value: dsaCount,
      icon: <BookOpenCheck className="w-7 h-7 text-cyan-300" strokeWidth={2} />,
      color: "from-cyan-900/60 to-cyan-800/70",
      border: "border-cyan-800/60",
      shadow: "shadow-cyan-900/30"
    },
    {
      label: "Resume Improvement",
      value: resumeCount,
      icon: <FileText className="w-7 h-7 text-fuchsia-300" strokeWidth={2} />,
      color: "from-fuchsia-900/60 to-fuchsia-800/80",
      border: "border-fuchsia-800/60",
      shadow: "shadow-fuchsia-900/30"
    },
    {
      label: "Other Weaknesses",
      value: othersCount,
      icon: <BatteryWarning className="w-7 h-7 text-amber-300" strokeWidth={2} />,
      color: "from-amber-900/60 to-yellow-900/70",
      border: "border-amber-800/60",
      shadow: "shadow-yellow-900/40"
    },
  ];

  // Build targeted students list from at-risk data (top 5)
  const targetList = atRiskStudents.slice(0, 5).map((s) => ({
    name: s.name,
    note: `Weak: ${s.weakArea}`,
    icon: <User className="w-4 h-4 text-cyan-300" />,
  }));

  if (loading) {
    return (
      <main className="min-h-screen w-full flex items-center justify-center bg-slate-950">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full font-sans bg-gradient-to-tr from-indigo-950 via-slate-950/90 to-[#161a29] px-3 py-8 flex flex-col items-center relative">
      {/* HEADER */}
      <div className="w-full max-w-6xl mb-9 px-4 pt-2">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center gap-2 tracking-tight drop-shadow">
              <Brain className="w-8 h-8 text-cyan-400 mr-2 animate-pulse" strokeWidth={2.1} />
              Intervention Panel
            </h1>
            <p className="text-cyan-100/90 font-medium text-lg mt-1">
              AI-driven actions to improve student placement readiness
            </p>
          </div>
          <div className="flex gap-2 mt-3 md:mt-0">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-cyan-900/60 text-cyan-200 font-medium text-xs shadow border border-cyan-700/40">
              <BarChartBig className="w-4 h-4 mr-1" />
              Premium AI Dashboard
            </span>
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

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl mb-8 px-4">
        {summaryCards.map((card, idx) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 210, damping: 19, delay: idx * 0.05 }}
            className={
              `group relative bg-gradient-to-br ${card.color} ${card.border} ${card.shadow} rounded-2xl border shadow-xl px-7 py-7 flex flex-col gap-2 items-start focus:outline-cyan-500 hover:scale-[1.031] transition`
            }
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-black/35 shadow group-hover:scale-110 transition">{card.icon}</div>
            <div className="text-3xl font-extrabold text-white drop-shadow">{card.value}</div>
            <div className="font-medium text-slate-200/85">{card.label}</div>
          </motion.div>
        ))}
      </div>

      {/* SECTION: MAIN PANELS */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-7 px-4 mb-8">
        {/* AI SUGGESTIONS + AI INSIGHT */}
        <div className="flex flex-col gap-7 col-span-2">
          {/* AI SUGGESTION CARDS */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" strokeWidth={2} />
              <span className="font-semibold text-white text-lg">AI Suggestions</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {aiSuggestions.map((s, idx) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 180, damping: 17, delay: idx * 0.08 }}
                  className={`rounded-2xl p-5 border ${s.color} flex flex-col justify-between min-h-[196px] shadow-lg hover:shadow-cyan-900/30 group transition`}
                >
                  <div className="flex gap-2 items-center mb-3">
                    {s.icon}
                    <span className="font-bold text-white text-lg drop-shadow">{s.title}</span>
                  </div>
                  <div className="text-slate-200/90 font-medium text-base leading-normal mb-4">{s.desc}</div>
                  <button
                    className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-800 hover:bg-cyan-700 text-cyan-100 font-semibold text-xs shadow transition border border-cyan-500/30 ${
                      applied[idx] ? "opacity-70 pointer-events-none" : ""
                    }`}
                    disabled={applied[idx]}
                    onClick={() =>
                      setApplied((prev) =>
                        prev.map((ap, i) => (i === idx ? true : ap))
                      )
                    }
                  >
                    {applied[idx] ? (
                      <>
                        <ClipboardCheck className="w-4 h-4" /> Applied
                      </>
                    ) : (
                      <>
                        <ChevronRight className="w-4 h-4" /> Apply Plan
                      </>
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
          {/* AI INSIGHT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-tr from-cyan-950/70 via-indigo-950/80 to-blue-950/60 border border-cyan-900/50 rounded-2xl shadow-lg py-5 px-6 flex gap-4 items-start mt-4"
          >
            <Sparkles className="w-7 h-7 flex-shrink-0 text-cyan-400 mr-3 mt-[2px] animate-pulse" strokeWidth={2} />
            <div>
              <div className="font-bold text-white mb-1 text-lg flex items-center gap-2">
                <span>AI Insight</span>
              </div>
              <div className="text-base text-cyan-100/90 font-medium leading-relaxed">
                {insight || "No insights available yet. Students need to complete tasks and update their progress."}
              </div>
            </div>
          </motion.div>
        </div>
        {/* STUDENT TARGET LIST */}
        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl border border-slate-800 bg-gradient-to-tr from-slate-900/80 via-indigo-950/90 to-slate-800/80 shadow-lg p-6 flex flex-col gap-4 min-h-[268px]"
        >
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-6 h-6 text-cyan-300" strokeWidth={2} />
            <span className="font-semibold text-slate-100 text-lg">Targeted Students</span>
          </div>
          {targetList.length === 0 ? (
            <p className="text-slate-500 text-sm">No at-risk students to target.</p>
          ) : (
            <ul className="flex flex-col gap-3 mt-2">
              {targetList.map((student) => (
                <li
                  key={student.name}
                  className="flex items-center gap-3 text-base font-medium text-slate-100 tracking-tight group"
                >
                {student.icon}
                <span className="font-bold">{student.name}</span>
                <span className="ml-2 rounded-md px-2 py-0.5 text-xs font-semibold bg-slate-800/70 text-cyan-200 border border-slate-700/50 shadow">
                  {student.note}
                </span>
              </li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 900px) {
          .max-w-6xl { max-width: 99vw !important; }
        }
        @media (max-width: 700px) {
          .max-w-6xl { max-width: 100vw !important; }
          .sm\\:grid-cols-2 { grid-template-columns: 1fr !important; }
          .md\\:grid-cols-3 { grid-template-columns: 1fr !important; }
          .lg\\:grid-cols-3 { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 520px) {
          .max-w-6xl { max-width: 100vw !important; }
          .rounded-2xl { border-radius: 1rem !important; }
        }
      `}</style>
    </main>
  );
}

export default Interventions
