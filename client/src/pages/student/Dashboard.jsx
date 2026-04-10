import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  Brain,
  Building2,
  CalendarDays,
  FileText,
  Flame,
  ListTodo,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const summaryCards = [
  {
    title: 'Resume Score',
    value: '68/100',
    detail: 'Strong improvement this month',
    icon: FileText,
    accent: 'from-sky-500/20 to-blue-500/5',
  },
  {
    title: "Today's Task",
    value: 'Solve 3 Array Questions',
    detail: 'Estimated effort: 45 mins',
    icon: ListTodo,
    accent: 'from-violet-500/20 to-fuchsia-500/5',
  },
  {
    title: 'Weak Skill',
    value: 'DSA',
    detail: 'Focus area for this week',
    icon: Brain,
    accent: 'from-amber-500/20 to-orange-500/5',
  },
  {
    title: 'Streak',
    value: '5 Days',
    detail: 'Consistency is building momentum',
    icon: Flame,
    accent: 'from-rose-500/20 to-pink-500/5',
  },
]

const weeklyRoadmap = [
  {
    day: 'Monday',
    title: 'Resume Improvement',
    description: 'Refine project bullets and quantifiable achievements.',
  },
  {
    day: 'Tuesday',
    title: 'Arrays Practice',
    description: 'Solve core patterns for interviews and timed rounds.',
  },
  {
    day: 'Wednesday',
    title: 'Aptitude Quiz',
    description: 'Sharpen accuracy on speed, logic, and percentages.',
  },
  {
    day: 'Thursday',
    title: 'Mock Interview',
    description: 'Practice storytelling, clarity, and confidence.',
  },
]

const chartData = [
  { week: 'Week 1', readiness: 35 },
  { week: 'Week 2', readiness: 42 },
  { week: 'Week 3', readiness: 50 },
  { week: 'Week 4', readiness: 57 },
  { week: 'Week 5', readiness: 63 },
]

const growthSnapshot = [
  { label: 'Readiness', from: 42, to: 57, tone: 'text-cyan-300' },
  { label: 'Resume', from: 50, to: 68, tone: 'text-violet-300' },
  { label: 'DSA', from: 35, to: 52, tone: 'text-emerald-300' },
]

const suggestedCompanies = ['TCS', 'Infosys', 'Accenture', 'Capgemini']

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/95 px-4 py-3 shadow-2xl shadow-slate-950/40">
      <p className="text-sm font-medium text-slate-200">{label}</p>
      <p className="mt-1 text-sm text-cyan-300">Readiness: {payload[0].value}%</p>
    </div>
  )
}

function DashboardSkeleton() {
  // Basic skeleton content for quick visible feedback
  return (
    <div className="space-y-6 bg-slate-950 text-slate-100 animate-pulse">
      <div className="overflow-hidden rounded-[28px] border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 p-6 shadow-2xl shadow-slate-950/30 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
          <div className="space-y-4">
            <div className="h-6 w-56 rounded-full bg-cyan-900/30" />
            <div className="h-8 w-56 rounded bg-slate-800" />
            <div className="mt-2 h-4 w-64 rounded bg-slate-800" />
            <div className="h-10 w-36 rounded-2xl bg-slate-800 mt-4" />
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <div className="h-4 w-40 rounded bg-slate-800" />
            <div className="mt-3 h-10 w-24 rounded bg-slate-800" />
            <div className="mt-6 mb-2 h-3 w-24 rounded bg-slate-800" />
            <div className="h-3 w-full rounded-full bg-slate-800" />
          </div>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-[24px] border border-slate-800 bg-gradient-to-br from-slate-800/10 to-slate-900/10 p-5 shadow-lg shadow-slate-950/20"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="h-4 w-20 rounded bg-slate-800 mb-2" />
                <div className="h-6 w-16 rounded bg-slate-800 mb-2" />
                <div className="h-4 w-32 rounded bg-slate-800" />
              </div>
              <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-3">
                <div className="h-5 w-5 rounded-full bg-slate-800" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.05fr_1.35fr]">
        <div className="rounded-[28px] border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-violet-500/10 p-6 shadow-[0_0_0_1px_rgba(34,211,238,0.08),0_20px_70px_rgba(15,23,42,0.55)]">
          <div className="h-4 w-36 rounded bg-slate-800 mb-2" />
          <div className="h-7 w-48 rounded bg-slate-800" />
          <div className="mt-5 h-4 w-80 rounded bg-slate-800" />
          <div className="mt-6 h-10 w-32 rounded bg-cyan-900/10" />
        </div>
        <div className="rounded-[28px] border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/30">
          <div className="h-4 w-32 rounded bg-slate-800 mb-2" />
          <div className="h-7 w-56 rounded bg-slate-800" />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-cyan-400 via-blue-500 to-violet-500" />
                <div className="h-4 w-16 rounded bg-slate-800 mb-2" />
                <div className="h-5 w-32 rounded bg-slate-800" />
                <div className="h-4 w-24 rounded bg-slate-800 mt-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <div className="rounded-[28px] border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/30">
          <div className="h-4 w-32 rounded bg-slate-800 mb-2" />
          <div className="h-7 w-56 rounded bg-slate-800" />
          <div className="mt-6 h-72 w-full rounded bg-slate-800" />
        </div>
        <div className="grid gap-6">
          <div className="rounded-[28px] border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/30">
            <div className="h-4 w-36 rounded bg-slate-800 mb-2" />
            <div className="h-7 w-32 rounded bg-slate-800" />
            <div className="mt-6 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-3xl border border-slate-800 bg-slate-950/70 px-4 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="h-4 w-20 rounded bg-slate-800" />
                    <div className="h-5 w-12 rounded bg-slate-800" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[28px] border border-slate-800 bg-gradient-to-br from-violet-500/10 via-slate-900 to-blue-500/10 p-6 shadow-xl shadow-slate-950/30">
            <div className="h-4 w-36 rounded bg-slate-800 mb-2" />
            <div className="h-7 w-40 rounded bg-slate-800" />
            <div className="mt-6 flex flex-wrap gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <span
                  key={i}
                  className="rounded-full border border-slate-700 bg-slate-950/70 px-4 py-2 text-sm"
                >
                  <span className="inline-block h-4 w-12 rounded bg-slate-800"></span>
                </span>
              ))}
            </div>
            <div className="mt-5 h-4 w-80 rounded bg-slate-800" />
          </div>
        </div>
      </div>
    </div>
  )
}

function Dashboard() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(t)
  }, [])

  return (
    <AnimatePresence>
      {loading ? (
        <motion.div
          key="dashboard-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen flex items-center justify-center bg-slate-950"
        >
          {/* Prefer skeleton, fallback to basic 'Loading...' */}
          <DashboardSkeleton />
        </motion.div>
      ) : (
        <motion.div
          key="dashboard-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-6 bg-slate-950 text-slate-100">
            <motion.section
              className="overflow-hidden rounded-[28px] border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 p-6 shadow-2xl shadow-slate-950/30 sm:p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
                    <Sparkles className="h-4 w-4" />
                    AI-powered placement guidance
                  </div>

                  <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                      Welcome back, Jatin 👋
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                      Your AI placement mentor has prepared your next steps
                    </p>
                  </div>

                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02] hover:bg-slate-100"
                  >
                    Next Best Action
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-300">Placement Readiness Score</p>
                      <p className="mt-3 text-5xl font-semibold text-white">57%</p>
                    </div>
                    <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-300">
                      <Target className="h-6 w-6" />
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.22em] text-slate-400">
                      <span>Progress</span>
                      <span>Goal: 75%</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-800">
                      <div className="h-3 w-[57%] rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {summaryCards.map(({ title, value, detail, icon: Icon, accent }, index) => (
                <motion.div
                  key={title}
                  className={`rounded-[24px] border border-slate-800 bg-gradient-to-br ${accent} p-5 shadow-lg shadow-slate-950/20`}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * index, duration: 0.35 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-slate-300">{title}</p>
                      <h2 className="text-xl font-semibold text-white">{value}</h2>
                      <p className="text-sm text-slate-400">{detail}</p>
                    </div>

                    <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-3 text-slate-100">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.05fr_1.35fr]">
              <motion.div
                className="rounded-[28px] border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-violet-500/10 p-6 shadow-[0_0_0_1px_rgba(34,211,238,0.08),0_20px_70px_rgba(15,23,42,0.55)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">AI Insight</p>
                    <h3 className="mt-3 text-2xl font-semibold text-white">Your biggest blockers this week</h3>
                  </div>
                  <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-300">
                    <Sparkles className="h-6 w-6" />
                  </div>
                </div>

                <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300">
                  Your resume and DSA performance are your biggest blockers this week.
                </p>

                <button
                  type="button"
                  className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300/40 hover:bg-cyan-400/15"
                >
                  View Full Plan
                  <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>

              <motion.div
                className="rounded-[28px] border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Weekly Roadmap</p>
                    <h3 className="mt-2 text-2xl font-semibold text-white">Your focused action plan</h3>
                  </div>
                  <CalendarDays className="h-6 w-6 text-violet-300" />
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {weeklyRoadmap.map((item, index) => (
                    <motion.div
                      key={item.day}
                      className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/80 p-5"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 * index + 0.25, duration: 0.35 }}
                      whileHover={{ y: -3 }}
                    >
                      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-cyan-400 via-blue-500 to-violet-500" />
                      <p className="pl-4 text-xs uppercase tracking-[0.24em] text-slate-500">{item.day}</p>
                      <h4 className="mt-3 pl-4 text-lg font-semibold text-white">{item.title}</h4>
                      <p className="mt-2 pl-4 text-sm leading-6 text-slate-400">{item.description}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
              <motion.div
                className="rounded-[28px] border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.4 }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Progress Chart</p>
                    <h3 className="mt-2 text-2xl font-semibold text-white">Readiness growth over time</h3>
                  </div>
                  <TrendingUp className="h-6 w-6 text-cyan-300" />
                </div>

                <div className="mt-6 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="readinessFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.45} />
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="week"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        domain={[30, 70]}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#334155', strokeWidth: 1 }} />
                      <Area
                        type="monotone"
                        dataKey="readiness"
                        stroke="#38bdf8"
                        strokeWidth={3}
                        fill="url(#readinessFill)"
                        activeDot={{ r: 6, fill: '#ffffff', stroke: '#38bdf8', strokeWidth: 3 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <div className="grid gap-6">
                <motion.div
                  className="rounded-[28px] border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/30"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Growth Snapshot</p>
                      <h3 className="mt-2 text-2xl font-semibold text-white">Momentum this month</h3>
                    </div>
                    <Target className="h-6 w-6 text-emerald-300" />
                  </div>

                  <div className="mt-6 space-y-4">
                    {growthSnapshot.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-3xl border border-slate-800 bg-slate-950/70 px-4 py-4"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <p className="text-sm text-slate-300">{item.label}</p>
                          <p className={`text-base font-semibold ${item.tone}`}>
                            {item.from} → {item.to}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  className="rounded-[28px] border border-slate-800 bg-gradient-to-br from-violet-500/10 via-slate-900 to-blue-500/10 p-6 shadow-xl shadow-slate-950/30"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.4 }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Suggested Companies</p>
                      <h3 className="mt-2 text-2xl font-semibold text-white">Best fit right now</h3>
                    </div>
                    <Building2 className="h-6 w-6 text-violet-300" />
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {suggestedCompanies.map((company) => (
                      <span
                        key={company}
                        className="rounded-full border border-slate-700 bg-slate-950/70 px-4 py-2 text-sm text-slate-200"
                      >
                        {company}
                      </span>
                    ))}
                  </div>

                  <p className="mt-5 text-sm leading-7 text-slate-400">
                    These companies match your current readiness and can become strong short-term targets.
                  </p>
                </motion.div>
              </div>
            </section>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Dashboard
