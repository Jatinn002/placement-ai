import { useEffect, useState } from 'react'
import {
  Bot,
  ChartColumn,
  LayoutDashboard,
  Menu,
  PanelLeftClose,
  Sparkles,
  Target,
  X,
} from 'lucide-react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'

const navigationItems = [
  { label: 'Dashboard', to: '/student/dashboard', icon: LayoutDashboard },
  { label: 'Roadmap', to: '/student/roadmap', icon: Target },
  { label: 'Tasks', to: '/student/tasks', icon: PanelLeftClose },
  { label: 'AI Coach', to: '/student/ai-chat', icon: Bot },
  { label: 'Progress', to: '/student/progress', icon: ChartColumn },
  { label: 'Growth Board', to: '/student/growth-board', icon: Sparkles },
]

const pageTitles = {
  '/student/dashboard': 'Dashboard',
  '/student/roadmap': 'Roadmap',
  '/student/tasks': 'Tasks',
  '/student/ai-chat': 'AI Coach',
  '/student/progress': 'Progress',
  '/student/growth-board': 'Growth Board',
  '/student/profile': 'Profile Setup',
  '/student/resume': 'Resume Upload',
  '/student/analysis': 'Analysis Result',
}

function StudentLayout({ children }) {
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    setIsSidebarOpen(false)
  }, [location.pathname])

  const pageTitle = pageTitles[location.pathname] ?? 'Student Portal'

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100">
      <div
        className={`fixed inset-0 z-30 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isSidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-800 bg-slate-950/95 px-5 py-6 shadow-2xl shadow-slate-950/50 transition-transform duration-300 lg:static lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Student Workspace</p>
            <h1 className="mt-2 text-xl font-semibold text-white">PlaceMentor AI</h1>
          </div>

          <button
            type="button"
            className="rounded-xl border border-slate-800 p-2 text-slate-400 transition hover:border-slate-700 hover:text-white lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-10 flex flex-1 flex-col gap-2">
          {navigationItems.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-slate-800 text-white shadow-lg shadow-slate-900/40'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`h-5 w-5 transition ${
                      isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Focus</p>
          <p className="mt-2 text-sm text-slate-300">Stay consistent with your roadmap and daily tasks.</p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col lg:ml-0">
        <header className="border-b border-slate-800 bg-slate-950/90 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 rounded-3xl border border-slate-800 bg-slate-900/70 px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="rounded-xl border border-slate-800 p-2 text-slate-300 transition hover:border-slate-700 hover:text-white lg:hidden"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>

              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Overview</p>
                <h2 className="text-xl font-semibold text-white sm:text-2xl">{pageTitle}</h2>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-2 text-right">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">User</p>
              <p className="text-sm font-medium text-slate-100">Jatin</p>
            </div>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="h-full rounded-[28px] border border-slate-800 bg-slate-900/60 p-4 shadow-xl shadow-slate-950/30 sm:p-6">
            {children ?? <Outlet />}
          </div>
        </main>
      </div>
    </div>
  )
}

export default StudentLayout
