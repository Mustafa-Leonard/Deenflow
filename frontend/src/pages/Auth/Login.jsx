import React, { useState, useContext } from 'react'
import AuthContext from '../../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState(localStorage.getItem('rememberedEmail') || '')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(!!localStorage.getItem('rememberedEmail'))
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useContext(AuthContext)
  const nav = useNavigate()

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

      if (user.is_admin) {
        nav('/admin/dashboard')
      } else {
        nav('/app/dashboard')
      }
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
    <div className="min-h-screen flex bg-white font-sans overflow-hidden">
      {/* Visual Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-950 relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-brand-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 bg-brand-400/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-md text-white">
          <div className="mb-12">
            <img src="/deenflow-logo.svg" alt="DeenFlow" className="h-10 w-auto brightness-0 invert" />
            <div className="text-sm uppercase tracking-[0.3em] font-semibold text-brand-300 mt-2">Islamic Guidance System</div>
          </div>
          <h2 className="text-4xl font-display font-bold mb-6 leading-tight">Wisdom for the modern context.</h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-8">
            Access intelligent, context-aware Islamic analysis for daily life situations, business ethics, and personal growth.
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
              <div className="text-2xl font-bold mb-1">99%</div>
              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Accuracy Range</div>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
              <div className="text-2xl font-bold mb-1">Instant</div>
              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Analysis Speed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">
        <div className="absolute top-8 left-8 lg:hidden">
          <img src="/deenflow-logo.svg" alt="DeenFlow" className="h-8 w-auto" />
        </div>

        <div className="w-full max-w-sm animate-in fade-in slide-in-from-right-4 duration-700">
          <div className="mb-10">
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-2 tracking-tight">Welcome back</h2>
            <p className="text-slate-500 font-medium">Please enter your credentials to continue.</p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="mustafa@gmail.com"
                required
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all text-slate-900 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Password</label>
                <a href="#" className="text-[10px] font-bold text-brand-600 hover:text-brand-700 uppercase tracking-widest">Forgot?</a>
              </div>
              <input
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                type="password"
                required
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all text-slate-900 font-medium"
              />
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="hidden"
                />
                <div className={`w-5 h-5 rounded-md border-2 mr-3 flex items-center justify-center transition-all ${rememberMe ? 'bg-brand-600 border-brand-600' : 'bg-slate-50 border-slate-200'}`}>
                  {rememberMe && (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-xs font-bold text-slate-500 group-hover:text-slate-700 transition-colors uppercase tracking-wider">Remember Me</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-950 hover:bg-slate-800 text-white py-4 rounded-2xl font-bold transition-all shadow-xl active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 group"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              {!loading && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-500 font-medium">
              Don't have an account? <Link to="/register" className="text-brand-600 font-bold hover:text-brand-700 transition-colors">Create account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
