import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AdminDashboard from './pages/admin/AdminDashboard'
import Analytics from './pages/admin/Analytics'
import AtRiskStudents from './pages/admin/AtRiskStudents'
import Interventions from './pages/admin/Interventions'
import StudentDetails from './pages/admin/StudentDetails'
import Students from './pages/admin/Students'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import StudentLayout from './layouts/StudentLayout'
import AIChat from './pages/student/AIChat'
import AnalysisResult from './pages/student/AnalysisResult'
import Dashboard from './pages/student/Dashboard'
import GrowthBoard from './pages/student/GrowthBoard'
import ProfileSetup from './pages/student/ProfileSetup'
import Progress from './pages/student/Progress'
import ResumeUpload from './pages/student/ResumeUpload'
import Roadmap from './pages/student/Roadmap'
import Tasks from './pages/student/Tasks'

function MainLayout({ children }) {
  return (
    <div className="min-h-screen w-full font-sans bg-slate-950 text-white flex flex-col items-center">
      <div className="w-full min-h-screen flex flex-col items-center p-6 sm:p-8 gap-6">
        {children}
      </div>
      {/* Global styles for premium look and consistent card appearance */}
      <style>{`
        .premium-card {
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.98) 80%, rgba(22, 26, 41, 0.98));
          border-radius: 1rem;
          box-shadow: 0 6px 28px rgba(40,48,64,0.16), 0px 1.5px 4px 0px rgba(245, 76, 113, 0.08);
          padding: 1.5rem;
          transition: box-shadow .22s, transform .18s;
        }
        .premium-card:hover, .premium-card:focus-within {
          box-shadow: 0 12px 40px 0 rgba(245,63,94,0.12), 0 3px 10px 0 rgba(40,48,64,0.18);
          transform: translateY(-5px) scale(1.018);
        }
        .premium-title {
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }
        .premium-subtitle {
          font-size: 1.175rem;
          color: #f4f4f9cc;
          font-weight: 600;
        }
        .premium-section {
          gap: 2rem;
          margin-bottom: 1.5rem;
        }
        @media (max-width: 700px) {
          .premium-card { border-radius: .95rem; padding: 1rem;}
          .premium-title { font-size: 1.35rem; }
        }
        body, html {
          background: #0f172a;
        }
      `}</style>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/student" element={<StudentLayout />}>
            <Route
              path="dashboard"
              element={<div className="premium-card"><Dashboard /></div>}
            />
            <Route
              path="profile"
              element={<div className="premium-card"><ProfileSetup /></div>}
            />
            <Route
              path="resume"
              element={<div className="premium-card"><ResumeUpload /></div>}
            />
            <Route
              path="analysis"
              element={<div className="premium-card"><AnalysisResult /></div>}
            />
            <Route
              path="roadmap"
              element={<div className="premium-card"><Roadmap /></div>}
            />
            <Route
              path="tasks"
              element={<div className="premium-card"><Tasks /></div>}
            />
            <Route
              path="ai-chat"
              element={<div className="premium-card"><AIChat /></div>}
            />
            <Route
              path="progress"
              element={<div className="premium-card"><Progress /></div>}
            />
            <Route
              path="growth-board"
              element={<div className="premium-card"><GrowthBoard /></div>}
            />
          </Route>

          <Route
            path="/admin/dashboard"
            element={<div className="premium-card"><AdminDashboard /></div>}
          />
          <Route
            path="/admin/students"
            element={<div className="premium-card"><Students /></div>}
          />
          <Route
            path="/admin/student/:id"
            element={<div className="premium-card"><StudentDetails /></div>}
          />
          <Route
            path="/admin/analytics"
            element={<div className="premium-card"><Analytics /></div>}
          />
          <Route
            path="/admin/at-risk"
            element={<div className="premium-card"><AtRiskStudents /></div>}
          />
          <Route
            path="/admin/interventions"
            element={<div className="premium-card"><Interventions /></div>}
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  )
}

export default App
