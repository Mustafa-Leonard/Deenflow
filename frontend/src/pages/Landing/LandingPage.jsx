import React, { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthContext from '../../contexts/AuthContext'

// ─── Navbar ─────────────────────────────────────────────────────────────────
function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user } = useContext(AuthContext)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navItems = [
    { label: 'Home',      href: '#hero' },
    { label: "Qur'an",   href: '#quran' },
    { label: 'Community', href: '#community' },
    { label: 'Events',   href: '#events' },
    { label: 'Knowledge', href: '#knowledge' },
    { label: 'Contact',  href: '/contact' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 select-none">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-sm shadow-green flex-shrink-0">
            ☽
          </div>
          <span
            className="font-display font-bold text-xl tracking-tight"
            style={{ color: scrolled ? '#1a8f5c' : '#ffffff' }}
          >
            Deen<span style={{ color: scrolled ? '#48bc89' : '#d1fae5' }}>Flow</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map(item => (
            <a
              key={item.label}
              href={item.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10 ${
                scrolled ? 'text-slate-600 hover:text-brand-600 hover:bg-brand-50' : 'text-white/90 hover:text-white'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          {user ? (
            <Link
              to={user.is_admin ? '/admin/dashboard' : '/app/dashboard'}
              className="btn-primary text-sm px-5 py-2.5"
            >
              Dashboard →
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className={`hidden sm:inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  scrolled ? 'text-slate-600 hover:text-brand-600' : 'text-white/90 hover:text-white'
                }`}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn-primary text-sm px-5 py-2.5"
              >
                Join Free
              </Link>
            </>
          )}
          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              scrolled ? 'text-slate-600 hover:bg-slate-100' : 'text-white hover:bg-white/10'
            }`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 shadow-xl animate-fade-in">
          <div className="max-w-7xl mx-auto px-6 py-4 space-y-1">
            {navItems.map(item => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-4 grid grid-cols-2 gap-3 border-t border-slate-100">
              <Link to="/login" className="btn-secondary text-sm py-2.5 text-center">Sign In</Link>
              <Link to="/register" className="btn-primary text-sm py-2.5 text-center">Join Free</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section id="hero" className="mosque-hero-bg relative min-h-screen flex items-center justify-center">
      {/* Overlay */}
      <div className="hero-overlay absolute inset-0" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-16">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full text-white/90 text-xs font-semibold uppercase tracking-widest mb-8 animate-fade-in-up">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          Islamic Guidance Platform
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight tracking-tight animate-fade-in-up anim-delay-100">
          Reconnect with{' '}
          <span className="text-brand-400">Your Deen</span>,<br />
          Guided by Wisdom
        </h1>

        <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-3xl mx-auto font-light leading-relaxed animate-fade-in-up anim-delay-200" style={{ fontFamily: 'Inter, sans-serif' }}>
          DeenFlow unites timeless Islamic scholarship with modern technology —
          AI guidance, Quranic study, prayer tools, and a thriving community in one platform.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up anim-delay-300">
          <Link to="/register" className="btn-primary text-base px-8 py-4 shadow-2xl">
            Join DeenFlow — It's Free
          </Link>
          <a href="#community" className="btn-secondary text-base px-8 py-4 border-white text-white hover:bg-white hover:text-brand-700">
            Learn More
          </a>
        </div>

        {/* Stats bar */}
        <div className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto animate-fade-in-up anim-delay-500">
          {[
            { val: '50K+', label: 'Members' },
            { val: '114', label: 'Surahs' },
            { val: '24/7', label: 'AI Guidance' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-display font-bold text-white mb-1">{s.val}</div>
              <div className="text-white/60 text-sm font-medium uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 animate-bounce">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  )
}

// ─── Community Intro Section ──────────────────────────────────────────────────
function CommunitySection() {
  return (
    <section id="community" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left text */}
          <div className="animate-fade-in-up">
            <span className="inline-block text-brand-600 font-semibold text-sm uppercase tracking-widest mb-4">
              Our Community
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6 leading-tight">
              Join the <span className="text-brand-600">Islamic Community</span>
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-8" style={{ fontFamily: 'Inter, sans-serif' }}>
              Be part of a thriving Muslim community that learns, grows, and worships together.
              Connect with scholars, peers, and spiritual guides as you deepen your understanding of Islam.
            </p>
            <div className="space-y-4 mb-10">
              {[
                { icon: '🕌', title: 'Daily Prayers & Dhikr', desc: 'Prayer times, Adhan alerts, and digital Tasbih' },
                { icon: '📖', title: "Quranic Study", desc: "Full Qur'an with translations, tafsir, and audio recitation" },
                { icon: '🤖', title: 'AI Islamic Scholar', desc: 'Get verified Islamic guidance powered by AI' },
              ].map(f => (
                <div key={f.title} className="flex items-start gap-4 p-4 rounded-xl hover:bg-brand-50 transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center text-2xl flex-shrink-0 group-hover:bg-brand-600 group-hover:text-white transition-all">
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 font-display">{f.title}</h3>
                    <p className="text-slate-500 text-sm mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/register" className="btn-primary inline-flex">
              Join the Community →
            </Link>
          </div>

          {/* Right: Stats cards */}
          <div className="grid grid-cols-2 gap-5">
            {[
              { icon: '👥', val: '50,000+', label: 'Active Members', color: 'bg-brand-50 text-brand-600' },
              { icon: '🏆', val: '500+', label: 'Daily Questions', color: 'bg-amber-50 text-amber-600' },
              { icon: '📿', val: '1M+', label: 'Dhikr Count', color: 'bg-purple-50 text-purple-600' },
              { icon: '🌍', val: '80+', label: 'Countries', color: 'bg-blue-50 text-blue-600' },
            ].map(s => (
              <div key={s.label} className="deen-card p-6 hover:shadow-elevated transition-shadow">
                <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center text-2xl mb-4`}>
                  {s.icon}
                </div>
                <div className="text-3xl font-display font-bold text-slate-900 mb-1">{s.val}</div>
                <div className="text-slate-500 text-sm font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Mission / Icon Cards ──────────────────────────────────────────────────────
function MissionSection() {
  const pillars = [
    { icon: '🕌', title: 'Authentic Sources', desc: 'All guidance grounded in Quran and Sunnah, verified by qualified scholars' },
    { icon: '🤖', title: 'AI Scholarship', desc: 'Intelligent answers to your Islamic questions powered by fine-tuned AI' },
    { icon: '📚', title: 'Islamic Academy', desc: 'Structured learning paths from Fiqh to Tafsir to personal development' },
    { icon: '🤝', title: 'Community Spirit', desc: 'Discussion forums, events calendar, and live sessions with scholars' },
    { icon: '⏰', title: 'Prayer Integration', desc: 'Auto-detected prayer times, Adhan reminders, and Qibla direction' },
    { icon: '💎', title: 'Privacy First', desc: 'Your spiritual journey remains confidential — end-to-end encrypted' },
  ]

  return (
    <section id="knowledge" className="py-24 px-6 bg-[#f5f5f5]">
      <div className="max-w-7xl mx-auto text-center mb-14">
        <span className="inline-block text-brand-600 font-semibold text-sm uppercase tracking-widest mb-4">
          Our Mission
        </span>
        <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
          Everything a Muslim <span className="text-brand-600">Needs</span>
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
          DeenFlow is your complete Islamic companion — integrating worship, learning, community, and guidance.
        </p>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pillars.map((p, i) => (
          <div
            key={p.title}
            className={`deen-card p-8 hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 animate-fade-in-up`}
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center text-3xl mb-6 group-hover:bg-brand-600 group-hover:text-white transition-all">
              {p.icon}
            </div>
            <h3 className="font-display font-bold text-slate-900 text-lg mb-2">{p.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Prayer Times Preview ─────────────────────────────────────────────────────
function PrayerTimesSection() {
  const prayers = [
    { name: 'Fajr',    time: '5:12 AM',  icon: '🌙', active: false },
    { name: 'Dhuhr',   time: '12:30 PM', icon: '☀️', active: false },
    { name: 'Asr',     time: '3:45 PM',  icon: '🌤', active: true  },
    { name: 'Maghrib', time: '6:28 PM',  icon: '🌅', active: false },
    { name: 'Isha',    time: '8:00 PM',  icon: '🌙', active: false },
  ]

  return (
    <section id="events" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Prayer cards */}
          <div className="space-y-3">
            {prayers.map((p) => (
              <div
                key={p.name}
                className={`flex items-center justify-between p-5 rounded-xl border transition-all ${
                  p.active
                    ? 'bg-brand-600 border-brand-500 shadow-green text-white'
                    : 'bg-white border-slate-100 shadow-card hover:border-brand-200 hover:shadow-soft text-slate-700'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-2xl ${
                    p.active ? 'bg-white/20' : 'bg-brand-50'
                  }`}>
                    {p.icon}
                  </div>
                  <div>
                    <div className={`font-display font-bold ${p.active ? 'text-white' : 'text-slate-900'}`}>
                      {p.name}
                    </div>
                    {p.active && (
                      <div className="text-white/70 text-xs font-medium">Current Prayer</div>
                    )}
                  </div>
                </div>
                <div className={`font-display font-bold text-lg ${p.active ? 'text-white' : 'text-brand-600'}`}>
                  {p.time}
                </div>
              </div>
            ))}
          </div>

          {/* Text */}
          <div>
            <span className="inline-block text-brand-600 font-semibold text-sm uppercase tracking-widest mb-4">
              Prayer Times
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6">
              Never Miss a <span className="text-brand-600">Prayer</span>
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-8" style={{ fontFamily: 'Inter, sans-serif' }}>
              DeenFlow automatically calculates prayer times based on your location.
              Get Adhan notifications, view upcoming prayers, and track your Salah streak.
            </p>
            <ul className="space-y-3 mb-10">
              {[
                'Auto-detected prayer times with location',
                'Customizable Adhan notifications',
                'Prayer streak tracker & reminders',
                'Qibla direction compass',
              ].map(item => (
                <li key={item} className="flex items-center gap-3 text-slate-600">
                  <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>
            <Link to="/register" className="btn-primary inline-flex">
              Set Up Prayer Times →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── AI Scholar CTA ───────────────────────────────────────────────────────────
function AIScholarSection() {
  return (
    <section className="py-24 px-6 section-green" id="quran">
      <div className="max-w-4xl mx-auto text-center text-white">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 border border-white/20 rounded-full text-white/90 text-xs font-semibold uppercase tracking-widest mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
          AI-Powered Guidance
        </div>
        <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
          Ask Any Islamic Question.<br />
          Get a <span className="text-brand-300">Verified Answer.</span>
        </h2>
        <p className="text-white/80 text-xl mb-10 max-w-2xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
          Our AI Scholar is trained on thousands of authentic Islamic texts and constantly reviewed by qualified scholars.
          Get real-time, context-aware guidance anytime.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-700 font-bold rounded-lg hover:bg-brand-50 transition-all hover:-translate-y-0.5 shadow-xl text-base">
            Ask Your First Question →
          </Link>
          <Link to="/login" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/40 text-white font-semibold rounded-lg hover:bg-white/10 transition-all text-base">
            Already a Member
          </Link>
        </div>
      </div>
    </section>
  )
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function TestimonialsSection() {
  const testimonials = [
    {
      quote: "DeenFlow has transformed my daily Islamic practice. The prayer reminders and AI scholar are incredibly helpful.",
      author: "Ahmad Al-Rashid",
      role: "Software Engineer",
      avatar: "A",
    },
    {
      quote: "Finally, an Islamic app that combines authentic scholarship with modern technology. I use it every single day.",
      author: "Fatima Malik",
      role: "Medical Student",
      avatar: "F",
    },
    {
      quote: "The Quranic study features and learning paths are exceptional. My knowledge of Islam has grown tremendously.",
      author: "Ibrahim Hassan",
      role: "Business Owner",
      avatar: "I",
    },
  ]

  return (
    <section className="py-24 px-6 bg-[#f5f5f5]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block text-brand-600 font-semibold text-sm uppercase tracking-widest mb-4">Testimonials</span>
          <h2 className="text-4xl font-display font-bold text-slate-900">
            Trusted by <span className="text-brand-600">Muslims Worldwide</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={t.author}
              className={`deen-card p-8 animate-fade-in-up`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, j) => (
                  <svg key={j} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-slate-600 italic leading-relaxed mb-6 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-sm font-display">{t.author}</div>
                  <div className="text-slate-400 text-xs">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function LandingFooter() {
  const footerLinks = {
    Platform: [
      { label: 'Home', href: '#hero' },
      { label: "Qur'an Reader", href: '/login' },
      { label: 'Prayer Times', href: '/login' },
      { label: 'AI Scholar', href: '/login' },
      { label: 'Islamic Academy', href: '/login' },
    ],
    Community: [
      { label: 'Join DeenFlow', href: '/register' },
      { label: 'Events', href: '#events' },
      { label: 'Scholars', href: '/contact' },
      { label: 'Knowledge Base', href: '#knowledge' },
    ],
    Support: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  }

  return (
    <footer className="footer-bg text-white">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 pb-12 border-b border-white/10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-9 h-9 rounded-lg bg-brand-400 flex items-center justify-center text-white font-bold text-sm">
                ☽
              </div>
              <span className="font-display font-bold text-xl text-white">DeenFlow</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
              Bridging timeless Islamic wisdom with modern technology.
              Empowering every Muslim with verified, intelligent guidance.
            </p>
            <div className="flex gap-3">
              {[
                { icon: '💬', href: 'https://wa.me/254112681600', label: 'WhatsApp' },
                { icon: '𝕏',  href: 'https://x.com/leonardlewa',  label: 'X (Twitter)' },
                { icon: '📸', href: 'https://instagram.com/leonardlewa', label: 'Instagram' },
                { icon: '💻', href: 'https://github.com/Mustafa-Leonard', label: 'GitHub' },
              ].map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-brand-600 border border-white/10 flex items-center justify-center text-sm transition-all hover:-translate-y-0.5"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-5">{section}</h4>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-white/60 hover:text-white text-sm transition-colors"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-white/40 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
            © {new Date().getFullYear()} DeenFlow — All Rights Reserved
          </div>
          <div className="flex items-center gap-2 text-white/40 text-xs italic" style={{ fontFamily: 'Inter, sans-serif' }}>
            "Seeking knowledge is an obligation upon every Muslim" — Prophet Muhammad ﷺ
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── Main Landing Page ────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen font-sans">
      <LandingNavbar />
      <HeroSection />
      <CommunitySection />
      <MissionSection />
      <PrayerTimesSection />
      <AIScholarSection />
      <TestimonialsSection />
      <LandingFooter />
    </div>
  )
}
