import React, { useState, useContext } from 'react'
import AuthContext from '../../contexts/AuthContext'
import { useNavigate, Link, useLocation } from 'react-router-dom'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', password2: '' })
  const [error, setError] = useState('')
  const { register } = useContext(AuthContext)
  const nav = useNavigate()
  const location = useLocation()

  const submit = async (e) => {
    e.preventDefault()
    if (form.password !== form.password2) {
      setError('Passwords do not match. Please try again.')
      return
    }
    setError('')
    try {
      const success = await register({
        full_name: form.username.trim(),
        email: form.email.trim(),
        password: form.password
      })
      if (success) {
        const from = location.state?.from?.pathname || '/app/dashboard'
        nav(from, { replace: true })
      } else {
        setError('Registration failed. Please try again.')
      }
    } catch (e) {
      setError('Registration failed: ' + (e.response?.data?.detail || e.message))
    }
  }

  return (
    <div className="min-h-screen flex bg-[#f5f5f5] font-sans">
      {/* Visual Side */}
      <div className="hidden lg:flex lg:w-1/2 mosque-hero-bg relative items-center justify-center p-12 overflow-hidden">
        <div className="hero-overlay absolute inset-0" />
        <div className="relative z-10 max-w-md text-white">
          <Link to="/" className="flex items-center gap-2 mb-10">
            <div className="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold text-sm">☽</div>
            <span className="font-display font-bold text-2xl text-white">Deen<span className="text-brand-300">Flow</span></span>
          </Link>

          <h2 className="text-4xl font-display font-bold mb-4 leading-tight">
            Begin Your <span className="text-brand-300">Islamic Journey</span>
          </h2>
          <p className="text-white/70 text-base leading-relaxed mb-10" style={{ fontFamily: 'Inter, sans-serif' }}>
            Join 50,000+ Muslims using DeenFlow to deepen their knowledge, worship, and connection to Allah.
          </p>

          <div className="space-y-4">
            {[
              { num: '01', title: 'Create your free account', desc: 'No credit card required' },
              { num: '02', title: 'Explore Islamic features', desc: 'Quran, AI, prayer times & more' },
              { num: '03', title: 'Grow your knowledge', desc: 'Structured learning paths & community' },
            ].map(s => (
              <div key={s.num} className="flex items-start gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/15">
                <div className="w-10 h-10 rounded-full bg-brand-500/80 flex items-center justify-center font-display font-bold text-white text-sm flex-shrink-0">
                  {s.num}
                </div>
                <div>
                  <div className="font-semibold text-white">{s.title}</div>
                  <div className="text-white/60 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative overflow-auto">
        {/* Mobile logo */}
        <div className="absolute top-6 left-6 lg:hidden flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white text-xs font-bold">☽</div>
          <span className="font-display font-bold text-lg text-brand-700">DeenFlow</span>
        </div>

        <div className="w-full max-w-sm animate-fade-in-up pt-10 lg:pt-0">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">Create Account</h1>
            <p className="text-slate-500" style={{ fontFamily: 'Inter, sans-serif' }}>
              Join the DeenFlow community — it's free forever.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium animate-fade-in">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Full Name</label>
              <input
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                placeholder="Mustafa Al-Hassan"
                required
                className="w-full bg-white border border-slate-200 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all text-slate-900 font-medium text-sm shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</label>
              <input
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                type="email"
                required
                className="w-full bg-white border border-slate-200 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all text-slate-900 font-medium text-sm shadow-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Password</label>
                <input
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  type="password"
                  required
                  className="w-full bg-white border border-slate-200 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all text-slate-900 font-medium text-sm shadow-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Confirm</label>
                <input
                  value={form.password2}
                  onChange={e => setForm({ ...form, password2: e.target.value })}
                  placeholder="••••••••"
                  type="password"
                  required
                  className="w-full bg-white border border-slate-200 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all text-slate-900 font-medium text-sm shadow-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              id="register-submit-btn"
              className="w-full btn-primary py-3.5 text-base justify-center mt-2"
            >
              Create My Account →
            </button>
          </form>

          <p className="mt-4 text-xs text-slate-400 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="text-brand-600 hover:underline">Terms</Link> and{' '}
            <Link to="/privacy" className="text-brand-600 hover:underline">Privacy Policy</Link>.
          </p>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              Already have an account?{' '}
              <Link to="/login" className="text-brand-600 font-bold hover:text-brand-700">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-3 text-center">
            <Link to="/" className="text-slate-400 hover:text-brand-600 text-xs transition-colors">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
