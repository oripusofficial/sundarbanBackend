import { LockKeyhole, LogIn } from 'lucide-react'
import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import useAuth from '../hooks/useAuth'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const redirectTo = location.state?.from?.pathname || '/'

  if (isAuthenticated) {
    return <Navigate replace to={redirectTo} />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await login(email, password)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="grid min-h-screen bg-slate-950 px-4 py-8 text-white lg:grid-cols-[1.1fr_0.9fr]">
      <section className="hidden place-items-center rounded-2xl border border-white/10 bg-white/5 p-10 lg:grid">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1 text-sm font-semibold text-emerald-300">
            <LockKeyhole aria-hidden="true" className="h-4 w-4" />
            Protected admin access
          </div>
          <h1 className="mt-6 text-5xl font-semibold tracking-tight">
            Sign in to manage Sundarban operations.
          </h1>
          <p className="mt-5 text-base leading-7 text-slate-300">
            Gallery uploads, admin docs, bookings, and dashboard tools are available
            only after authentication.
          </p>
        </div>
      </section>

      <section className="grid place-items-center">
        <form
          className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-slate-950 shadow-2xl"
          onSubmit={handleSubmit}
        >
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-500 text-slate-950">
            <LockKeyhole aria-hidden="true" className="h-6 w-6" />
          </div>
          <h2 className="mt-6 text-2xl font-semibold">Admin Login</h2>
          <p className="mt-2 text-sm text-slate-500">
            Use your admin credentials to continue.
          </p>

          {error && (
            <div className="mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <label className="mt-5 block">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input
              autoComplete="email"
              className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </label>

          <label className="mt-4 block">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input
              autoComplete="current-password"
              className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>

          <button
            className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            disabled={isSubmitting}
            type="submit"
          >
            <LogIn aria-hidden="true" className="h-4 w-4" />
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default LoginPage
