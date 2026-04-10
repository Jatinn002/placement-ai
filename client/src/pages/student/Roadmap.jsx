import React, { useState, useEffect } from "react";
import api from "../../services/api";
import {
  Sparkles,
  CalendarDays,
  CheckCircle2,
  Clock,
  ArrowDownCircle,
  Hourglass,
  Star,
  FileText,
  ListChecks,
  BookMarked,
  RefreshCcw,
  ShieldCheck,
  BadgeCheck,
  ClipboardCheck,
  ChevronRight,
  Rocket,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Map task labels to icons for visual richness
const TASK_ICONS = {
  "Resume Improvement": <FileText className="w-5 h-5 mr-2 text-cyan-300" />,
  "Basic DSA (Arrays)": <ListChecks className="w-5 h-5 mr-2 text-indigo-300" />,
  "Linked List": <BookMarked className="w-5 h-5 mr-2 text-blue-300" />,
  "Aptitude Practice": <ShieldCheck className="w-5 h-5 mr-2 text-cyan-400" />,
  "Medium DSA": <ClipboardCheck className="w-5 h-5 mr-2 text-indigo-200" />,
  "Mock Interview": <BadgeCheck className="w-5 h-5 mr-2 text-blue-200" />,
  "Revision": <RefreshCcw className="w-5 h-5 mr-2 text-cyan-200" />,
  "Final Interview Prep": <Rocket className="w-5 h-5 mr-2 text-fuchsia-300" />,
};

function getTaskIcon(label) {
  return TASK_ICONS[label] || <ListChecks className="w-5 h-5 mr-2 text-slate-300" />;
}

// Badge for each status, modern style
const getStatusBadge = (status) => {
  if (status === "completed") {
    return (
      <span className="flex items-center gap-1 px-3 py-1 bg-green-100/10 text-green-200 rounded-full text-xs font-bold backdrop-blur-md border border-green-400/20 shadow">
        <CheckCircle2 className="w-4 h-4" /> Completed
      </span>
    );
  }
  if (status === "in-progress" || status === "inprogress") {
    return (
      <span className="flex items-center gap-1 px-3 py-1 bg-cyan-200/10 text-cyan-200 rounded-full text-xs font-bold animate-pulse backdrop-blur-md border border-cyan-400/20 shadow">
        <Hourglass className="w-4 h-4 animate-spin-slow" /> In Progress
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 px-3 py-1 bg-slate-100/7 text-slate-200 rounded-full text-xs font-bold backdrop-blur-md border border-slate-400/10 shadow">
      <Clock className="w-4 h-4" /> Upcoming
    </span>
  );
};

// Creative gradient for each week for visual variety
const weekGradients = [
  "from-[#21233d] via-[#233b72] to-[#4edfd6]",
  "from-[#1b263b] via-[#166d8c] to-[#05d9e8]",
  "from-[#22223b] via-[#6a4c93] to-[#43e97b]",
  "from-[#172a45] via-[#1fa2ff] to-[#12d8fa]",
];

function getStatusCategory(status) {
  if (status === "completed") return "completed";
  if (status === "in-progress" || status === "inprogress") return "inprogress";
  return "upcoming";
}

const iconForStatus = {
  completed: <CheckCircle2 className="w-7 h-7 text-green-300 drop-shadow" />,
  inprogress: <Star className="w-7 h-7 text-cyan-300 animate-pulse drop-shadow" />,
  upcoming: <ArrowDownCircle className="w-7 h-7 text-slate-300 drop-shadow" />,
};

const roadmapVariants = {
  hidden: { opacity: 0, y: 36 },
  visible: i => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.10 + i * 0.14, type: "spring", stiffness: 90, damping: 16 },
  }),
};

function Roadmap() {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  // On mount, try to fetch an existing roadmap
  useEffect(() => {
    async function fetchRoadmap() {
      try {
        const { data } = await api.get("/api/roadmap");
        setRoadmap(data.roadmap);
      } catch (err) {
        // 404 = no roadmap yet, that's fine
        if (err.response?.status !== 404) {
          setError(err.response?.data?.message || "Failed to load roadmap");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchRoadmap();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    setError("");
    try {
      const { data } = await api.post("/api/roadmap/generate");
      setRoadmap(data.roadmap);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate roadmap");
    } finally {
      setGenerating(false);
    }
  };

  const weeks = roadmap?.weeks || [];

  if (loading) {
    return (
      <main className="min-h-screen w-full flex items-center justify-center bg-slate-950">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-start bg-gradient-to-tr from-[#10192efa] via-slate-800/83 to-[#21233d] px-2 py-6 sm:py-10 relative">
      {/* Backdrop blurs and gradients for modern SaaS */}
      <span className="pointer-events-none absolute top-20 right-0 w-96 h-60 bg-gradient-to-tr from-cyan-400/20 via-fuchsia-700/20 to-blue-700/10 blur-3xl opacity-90 z-0 rounded-full"></span>
      <span className="pointer-events-none absolute left-[-80px] bottom-[-90px] w-[300px] h-64 bg-gradient-to-br from-indigo-600/30 via-violet-500/20 to-fuchsia-600/10 blur-2xl opacity-90 z-0 rotate-12" />
      {/* Header */}
      <header className="mt-3 mb-7 w-full max-w-2xl text-center relative z-10">
        <div className="flex items-center justify-center gap-4 mb-3">
          <Sparkles className="w-10 h-10 text-cyan-400 animate-pulse drop-shadow-md" strokeWidth={2.15} />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-slate-800">
            Your Placement Roadmap
          </h1>
        </div>
        <p className="text-slate-400/90 max-w-lg mx-auto text-lg font-semibold mb-2">
          A personalized plan powered by AI to help you <span className="text-cyan-300 font-bold">ace placements</span>
        </p>
      </header>

      {/* Error */}
      {error && (
        <div className="w-full max-w-2xl mb-4 rounded-lg border border-rose-500/40 bg-rose-950/50 px-3 py-2 text-sm text-rose-200 z-10">
          {error}
        </div>
      )}

      {/* Generate Button or Roadmap */}
      <section className="mt-3 w-full flex flex-col items-center z-10">
        {weeks.length === 0 ? (
          // Empty state
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center bg-gradient-to-br from-[#233b72] via-[#21233d]/95 to-blue-950/50 border border-[#6ee7b7]/10 rounded-3xl shadow-2xl py-12 px-2 sm:px-14 max-w-xl mx-auto"
          >
            <CalendarDays className="w-16 h-16 text-cyan-300 mb-5 drop-shadow-md" strokeWidth={2.05} />
            <p className="text-white text-2xl sm:text-3xl font-extrabold text-center mb-2 tracking-tight">
              Generate your personalized roadmap!
            </p>
            <p className="text-slate-300 text-center mb-8 font-medium">
              Kickstart your placement prep with a unique step-by-step timeline.<br />
              <span className="text-cyan-200/80 text-lg font-semibold"><span role="img" aria-label="rocket">🚀</span> Ready to unlock your plan?</span>
            </p>
            <motion.button
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-bold  
                bg-gradient-to-tr from-cyan-400 via-blue-600 to-indigo-700
                text-white text-lg shadow-xl border border-cyan-600/50 mb-1
                transition-all duration-150 hover:scale-105 hover:bg-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-300 active:scale-98 disabled:opacity-50"
              whileTap={{ scale: 0.97 }}
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Generating…</>
              ) : (
                <><Sparkles className="w-5 h-5" strokeWidth={2.2} /> Generate My Roadmap</>
              )}
            </motion.button>
          </motion.div>
        ) : (
          // Modern vertical timeline
          <AnimatePresence>
            <motion.section
              key="roadmap"
              initial={{ opacity: 0, y: 48 }}
              animate={{ opacity: 1, y: 0, transition: { type: "spring", stiffness: 140, damping: 18 } }}
              exit={{ opacity: 0, y: 32, transition: { duration: 0.22 } }}
              className="flex flex-col md:flex-row gap-0 w-full max-w-4xl px-1 sm:px-2 mt-1 relative"
            >
              {/* Timeline vertical line */}
              <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-12 bottom-4 w-[3.5px] bg-gradient-to-b from-cyan-400 via-indigo-500/60 to-slate-700/40 rounded-full z-0 pointer-events-none" />
              {/* Timeline points/cards */}
              <div className="flex flex-col md:flex-row md:items-stretch w-full z-10">
                {weeks.map((w, idx) => {
                  const statusCat = getStatusCategory(w.status);
                  const isCurrent = statusCat === "inprogress";
                  return (
                    <motion.div
                      key={idx}
                      className="flex-1 flex flex-row md:flex-col items-center md:items-stretch group"
                      variants={roadmapVariants}
                      custom={idx}
                      initial="hidden"
                      animate="visible"
                      transition={{ type: "spring" }}
                    >
                      {/* connector line for horizontal mobile timeline */}
                      {idx > 0 &&
                        <div className="block md:hidden mx-1 w-8 h-1 rounded-full bg-gradient-to-r from-cyan-300 via-indigo-400 to-slate-700/50 opacity-70" />
                      }
                      {/* Timeline dot & week marker */}
                      <div className={`flex md:flex-col items-center md:items-center text-center z-20`}>
                        <div className={
                          `
                            relative shadow-xl 
                            bg-gradient-to-br ${weekGradients[idx % weekGradients.length]} 
                            border-4 
                            ${isCurrent ? 'border-cyan-300/90 scale-110 ring-4 ring-cyan-400/30' : 'border-slate-800/70'}
                            md:w-20 md:h-20 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200
                          `
                        }>
                          {iconForStatus[statusCat]}
                          {isCurrent && (
                            <motion.span
                              className="absolute -top-2 -right-2 flex items-center justify-center bg-white/80 rounded-full p-1.5 shadow-lg"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.15, type: "spring", stiffness: 180, damping: 14 }}
                            >
                              <Star className="w-5 h-5 text-cyan-400 animate-ping" />
                            </motion.span>
                          )}
                        </div>
                        <div className={`mt-2 text-sm md:text-base font-semibold ${isCurrent ? "text-cyan-300" : "text-slate-200/90"}`}>{w.title}</div>
                        <div className="mt-1">{getStatusBadge(w.status)}</div>
                      </div>
                      {/* Modern task card */}
                      <div className={
                        `
                        mt-7 md:mt-7 md:mb-0 ml-3 md:ml-0 md:w-56 w-auto
                        bg-gradient-to-br ${isCurrent ? "from-cyan-950/90 via-indigo-900/95 to-blue-950/90" : "from-slate-900/85 via-slate-800/95 to-slate-900/90"}
                        border ${isCurrent ? "border-cyan-500/40" : "border-slate-800/90"}
                        shadow-2xl rounded-2xl
                        px-6 py-5
                        ${isCurrent ? "scale-105 ring-2 ring-cyan-400/70" : ""}
                        transition-all duration-200
                        flex flex-col justify-center
                        hover:shadow-2xl hover:scale-101
                        `
                      }>
                        <h3 className={`text-lg font-extrabold mb-2 tracking-tight ${isCurrent ? "text-cyan-200" : statusCat === "completed" ? "text-green-200" : "text-indigo-100"}`}>
                          {isCurrent ? "This Week" : w.title}
                        </h3>
                        <ul className="flex flex-col gap-3">
                          {(w.tasks || []).map((taskLabel, ti) => (
                            <li key={ti} className={`flex items-center text-base font-semibold group-hover:translate-x-1 transition-all ${statusCat === "completed" ? "text-green-100" : isCurrent ? "text-cyan-100" : "text-slate-200"}`}>
                              {getTaskIcon(taskLabel)}
                              <span>{taskLabel}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>
          </AnimatePresence>
        )}
      </section>
      <style>{`
        @media (max-width: 700px) {
          .max-w-2xl, .max-w-4xl { max-width: 98vw !important; }
          .py-12 { padding-top: 2.5rem !important; padding-bottom: 2.5rem !important; }
          .px-14 { padding-left: 1.2rem !important; padding-right: 1.2rem !important; }
        }
        @media (max-width: 1100px) {
          .md\\:w-56 { width: 85vw !important; max-width: 360px; }
        }
        @media (max-width: 800px) {
          .md\\:flex-col { flex-direction: row !important; }
          .md\\:items-stretch { align-items: flex-start !important; }
          .md\\:mb-0 { margin-bottom: 0 !important; }
          .md\\:ml-0 { margin-left: 0 !important; }
          .md\\:mt-7 { margin-top: 1.7rem !important; }
          .md\\:w-20 { width: 62px !important; height: 62px !important; }
        }
        .animate-spin-slow { animation: spin 2.7s linear infinite; }
        @keyframes spin {
          100% { transform: rotate(360deg);}
        }
      `}</style>
    </main>
  );
}

export default Roadmap
