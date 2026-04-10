import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../services/api'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/api/auth/login', { email, password })
      if (data.token) {
        localStorage.setItem('token', data.token)
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user))
        }
      }
      const role = data.user?.role || 'student'
      navigate(role === 'admin' ? '/admin/dashboard' : '/student/dashboard')
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || 'Login failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-3rem)] w-full max-w-md flex-col justify-center gap-8">
      <div>
        <h1 className="premium-title text-white">Sign in</h1>
        <p className="premium-subtitle mt-2 text-slate-400">
          Use your account to continue to PlaceMentor AI
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="premium-card flex w-full flex-col gap-5 border border-slate-700/80 bg-slate-900/90"
      >
        {error ? (
          <p
            className="rounded-lg border border-rose-500/40 bg-rose-950/50 px-3 py-2 text-sm text-rose-200"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <label className="flex flex-col gap-1.5 text-left text-sm font-medium text-slate-200">
          Email
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-slate-600 bg-slate-950/80 px-3 py-2.5 text-white placeholder:text-slate-500 focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400"
            placeholder="you@example.com"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-left text-sm font-medium text-slate-200">
          Password
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-slate-600 bg-slate-950/80 px-3 py-2.5 text-white placeholder:text-slate-500 focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400"
            placeholder="••••••••"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-1 rounded-lg bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>

        <p className="text-center text-sm text-slate-400">
          No account?{' '}
          <Link
            to="/register"
            className="font-medium text-rose-400 hover:text-rose-300"
          >
            Register
          </Link>
        </p>
      </form>
    </main>
  )
}

export default Login
