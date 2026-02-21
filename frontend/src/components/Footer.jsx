import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import AuthContext from '../contexts/AuthContext'

export default function Footer() {
  const { user } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)

  const base = user?.is_admin ? '/admin' : '/app'

  const navigationLinks = [
    { to: `${base}/dashboard`, label: 'Portal Home', icon: '🏠' },
    { to: `${base}/quran`, label: "Holy Qur'an", icon: '📖' },
    { to: user?.is_admin ? '/admin/ai/logs' : '/app/ask-ai', label: 'Ask AI Scholar', icon: '🤖' },
    { to: user?.is_admin ? '/admin/content' : '/app/learning', label: 'Academy', icon: '🎓' },
  ]

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email.trim() || loading) return
    setLoading(true)
    try {
      await api.post('/auth/newsletter/subscribe/', { email })
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 4000)
    } catch (err) {
      console.error('Newsletter subscription failed:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer className="relative bg-slate-950 text-slate-400 overflow-hidden pt-20">
      {/* Premium Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 pb-16">

          {/* Brand & Mission */}
          <div className="lg:col-span-4 space-y-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-brand-500/50 transition-all duration-500 group-hover:rotate-6 shadow-2xl">
                <img src="/deenflow-icon.svg" alt="" className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-white tracking-tight">Deen<span className="text-brand-500">Flow</span></h2>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Spiritual Intelligence</div>
              </div>
            </Link>

            <p className="text-base leading-relaxed text-slate-400/80 font-medium">
              Bridging timeless Islamic wisdom with future-ready technology.
              Our mission is to empower every Muslim with verified,
              accessible, and intelligent spiritual guidance.
            </p>

            <div className="flex items-center gap-4">
              {[
                { name: 'WhatsApp', href: 'https://wa.me/254112681600', icon: '💬' },
                { name: 'X', href: 'https://x.com/leonardlewa', icon: '𝕏' },
                { name: 'Instagram', href: 'https://instagram.com/leonardlewa', icon: '📸' }
              ].map(social => (
                <a key={social.name} href={social.href} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-600 hover:border-brand-500 hover:-translate-y-1 transition-all duration-300 text-lg">
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Grid */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="text-xs font-bold text-white uppercase tracking-[0.2em]">Ecosystem</h4>
              <ul className="space-y-4">
                {navigationLinks.map(link => (
                  <li key={link.label}>
                    <Link to={link.to} className="group flex items-center gap-2 text-sm hover:text-white transition-colors">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity text-brand-500">▹</span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-xs font-bold text-white uppercase tracking-[0.2em]">Knowledge</h4>
              <ul className="space-y-4">
                {['Library', 'Scholars', 'Research', 'Community'].map(item => (
                  <li key={item}>
                    <Link to="#" className="group flex items-center gap-2 text-sm hover:text-white transition-colors">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-500">▹</span>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter Card */}
          <div className="lg:col-span-4">
            <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-white/5 to-transparent border border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-brand-600/20 rounded-full blur-2xl group-hover:bg-brand-600/40 transition-colors duration-700" />

              <h4 className="text-lg font-bold text-white mb-2">Weekly Refinement</h4>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                Join 5,000+ members receiving curated reminders and platform updates.
              </p>

              <form onSubmit={handleSubscribe} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  required
                  className="w-full px-5 py-3.5 rounded-2xl bg-slate-900/50 border border-white/5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-xl shadow-brand-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  {loading ? 'Processing...' : (subscribed ? '✓ Subscribed' : 'Join Intelligence List')}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Feature Highlights Strip */}
        <div className="flex flex-wrap items-center justify-center gap-y-6 gap-x-12 py-10 border-y border-white/5 mb-10">
          {[
            { label: 'Authenticity', val: 'Scholar-Verified' },
            { label: 'Security', val: 'End-to-End Encryption' },
            { label: 'Accuracy', val: 'Advanced LLM Fine-Tuning' },
            { label: 'Experience', val: 'Modern Native Interface' }
          ].map(f => (
            <div key={f.label} className="text-center">
              <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">{f.label}</div>
              <div className="text-xs font-bold text-slate-300">{f.val}</div>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-12">
          <div className="flex items-center gap-6 text-[11px] font-bold text-slate-600 uppercase tracking-[0.2em]">
            <span>© {new Date().getFullYear()} DEENFLOW</span>
            <Link to="/privacy" className="hover:text-slate-400">Privacy</Link>
            <Link to="/terms" className="hover:text-slate-400">Terms</Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Mainnet Live</span>
            </div>
            <div className="hidden sm:block text-[11px] text-slate-600 font-medium italic">
              "Seeking knowledge is an obligation upon every Muslim"
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
