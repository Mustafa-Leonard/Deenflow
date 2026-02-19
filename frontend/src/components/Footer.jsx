import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import AuthContext from '../contexts/AuthContext'

export default function Footer() {
  const { user } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)

  // Determine base path based on user role
  const base = user?.is_admin ? '/admin' : '/app'

  const navigationLinks = [
    { to: `${base}/dashboard`, label: 'Dashboard' },
    { to: `${base}/quran`, label: "Qur'an" },
    { to: `${base}/quran?tab=surahs`, label: 'Surahs' },
    { to: `${base}/quran?tab=juz`, label: 'Juz' },
    { to: user?.is_admin ? '/admin/ai/logs' : '/app/ask-ai', label: 'Ask AI Scholar' },
    { to: user?.is_admin ? '/admin/content' : '/app/learning', label: 'Learning Paths' },
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
    <footer className="relative bg-slate-900 text-slate-300 overflow-hidden">
      {/* Decorative top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-600 via-emerald-500 to-brand-400" />

      {/* Decorative background elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-brand-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] text-white/[0.015] font-arabic leading-none pointer-events-none select-none">
        ﷽
      </div>

      {/* ====== ROW 1: Main Footer Content (5 columns) ====== */}
      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-12 gap-x-8 gap-y-12">

          {/* Column 1: Branding & Legal */}
          <div className="col-span-12 md:col-span-3">
            <Link to="/" className="flex items-center gap-2.5 mb-5 group">
              <img
                src="/deenflow-icon.svg"
                alt="DeenFlow Icon"
                className="w-10 h-10 transition-transform group-hover:scale-110 group-hover:rotate-3 duration-300"
              />
              <div>
                <img
                  src="/deenflow-logo-bw.svg"
                  alt="DeenFlow"
                  className="h-6 w-auto brightness-200 opacity-90"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'block'
                  }}
                />
                <span className="text-xl font-bold text-white tracking-tight hidden">DeenFlow</span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-slate-400 mb-6 max-w-xs">
              Your intelligent companion for authentic Islamic guidance.
              Empowering Muslims worldwide with AI-powered knowledge
              rooted in the Quran and Sunnah.
            </p>
            <div className="flex flex-col gap-2 text-xs text-slate-500">
              <span>© {new Date().getFullYear()} DeenFlow. All rights reserved.</span>
              <div className="flex items-center gap-3">
                <Link to="/terms" className="hover:text-brand-400 transition-colors duration-200 underline underline-offset-2 decoration-slate-700 hover:decoration-brand-400">
                  Terms of Service
                </Link>
                <span className="w-1 h-1 rounded-full bg-slate-700" />
                <Link to="/privacy" className="hover:text-brand-400 transition-colors duration-200 underline underline-offset-2 decoration-slate-700 hover:decoration-brand-400">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="col-span-6 md:col-span-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-5 h-0.5 bg-brand-500 rounded-full" />
              Navigate
            </h4>
            <ul className="space-y-3">
              {navigationLinks.map(link => (
                <li key={`${link.to}-${link.label}`}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate-400 hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1.5 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-brand-500 rounded-full transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: About & Support */}
          <div className="col-span-6 md:col-span-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-5 h-0.5 bg-emerald-500 rounded-full" />
              About Us
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              DeenFlow is built by a team of dedicated developers and Islamic scholars
              committed to making authentic Islamic knowledge accessible to everyone.
              Our platform combines cutting-edge AI technology with rigorously verified
              Islamic scholarship.
            </p>
            <ul className="space-y-3 mt-5">
              {[
                { to: '/contact', label: 'Contact & Support' },
                { to: '/faq', label: 'FAQs' },
              ].map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate-400 hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1.5 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-emerald-500 rounded-full transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info & Social */}
          <div className="col-span-6 md:col-span-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-5 h-0.5 bg-cyan-500 rounded-full" />
              Connect
            </h4>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <a
                href="mailto:leonardlewa372@gmail.com"
                className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-white transition-colors duration-200 group"
              >
                <span className="w-8 h-8 rounded-lg bg-slate-800 group-hover:bg-brand-600/20 flex items-center justify-center transition-colors duration-200">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </span>
                <span className="text-xs break-all">leonardlewa372@gmail.com</span>
              </a>
              <a
                href="tel:0112681600"
                className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-white transition-colors duration-200 group"
              >
                <span className="w-8 h-8 rounded-lg bg-slate-800 group-hover:bg-emerald-600/20 flex items-center justify-center transition-colors duration-200">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </span>
                <span className="text-xs">0112 681 600</span>
              </a>
            </div>

            {/* Social Icons */}
            <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Community</h5>
            <div className="flex items-center gap-2">
              {[
                {
                  name: 'WhatsApp',
                  href: 'https://wa.me/254112681600',
                  color: 'hover:bg-green-600 hover:shadow-green-600/30',
                  icon: (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  ),
                },
                {
                  name: 'Facebook',
                  href: 'https://facebook.com/leonard.lewa.372', // Reconstructing based on context
                  color: 'hover:bg-blue-600 hover:shadow-blue-600/30',
                  icon: (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  ),
                },
                {
                  name: 'Instagram',
                  href: 'https://instagram.com/leonardlewa',
                  color: 'hover:bg-pink-600 hover:shadow-pink-600/30',
                  icon: (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  ),
                },
                {
                  name: 'Twitter / X',
                  href: 'https://x.com/leonardlewa',
                  color: 'hover:bg-slate-600 hover:shadow-slate-600/30',
                  icon: (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  ),
                },
              ].map(social => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.name}
                  className={`w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${social.color}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 5: Newsletter & Engagement */}
          <div className="col-span-6 md:col-span-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-5 h-0.5 bg-amber-500 rounded-full" />
              Stay Updated
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Get weekly Islamic reminders, new feature announcements, and curated knowledge straight to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="mb-5">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-3 rounded-lg bg-gradient-to-r from-brand-600 to-brand-500 text-white text-xs font-semibold hover:shadow-lg hover:shadow-brand-600/30 transition-all duration-300 hover:from-brand-500 hover:to-brand-400"
                >
                  {subscribed ? '✓' : '→'}
                </button>
              </div>
              {subscribed && (
                <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1 animate-fade-in">
                  <span>✓</span> Jazakallah Khair! You're subscribed.
                </p>
              )}
            </form>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to="/updates"
                  className="text-sm text-slate-400 hover:text-white transition-all duration-200 inline-flex items-center gap-1.5 group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-amber-500 rounded-full transition-all duration-200" />
                  Updates & Announcements
                </Link>
              </li>
              <li>
                <Link
                  to="/changelog"
                  className="text-sm text-slate-400 hover:text-white transition-all duration-200 inline-flex items-center gap-1.5 group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-amber-500 rounded-full transition-all duration-200" />
                  Changelog
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ====== ROW 2: Features Strip ====== */}
      <div className="relative border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            {[
              { icon: '🕌', text: 'Quran & Hadith Based' },
              { icon: '🤖', text: 'AI-Powered Guidance' },
              { icon: '👳', text: 'Scholar Verified' },
              { icon: '🔒', text: 'Privacy First' },
              { icon: '🌍', text: 'Global Community' },
            ].map(feature => (
              <div
                key={feature.text}
                className="flex items-center gap-2 text-xs text-slate-500 group"
              >
                <span className="text-sm transition-transform duration-300 group-hover:scale-125">{feature.icon}</span>
                <span className="font-medium group-hover:text-slate-300 transition-colors duration-200">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ====== ROW 3: Bottom Bar ====== */}
      <div className="relative border-t border-slate-800 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-slate-600 text-center sm:text-left">
              Educational guidance only — not a substitute for a qualified Islamic scholar.
              Seek verified knowledge always.
            </p>
            <div className="flex items-center gap-4 text-[11px] text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                All Systems Operational
              </span>
              <span className="hidden sm:inline">·</span>
              <span className="hidden sm:inline">Made with ❤️ for the Ummah</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
