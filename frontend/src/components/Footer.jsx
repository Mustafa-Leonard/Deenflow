import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import AuthContext from '../contexts/AuthContext'
import { 
  Sparkles, 
  MessageSquare, 
  Twitter, 
  Instagram, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Globe, 
  Zap, 
  Github,
  Award
} from 'lucide-react'

export default function Footer() {
  const { user } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)

  const adminBase = '/app' // Adjust based on routing

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email.trim() || loading) return
    setLoading(true)
    try {
      if (api.post) {
        await api.post('/auth/newsletter/subscribe/', { email })
      }
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
    <footer className="relative bg-slate-950 text-slate-400 overflow-hidden pt-24">
      {/* Subtle Glow Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-800/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/20 to-transparent"></div>

      <div className="relative max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 pb-20">

          {/* Brand & Mission */}
          <div className="lg:col-span-4 space-y-10">
            <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-brand-600/20 group-hover:rotate-12 transition-transform">
                <Sparkles className="w-7 h-7 fill-current" />
              </div>
              <div className="flex flex-col">
                <div className="font-display font-bold text-3xl tracking-tighter text-white leading-none">
                  Deen<span className="text-brand-600">Flow</span>
                </div>
                <div className="text-[10px] uppercase tracking-[0.4em] font-bold text-slate-500 pl-0.5 mt-2">
                  Spiritual Intelligence
                </div>
              </div>
            </div>

            <p className="text-lg leading-relaxed text-slate-400 font-medium font-serif italic max-w-sm">
              "Bridging timeless Islamic wisdom with future-ready technology to empower every soul."
            </p>

            <div className="flex items-center gap-4">
              <SocialIcon icon={<MessageSquare className="w-5 h-5" />} href="https://wa.me/254112681600" />
              <SocialIcon icon={<Twitter className="w-5 h-5" />} href="https://x.com/leonardlewa" />
              <SocialIcon icon={<Instagram className="w-5 h-5" />} href="https://instagram.com/leonardlewa" />
              <SocialIcon icon={<Github className="w-5 h-5" />} href="https://github.com/Mustafa-Leonard" />
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-12">
            <div className="space-y-8">
              <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.3em] flex items-center gap-2">
                <Globe className="w-3 h-3 text-brand-600" />
                Ecosystem
              </h4>
              <ul className="space-y-5">
                 <FooterLink to="/app/dashboard" label="Platform Hub" />
                 <FooterLink to="/app/quran" label="Noble Quran" />
                 <FooterLink to="/app/academy" label="Academy" />
                 <FooterLink to="/app/planner" label="Deen Planner" />
              </ul>
            </div>
            <div className="space-y-8">
              <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.3em] flex items-center gap-2">
                <ShieldCheck className="w-3 h-3 text-brand-600" />
                Knowledge
              </h4>
              <ul className="space-y-5">
                 <FooterLink to="/app/consultations" label="Scholar Network" />
                 <FooterLink to="/app/donations" label="Impact Charity" />
                 <FooterLink to="/app/messages" label="Inquiry Logs" />
                 <FooterLink to="/app/history" label="Correspondence" />
              </ul>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="lg:col-span-3">
            <div className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 relative overflow-hidden group shadow-2xl backdrop-blur-sm">
              <div className="absolute top-0 right-0 -mr-12 -mt-12 w-32 h-32 bg-brand-600/10 rounded-full blur-2xl group-hover:bg-brand-600/30 transition-colors duration-700" />
              
              <h4 className="text-xl font-display font-bold text-white mb-3">Weekly Wisdom</h4>
              <p className="text-sm text-slate-500 mb-8 leading-relaxed font-medium">
                Curated spiritual reminders and system updates.
              </p>

              <form onSubmit={handleSubscribe} className="space-y-4">
                <div className="relative group/input">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within/input:text-brand-500 transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Refined soul @ email"
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-900 border border-white/5 text-sm text-white placeholder:text-slate-700 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs uppercase tracking-widest shadow-2xl shadow-brand-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group/btn"
                >
                  {loading ? 'Processing...' : (subscribed ? '✓ Enrolled' : (
                    <>
                      <span>Join Intelligence List</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </>
                  ))}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Feature Highlights Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-white/5 mb-12">
          <HighlightItem label="Authenticity" val="Scholar-Led" />
          <HighlightItem label="Privacy" val="E2E Encrypted" />
          <HighlightItem label="Uptime" val="99.9% Global" />
          <HighlightItem label="Design" val="Premium Islamic" />
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-16">
          <div className="flex items-center gap-8 text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em] font-display">
            <span>© {new Date().getFullYear()} DEENFLOW</span>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Duty</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Term Covenant</Link>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/5 border border-emerald-500/10 shadow-inner">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Mainnet Verified</span>
            </div>
            <div className="hidden lg:block text-[11px] text-slate-700 font-bold italic font-serif">
              "Seeking knowledge is an obligation upon every Muslim."
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

function SocialIcon({ icon, href }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-brand-600 hover:text-white hover:-translate-y-1 transition-all duration-300 text-slate-500"
    >
      {icon}
    </a>
  )
}

function FooterLink({ to, label }) {
  return (
    <li>
      <Link to={to} className="group flex items-center gap-3 text-xs font-bold uppercase tracking-widest hover:text-white transition-all text-slate-500">
        <div className="w-1 h-1 bg-brand-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
        {label}
      </Link>
    </li>
  )
}

function HighlightItem({ label, val }) {
  return (
    <div className="text-center group">
      <div className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em] mb-2 group-hover:text-brand-600 transition-colors">{label}</div>
      <div className="text-sm font-bold text-white/80">{val}</div>
    </div>
  )
}
