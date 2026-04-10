import React, { useRef, useState } from "react";
import api from "../../services/api";
import {
  FileUp,
  FileText,
  Upload,
  Sparkles,
  CheckCircle,
  AlertCircle,
  BadgeCheck,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const analysisDummy = {
  score: 68,
  strengths: [
    { text: "Good project experience", icon: <BadgeCheck className="text-green-400 w-5 h-5 mr-2" /> },
    { text: "Strong technical skills", icon: <BadgeCheck className="text-green-400 w-5 h-5 mr-2" /> }
  ],
  weaknesses: [
    { text: "Missing quantified achievements", icon: <AlertCircle className="text-yellow-400 w-5 h-5 mr-2" /> },
    { text: "Resume formatting can improve", icon: <AlertCircle className="text-yellow-400 w-5 h-5 mr-2" /> }
  ],
  suggestions: [
    "Add metrics to projects",
    "Improve summary section",
    "Use better keywords"
  ]
};

function classNames(...args) {
  return args.filter(Boolean).join(" ");
}

function ResumeUpload() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const fileInputRef = useRef();

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file && (file.type === "application/pdf" || file.name.endsWith('.docx'))) {
      setUploadedFile(file);
      setShowAnalysis(false);
      setUploadError(null);
      setUploadSuccess(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type === "application/pdf" || file.name.endsWith('.docx'))) {
      setUploadedFile(file);
      setShowAnalysis(false);
      setUploadError(null);
      setUploadSuccess(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const startAnalysis = async () => {
    if (!uploadedFile) return;
    setUploadError(null);
    setUploadSuccess(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("resume", uploadedFile);

      const { data } = await api.post("/api/resume/upload", formData);

      setUploadSuccess(data?.message || "Resume uploaded successfully.");
      setShowAnalysis(true);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Upload failed. Sign in and try again.";
      setUploadError(msg);
      setShowAnalysis(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-[#141827] px-2 py-10 w-full">
      <div className="w-full max-w-2xl">
        {/* HEADER CARD */}
        <motion.div
          initial={{ opacity: 0, y: -26 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/95 rounded-2xl p-7 md:p-8 mb-6 shadow-2xl border border-slate-800 flex flex-col items-center"
        >
          <div className="flex items-center gap-3 mb-1">
            <Sparkles className="w-6 h-6 text-cyan-400" strokeWidth={2.1} />
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Resume Analysis</h1>
          </div>
          <p className="text-slate-400 text-center text-base font-medium">
            Upload your resume to get <span className="text-cyan-400 font-semibold">AI-powered insights</span>
          </p>
        </motion.div>

        {/* UPLOAD CARD */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className={classNames(
            "relative bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 rounded-2xl p-7 md:p-8 shadow-xl border border-slate-800 mb-7 flex flex-col items-center",
            dragActive && "ring-2 ring-cyan-400/50"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx"
            className="hidden"
            onChange={handleFileSelect}
          />

          <div
            role="button"
            tabIndex={0}
            className={classNames(
              "w-full max-w-md flex flex-col items-center gap-2 p-8 rounded-xl border-2 border-dashed transition-all duration-200",
              dragActive ? "border-cyan-400 bg-cyan-950/10" : "border-slate-700 bg-slate-900/70 hover:bg-slate-900/80"
            )}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragLeave={handleDragLeave}
          >
            <div className="flex items-center justify-center mb-3">
              <FileUp className="w-11 h-11 text-cyan-400 drop-shadow-lg" strokeWidth={2.1} />
            </div>
            <div className="text-lg font-semibold text-slate-100 mb-1 tracking-wide">
              Drag & Drop your resume here
            </div>
            <div className="text-slate-400 text-sm mb-4">or</div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center px-5 py-2.5 font-semibold rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow hover:brightness-110 transition"
            >
              <Upload className="w-5 h-5 mr-2" strokeWidth={2.1} />
              Upload Resume
            </button>
            <div className="text-xs text-slate-500 mt-3">PDF or DOCX (max ~15MB)</div>
          </div>

          <div className="w-full mt-4 flex flex-col items-center">
            {uploadedFile ? (
              <div className="flex items-center mt-2 text-cyan-200 bg-slate-800/80 px-4 py-2 rounded-xl shadow border border-cyan-700 text-base font-medium">
                <FileText className="w-5 h-5 text-cyan-400 mr-2" strokeWidth={2.1} />
                {uploadedFile.name}
              </div>
            ) : (
              <div className="mt-5 text-slate-500 px-2 py-2 text-center text-sm flex items-center justify-center gap-2">
                <AlertCircle className="w-5 h-5 text-slate-400" strokeWidth={2.1} />
                Upload your resume to get insights
              </div>
            )}
          </div>
        </motion.div>

        {(uploadError || uploadSuccess) && (
          <div className="mb-4 w-full max-w-2xl mx-auto px-1">
            {uploadError && (
              <div className="rounded-xl border border-red-800/60 bg-red-950/40 px-4 py-3 text-sm text-red-200">
                {uploadError}
              </div>
            )}
            {uploadSuccess && !uploadError && (
              <div className="rounded-xl border border-green-800/60 bg-green-950/30 px-4 py-3 text-sm text-green-200">
                {uploadSuccess}
              </div>
            )}
          </div>
        )}

        {/* ANALYZE BUTTON */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-4"
        >
          <button
            type="button"
            disabled={!uploadedFile || loading}
            onClick={startAnalysis}
            className={classNames(
              "flex items-center px-7 py-3 rounded-xl font-bold text-white text-lg transition bg-gradient-to-tr from-cyan-500/90 to-indigo-700/90 shadow-lg border border-cyan-700/40",
              (!uploadedFile || loading) ? "opacity-50 cursor-not-allowed" : "hover:brightness-110 active:scale-97"
            )}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" strokeWidth={2.1} /> Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" strokeWidth={2.1} />
                Analyze Resume
              </>
            )}
          </button>
        </motion.div>

        {/* ANALYSIS RESULT SECTION */}
        <AnimatePresence>
          {showAnalysis && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 38, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 90, damping: 14 } }}
              exit={{ opacity: 0, y: 26, scale: 0.97, transition: { duration: 0.19 } }}
              transition={{ duration: 0.33 }}
              className="w-full"
            >
              <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-[#202337] rounded-2xl p-7 md:p-9 shadow-xl border border-slate-800 mb-7 mt-2">
                {/* SCORE */}
                <div className="flex flex-col items-center mb-7">
                  <div className="flex items-center gap-3 mb-1">
                    <Sparkles className="w-7 h-7 text-indigo-400" strokeWidth={2.1} />
                    <span className="uppercase text-xs text-cyan-400 tracking-wide font-semibold">Resume Score</span>
                  </div>
                  <div className="text-5xl font-extrabold text-cyan-300 tracking-tight drop-shadow-lg flex items-start">
                    <span>{analysisDummy.score}</span>
                    <span className="text-2xl text-slate-400 ml-1 mt-2">/100</span>
                  </div>
                  <div className="mt-2 text-base text-slate-300 font-medium">
                    Your placement readiness score
                  </div>
                </div>
                {/* STRENGTHS & WEAKNESSES */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2 mb-7">
                  <div className="bg-slate-900 rounded-xl p-5 border border-green-800 shadow flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-400" strokeWidth={2} />
                      <span className="text-green-300 font-semibold text-base">Strengths</span>
                    </div>
                    <ul className="pl-1">
                      {analysisDummy.strengths.map((item, i) => (
                        <li key={i} className="flex items-center text-slate-200 font-medium mb-2">
                          {item.icon}
                          {item.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-slate-900 rounded-xl p-5 border border-yellow-900 shadow flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-yellow-400" strokeWidth={2} />
                      <span className="text-yellow-300 font-semibold text-base">Weaknesses</span>
                    </div>
                    <ul className="pl-1">
                      {analysisDummy.weaknesses.map((item, i) => (
                        <li key={i} className="flex items-center text-slate-200 font-medium mb-2">
                          {item.icon}
                          {item.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {/* SUGGESTIONS */}
                <div className="bg-gradient-to-tr from-indigo-900/70 via-slate-900/95 to-cyan-900/80 rounded-xl p-5 border border-cyan-700 shadow flex flex-col mt-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" strokeWidth={2} />
                    <span className="text-cyan-300 font-semibold text-base">Improvement Suggestions</span>
                  </div>
                  <ul className="list-disc list-inside text-slate-100 text-base font-medium pl-2">
                    {analysisDummy.suggestions.map((suggestion, i) => (
                      <li key={i} className="mb-1">{suggestion}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <style>{`
        @media (max-width: 600px) {
          .max-w-2xl { max-width: 99vw !important; }
          .p-7, .p-8, .p-9 { padding: 1.2rem !important; }
        }
      `}</style>
    </main>
  );
}

export default ResumeUpload
