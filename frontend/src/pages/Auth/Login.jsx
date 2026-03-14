import React, { useState, useContext } from 'react'
import AuthContext from '../../contexts/AuthContext'
import { useNavigate, Link, useLocation } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState(localStorage.getItem('rememberedEmail') || '')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(!!localStorage.getItem('rememberedEmail'))
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useContext(AuthContext)
  const nav = useNavigate()
  const location = useLocation()

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const trimmedEmail = email.trim()
      const user = await login(trimmedEmail, password)

      if (rememberMe) {
        localStorage.setItem('rememberedEmail', trimmedEmail)
      } else {
        localStorage.removeItem('rememberedEmail')
      }

      const from = location.state?.from?.pathname || (user.is_admin ? '/admin/dashboard' : '/app/dashboard')
      nav(from, { replace: true })
    } catch (err) {
      console.error('Login error:', err)
      const status = err.response?.status
      let msg = 'Invalid email or password. Please try again.'
      if (status === 401) {
        msg = 'Incorrect email or password. Please check your credentials.'
      } else if (status === 400) {
        msg = err.response?.data?.detail || 'Please fill in all fields correctly.'
      } else if (!err.response) {
        msg = 'Cannot connect to server. Please make sure the backend is running.'
      }
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-[#f5f5f5] font-sans">
      {/* Visual Side — mosque-themed */}
      <div className="hidden lg:flex lg:w-1/2 mosque-hero-bg relative items-center justify-center p-12 overflow-hidden">
        <div className="hero-overlay absolute inset-0" />
        <div className="relative z-10 max-w-md text-white">
          <Link to="/" className="flex items-center gap-2 mb-10">
            <div className="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold text-sm">☽</div>
            <span className="font-display font-bold text-2xl text-white">Deen<span className="text-brand-300">Flow</span></span>
          </Link>

          <h2 className="text-4xl font-display font-bold mb-4 leading-tight">
            Welcome Back to<br />
            <span className="text-brand-300">Your Journey</span>
          </h2>
          <p className="text-white/70 text-base leading-relaxed mb-10" style={{ fontFamily: 'Inter, sans-serif' }}>
            Continue your path of Islamic learning, worship, and community engagement.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {[
              { val: '50K+', label: 'Members' },
              { val: '99%', label: 'Accuracy' },
              { val: '114', label: 'Surahs' },
              { val: '24/7', label: 'AI Guidance' },
            ].map(s => (
              <div key={s.label} className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="text-2xl font-display font-bold text-white mb-1">{s.val}</div>
                <div className="text-[11px] uppercase font-bold text-white/50 tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">
        {/* Mobile logo */}
        <div className="absolute top-6 left-6 lg:hidden flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white text-xs font-bold">☽</div>
          <span className="font-display font-bold text-lg text-brand-700">DeenFlow</span>
        </div>

        <div className="w-full max-w-sm animate-fade-in-up">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">Sign In</h1>
            <p className="text-slate-500" style={{ fontFamily: 'Inter, sans-serif' }}>
              Enter your credentials to access your account.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium animate-fade-in">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-white border border-slate-200 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all text-slate-900 font-medium text-sm shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Password</label>
                <a href="#" className="text-xs font-semibold text-brand-600 hover:text-brand-700">Forgot?</a>
              </div>
              <input
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                type="password"
                required
                className="w-full bg-white border border-slate-200 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all text-slate-900 font-medium text-sm shadow-sm"
              />
            </div>

            <div className="flex items-center gap-3 px-0.5">
              <button
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  rememberMe ? 'bg-brand-600 border-brand-600' : 'bg-white border-slate-300'
                }`}
              >
                {rememberMe && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <span className="text-sm text-slate-500 font-medium">Remember me</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              id="login-submit-btn"
              className="w-full btn-primary py-3.5 text-base justify-center disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Authenticating...
                </span>
              ) : (
                <>Sign In <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              Don't have an account?{' '}
              <Link to="/register" className="text-brand-600 font-bold hover:text-brand-700 transition-colors">
                Create account
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="text-slate-400 hover:text-brand-600 text-xs transition-colors">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
