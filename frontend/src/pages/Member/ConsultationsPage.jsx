import React, { useState, useEffect } from 'react'
import api from '../../api'
import { 
  User, 
  Star, 
  ShieldCheck, 
  Clock, 
  CreditCard, 
  Calendar, 
  ArrowRight, 
  X, 
  MessagesSquare, 
  Search, 
  Filter, 
  Video, 
  GraduationCap,
  History,
  Sparkles
} from 'lucide-react'

export default function ConsultationsPage() {
    const [scholars, setScholars] = useState([])
    const [sessions, setSessions] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeView, setActiveView] = useState('browse') // 'browse' or 'sessions'

    useEffect(() => {
        if (import.meta.env.VITE_PAYMENTS_ENABLED !== 'true') {
            window.location.href = '/app/dashboard'
        }
    }, [])
    
    const [selectedScholar, setSelectedScholar] = useState(null)
    const [showBooking, setShowBooking] = useState(false)
    const [bookingData, setBookingData] = useState({
        scheduled_at: '',
        topic: '',
        notes: ''
    })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [sRes, sessRes] = await Promise.all([
                api.get('/consultation/scholars/'),
                api.get('/consultation/sessions/')
            ])
            setScholars(sRes.data)
            setSessions(sessRes.data)
        } catch (error) {
            console.error('Failed to fetch consultation data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleBookSession = async () => {
        try {
            await api.post('/consultation/sessions/', {
                scholar: selectedScholar.id,
                ...bookingData
            })
            setShowBooking(false)
            setBookingData({ scheduled_at: '', topic: '', notes: '' })
            fetchData()
            // Success notification in a real app
        } catch (error) {
            alert('Failed to book session. Please check your data.')
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <div className="w-10 h-10 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin mb-4"></div>
                <div className="text-slate-500 font-medium text-sm">Connecting to scholars network...</div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-24 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 py-4 px-2">
                <div>
                    <div className="flex items-center gap-2 text-brand-600 font-bold text-xs uppercase tracking-[0.2em] mb-2">
                        <GraduationCap className="w-4 h-4" />
                        Traditional Wisdom
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
                        Scholar <span className="text-brand-600">Consultation</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-4 text-lg font-medium max-w-2xl">
                        Direct access to verified traditional knowledge and fatwa guidance from globally recognized experts.
                    </p>
                </div>

                <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl shadow-inner border border-slate-200 dark:border-slate-800 self-start lg:self-auto translate-y-[-4px]">
                    <button 
                        onClick={() => setActiveView('browse')}
                        className={`px-8 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeView === 'browse' ? 'bg-white dark:bg-slate-800 text-brand-600 shadow-elevated' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <Search className="w-4 h-4" />
                        Browse Scholars
                    </button>
                    <button 
                        onClick={() => setActiveView('sessions')}
                        className={`px-8 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeView === 'sessions' ? 'bg-white dark:bg-slate-800 text-brand-600 shadow-elevated' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <History className="w-4 h-4" />
                        My Sessions
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Main Content Area */}
                <div className="lg:col-span-3 space-y-8">
                    {activeView === 'browse' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {scholars.map(scholar => (
                                <div
                                    key={scholar.id}
                                    className="deen-card group p-8 hover:border-brand-500 transition-all duration-500 cursor-default"
                                >
                                    <div className="flex items-start gap-6 mb-8">
                                        <div className="w-24 h-24 rounded-[2rem] bg-slate-50 dark:bg-slate-800 overflow-hidden flex-shrink-0 border-4 border-slate-50 dark:border-slate-800 shadow-2xl relative group-hover:scale-105 transition-transform">
                                            {scholar.profile_picture ? (
                                                <img src={scholar.profile_picture} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-3xl font-bold bg-brand-50 text-brand-600 font-display">
                                                  {scholar.full_name.charAt(0)}
                                                </div>
                                            )}
                                            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-brand-600/10 islamic-accent"></div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors truncate">
                                                  {scholar.full_name}
                                                </h3>
                                                {scholar.is_verified && <ShieldCheck className="w-5 h-5 text-blue-500 fill-blue-500/10" />}
                                            </div>
                                            
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {scholar.specializations.map(s => (
                                                    <span key={s.id} className="text-[9px] font-bold uppercase tracking-widest bg-brand-50/50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 px-3 py-1 rounded-full border border-brand-100/50 dark:border-brand-900/30">
                                                      {s.name}
                                                    </span>
                                                ))}
                                            </div>
                                            
                                            <div className="flex items-center gap-1 text-amber-500">
                                                <Star className="w-4 h-4 fill-current" />
                                                <span className="text-sm font-bold text-slate-900 dark:text-white ml-1">{scholar.rating.toFixed(1)}</span>
                                                <span className="text-xs text-slate-400 font-medium ml-1">(48 reviews)</span>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-slate-500 dark:text-slate-400 text-base font-serif italic mb-8 leading-relaxed line-clamp-2 h-12">
                                        "{scholar.bio}"
                                    </p>

                                    <div className="flex items-center justify-between pt-8 border-t border-slate-50 dark:border-slate-800/50">
                                        <div>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Standard Rate</span>
                                            <span className="text-2xl font-display font-bold text-brand-600">${scholar.hourly_rate}<span className="text-sm text-slate-400 font-medium tracking-normal">/hr</span></span>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setSelectedScholar(scholar)
                                                setShowBooking(true)
                                            }}
                                            className="btn-primary group/btn px-8 py-3.5 flex items-center gap-2 shadow-xl shadow-brand-600/20 active:scale-95"
                                        >
                                            Book Now
                                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {sessions.length > 0 ? (
                                sessions.map(session => (
                                    <div key={session.id} className="deen-card p-8 flex items-center justify-between group hover:border-brand-300 transition-all">
                                        <div className="flex items-center gap-8">
                                            <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-2xl shadow-inner border border-slate-100 dark:border-slate-800">
                                              {session.status === 'confirmed' ? <Video className="w-8 h-8 text-emerald-500" /> : <Clock className="w-8 h-8 text-amber-500" />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">Session with {session.scholar_name}</h4>
                                                  <SessionStatusBadge status={session.status} />
                                                </div>
                                                <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-500">
                                                    <span className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4" />
                                                        {new Date(session.scheduled_at).toLocaleDateString()} at {new Date(session.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    <span className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4" />
                                                        30 Minutes
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="px-6 py-3 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-slate-600 dark:text-slate-300 font-bold text-sm hover:border-brand-500 hover:text-brand-600 transition-all">
                                          View Details
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="deen-card p-24 text-center border-2 border-dashed border-slate-100 bg-transparent flex flex-col items-center">
                                    <Clock className="w-16 h-16 text-slate-200 mb-8" />
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">No Sessions Yet</h3>
                                    <p className="text-slate-500 max-w-sm">You haven't booked any consultations yet. Browse our scholars to begin your first session.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    <div className="deen-card p-10 bg-brand-900 text-white overflow-hidden relative group">
                        <div className="absolute inset-0 bg-brand-600/10 islamic-accent opacity-50 group-hover:opacity-70 transition-opacity"></div>
                        <div className="absolute -right-16 -top-16 w-56 h-56 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
                        
                        <div className="relative z-10">
                            <h3 className="text-2xl font-display font-bold mb-6">Traditional Advisory</h3>
                            <p className="text-brand-200 text-base leading-relaxed mb-10 font-medium">
                                Our board represents the major classical schools of thought (Hanafi, Shafi'i, Maliki, Hanbali), ensuring guidance aligned with your specific practice.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                               <SidebarInfoCard label="Experts" val="45+" />
                               <SidebarInfoCard label="Schools" val="4" />
                            </div>
                        </div>
                    </div>

                    <div className="deen-card p-8">
                        <div className="flex items-center gap-3 mb-6">
                          <MessagesSquare className="w-5 h-5 text-brand-600" />
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Confidentiality Guard</h3>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-6">
                            All sessions are end-to-end encrypted and strictly private between you and the scholar. No records are kept without your manual authorization.
                        </p>
                        <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                          <ShieldCheck className="w-6 h-6 text-brand-600 flex-shrink-0" />
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enterprise Grade Security</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            {showBooking && selectedScholar && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowBooking(false)}></div>
                    <div className="w-full max-w-xl bg-white dark:bg-slate-900 border-0 shadow-2xl rounded-[3rem] p-10 md:p-12 relative z-10 animate-in zoom-in-95 duration-500">
                        <div className="flex justify-between items-start mb-10">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white flex items-center justify-center shadow-xl shadow-brand-600/30">
                                    <Video className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-display font-bold text-slate-900 dark:text-white leading-tight">Request Consultation</h3>
                                    <p className="text-slate-500 font-medium mt-1">Video session with <span className="text-brand-600 font-bold">{selectedScholar.full_name}</span></p>
                                </div>
                            </div>
                            <button 
                              onClick={() => setShowBooking(false)} 
                              className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all hover:rotate-90 duration-300"
                            >
                              <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] uppercase font-bold text-slate-400 tracking-[0.2em] ml-2">
                                  <Sparkles className="w-3 h-3 text-brand-600" />
                                  Core Topic of Inquiry
                                </label>
                                <input
                                    type="text"
                                    value={bookingData.topic}
                                    onChange={e => setBookingData({ ...bookingData, topic: e.target.value })}
                                    placeholder="e.g., Zakat on crypto-assets or family inheritance matters"
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-[2rem] outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 font-bold text-lg shadow-sm transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-[10px] uppercase font-bold text-slate-400 tracking-[0.2em] ml-2">
                                      <Calendar className="w-3 h-3 text-brand-600" />
                                      Scheduled At
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={bookingData.scheduled_at}
                                        onChange={e => setBookingData({ ...bookingData, scheduled_at: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 font-bold text-sm shadow-sm transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-[10px] uppercase font-bold text-slate-400 tracking-[0.2em] ml-2">
                                      <Clock className="w-3 h-3 text-brand-600" />
                                      Standard Window
                                    </label>
                                    <div className="w-full bg-slate-100 dark:bg-slate-800 p-5 rounded-2xl font-bold text-sm flex items-center justify-between opacity-80">
                                      <span>30 Minutes</span>
                                      <Lock className="w-4 h-4 text-slate-400" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] uppercase font-bold text-slate-400 tracking-[0.2em] ml-2">
                                  <MessagesSquare className="w-3 h-3 text-brand-600" />
                                  Additional Context (Strictly Private)
                                </label>
                                <textarea
                                    rows="4"
                                    value={bookingData.notes}
                                    onChange={e => setBookingData({ ...bookingData, notes: e.target.value })}
                                    placeholder="Briefly explain the context for the scholar to prepare..."
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-[2rem] outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 font-medium resize-none shadow-sm transition-all text-base"
                                ></textarea>
                            </div>

                            <div className="pt-6 relative">
                                <button
                                    onClick={handleBookSession}
                                    className="w-full bg-brand-600 hover:bg-brand-700 text-white py-6 rounded-[2rem] font-bold transition-all shadow-2xl shadow-brand-600/30 flex items-center justify-center gap-3 active:scale-[0.98] group"
                                >
                                    <CreditCard className="w-5 h-5" />
                                    <span>Confirm Request • ${selectedScholar.hourly_rate / 2}</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <p className="text-[10px] text-center text-slate-500 font-bold tracking-widest uppercase mt-6 opacity-60">
                                    Secure Payments Held in Escrow • Zero Processing Fees
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function SidebarInfoCard({ label, val }) {
  return (
    <div className="p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 flex flex-col items-center">
      <div className="text-2xl font-display font-bold text-brand-300">{val}</div>
      <div className="text-[9px] font-bold text-white/50 uppercase tracking-widest">{label}</div>
    </div>
  )
}

function SessionStatusBadge({ status }) {
  const configs = {
    confirmed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-100',
    pending: 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-100'
  }
  
  return (
    <span className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border ${configs[status] || configs.pending}`}>
      {status}
    </span>
  )
}
