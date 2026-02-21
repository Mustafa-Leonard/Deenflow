import React, { useState, useContext } from 'react'
import AuthContext from '../../contexts/AuthContext'
import { useNavigate, Link, useLocation } from 'react-router-dom'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', password2: '' })
  const { register } = useContext(AuthContext)
  const nav = useNavigate()
  const location = useLocation()

  const submit = async (e) => {
    e.preventDefault()
    if (form.password !== form.password2) { return alert('Passwords mismatch') }
    try {
      const success = await register({
        full_name: form.username.trim(),
        email: form.email.trim(),
        password: form.password
      })
      if (success) {
        const from = location.state?.from?.pathname || '/app/dashboard'
        nav(from, { replace: true })
      }
      else alert('Register failed')
    } catch (e) {
      alert('Register failed: ' + (e.response?.data?.detail || e.message))
    }
  }

  return (
    <div className="min-h-screen flex bg-white font-sans overflow-hidden">
      {/* Visual Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-600 relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-brand-400/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 bg-slate-950/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-md text-white">
          <div className="mb-12">
            <div className="font-display font-bold text-5xl tracking-tight mb-2 italic">Deen<span className="text-white/80">Flow</span></div>
            <div className="text-sm uppercase tracking-[0.3em] font-semibold text-brand-100">Join the Wisdom Circle</div>
          </div>
          <h2 className="text-4xl font-display font-bold mb-6 leading-tight">Start your journey into context-aware wisdom.</h2>
          <p className="text-brand-50 text-lg leading-relaxed mb-8">
            Create an account to save your reflections, track your history, and get personalized Islamic analysis.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-md">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">1</div>
              <div className="text-sm font-medium">Describe your life situation</div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-md">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">2</div>
              <div className="text-sm font-medium">Receive intelligent guidance</div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-md">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">3</div>
              <div className="text-sm font-medium">Reflect and apply with context</div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative overflow-auto">
        <div className="absolute top-8 left-8 lg:hidden">
          <div className="font-display font-bold text-2xl tracking-tight text-slate-950">Deen<span className="text-brand-600">Flow</span></div>
        </div>

        <div className="w-full max-w-md animate-in fade-in slide-in-from-right-4 duration-700 pt-16 lg:pt-0">
          <div className="mb-10">
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-2 tracking-tight">Create your account</h2>
            <p className="text-slate-500 font-medium">Join us for a wiser perspective on daily life.</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
              <input
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                placeholder="Mustafa"
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all text-slate-900 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
              <input
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="mustafa@gmail.com"
                type="email"
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all text-slate-900 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Password</label>
                <input
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  type="password"
                  className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all text-slate-900 font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Confirm</label>
                <input
                  value={form.password2}
                  onChange={e => setForm({ ...form, password2: e.target.value })}
                  placeholder="••••••••"
                  type="password"
                  className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all text-slate-900 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-950 hover:bg-slate-800 text-white py-4 rounded-2xl font-bold transition-all shadow-xl active:scale-[0.98] mt-4 flex items-center justify-center gap-2"
            >
              Get Started
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-500 font-medium">
              Already have an account? <Link to="/login" className="text-brand-600 font-bold hover:text-brand-700 transition-colors">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
