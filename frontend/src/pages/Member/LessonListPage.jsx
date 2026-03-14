import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../../api'
import AuthContext from '../../contexts/AuthContext'
import { 
  Lock, 
  Clock, 
  ArrowRight, 
  Check, 
  ChevronRight, 
  Info, 
  BookOpen, 
  User, 
  Target, 
  ListChecks, 
  ShieldCheck,
  ChevronLeft,
  Sparkles,
  Play
} from 'lucide-react'

export default function LessonListPage() {
    const { slug } = useParams()
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()
    const [path, setPath] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('Syllabus')

    const isPremiumUser = user?.subscription?.slug === 'premium' || user?.subscription?.slug === 'pro' || user?.is_staff

    useEffect(() => {
        api.get(`/learning/paths/${slug}/`)
            .then(res => {
                setPath(res.data)
                setLoading(false)
            })
            .catch(err => {
                console.error('Failed to load path:', err)
                setLoading(false)
            })
    }, [slug])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <div className="w-10 h-10 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin mb-4"></div>
                <div className="text-slate-500 font-medium text-sm">Retrieving academy syllabus...</div>
            </div>
        )
    }

    if (!path) {
        return (
            <div className="p-20 text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Path not found.</h2>
                <button onClick={() => navigate('/app/academy')} className="btn-primary px-8">Return to Academy</button>
            </div>
        )
    }

    const canAccessLessons = !path.is_premium || isPremiumUser

    return (
        <div className="max-w-6xl mx-auto py-8 px-6 pb-20 animate-in fade-in duration-700">
            {/* Header / Back */}
            <div className="flex items-center justify-between mb-8">
                <button 
                  onClick={() => navigate('/app/academy')}
                  className="flex items-center gap-2 text-slate-500 hover:text-brand-600 font-bold text-xs uppercase tracking-widest transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to Academy
                </button>
            </div>

            {/* Hero Section */}
            <div className="relative rounded-[3rem] overflow-hidden mb-12 shadow-2xl group mosque-hero-bg">
                <div className="absolute inset-0 bg-brand-900/70 backdrop-blur-[2px]"></div>
                
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none transition-transform group-hover:scale-110"></div>
                
                <div className="relative p-12 md:p-20 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                    <div className="max-w-3xl">
                        <div className="flex flex-wrap items-center gap-4 mb-8">
                            <span className="px-4 py-1.5 bg-brand-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full shadow-lg shadow-brand-600/20">
                                {path.difficulty || 'All Levels'}
                            </span>
                            {path.is_premium && (
                                <span className="px-4 py-1.5 bg-amber-500 text-brand-900 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full flex items-center gap-2 shadow-lg shadow-amber-500/20">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    Premium
                                </span>
                            )}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight tracking-tight">
                            {path.title}
                        </h1>
                        <p className="text-brand-100 text-xl leading-relaxed max-w-2xl font-serif italic">
                            {path.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* Access Restriction Banner */}
            {!canAccessLessons && (
                <div className="mb-12 p-8 rounded-[2.5rem] bg-amber-50 dark:bg-amber-950/10 border-2 border-amber-200/50 dark:border-amber-900/30 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
                    <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Lock className="w-24 h-24 text-amber-900" />
                    </div>
                    <div className="flex items-center gap-6 relative z-10 text-center md:text-left flex-1">
                        <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xl shadow-amber-500/30 flex-shrink-0">
                            <Lock className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100 mb-1">Premium Access Required</h3>
                            <p className="text-amber-800/60 dark:text-amber-400 text-sm font-medium">Upgrade to unlock this specialized path and all 150+ academic modules.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/app/upgrade')}
                        className="px-10 py-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-amber-500/30 active:scale-95 whitespace-nowrap relative z-10"
                    >
                        Unlock Academy
                    </button>
                </div>
            )}

            {/* Content Tabs & Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Fixed Left Syllabus/Tabs Navigation */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="flex flex-col gap-2 p-2 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                        <TabButton 
                          label="Syllabus" 
                          active={activeTab === 'Syllabus'} 
                          onClick={() => setActiveTab('Syllabus')}
                          icon={<ListChecks className="w-4 h-4" />}
                        />
                        <TabButton 
                          label="Learning Goals" 
                          active={activeTab === 'Learning Goals'} 
                          onClick={() => setActiveTab('Learning Goals')}
                          icon={<Target className="w-4 h-4" />}
                        />
                        <TabButton 
                          label="Instructor" 
                          active={activeTab === 'Overview'} 
                          onClick={() => setActiveTab('Overview')}
                          icon={<User className="w-4 h-4" />}
                        />
                    </div>

                    {/* Stats Widget */}
                    <div className="deen-card p-6 bg-brand-900 text-white border-0 islamic-accent relative overflow-hidden group">
                        <Sparkles className="absolute top-4 right-4 w-12 h-12 text-white/10 group-hover:scale-110 transition-transform" />
                        <div className="relative z-10">
                          <div className="text-4xl font-display font-bold mb-1">{path.lessons?.length || 0}</div>
                          <div className="text-[10px] font-bold uppercase tracking-widest text-brand-300">Detailed Modules</div>
                          <div className="mt-6 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="bg-brand-400 h-full w-[0%] group-hover:w-[100%] transition-all duration-1000"></div>
                          </div>
                        </div>
                    </div>
                </div>

                {/* Right Content Area */}
                <div className="lg:col-span-3">
                    {activeTab === 'Syllabus' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                                <BookOpen className="w-6 h-6 text-brand-600" />
                                Course Modules
                            </h2>

                            <div className="grid gap-4">
                                {path.lessons?.map((lesson, index) => (
                                    <div
                                        key={lesson.id}
                                        onClick={() => canAccessLessons && navigate(`/app/lessons/${lesson.id}`)}
                                        className={`deen-card group flex items-center justify-between gap-6 p-6 transition-all duration-300 ${canAccessLessons
                                            ? 'cursor-pointer hover:border-brand-500 hover:shadow-elevated'
                                            : 'opacity-70 grayscale cursor-not-allowed'
                                            }`}
                                    >
                                        <div className="flex items-center gap-6 flex-1 min-w-0">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-display font-bold text-xl transition-all duration-500 flex-shrink-0 ${canAccessLessons
                                                ? 'bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-brand-600 group-hover:text-white shadow-sm'
                                                : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600'
                                                }`}>
                                                {String(lesson.order || index + 1).padStart(2, '0')}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors truncate">
                                                    {lesson.title}
                                                </h4>
                                                <div className="flex items-center gap-4 mt-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                    <span className="flex items-center gap-1.5">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        15 Minutes
                                                    </span>
                                                    {!canAccessLessons && (
                                                        <span className="flex items-center gap-1.5 text-amber-600 font-bold">
                                                            <Lock className="w-3.5 h-3.5" />
                                                            Locked
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {canAccessLessons ? (
                                                <div className="w-10 h-10 rounded-full border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-300 group-hover:bg-brand-50 group-hover:border-brand-100 group-hover:text-brand-600 transition-all">
                                                    <Play className="w-4 h-4 fill-current" />
                                                </div>
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-600">
                                                    <Lock className="w-4 h-4" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'Learning Goals' && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="p-8 bg-brand-50 dark:bg-brand-950/20 rounded-[2.5rem] border border-brand-100 dark:border-brand-950/50">
                                <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-3 mb-8">
                                    <Target className="w-6 h-6 text-brand-600" />
                                    Path Intentions
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[
                                        'Master core terminology and definitions',
                                        'Understand classical interpretations in modern contexts',
                                        'Apply jurisprudential principles to daily life',
                                        'Complete structured assessments after each module',
                                        'Gain foundational knowledge to proceed to advanced levels'
                                    ].map((goal, i) => (
                                        <div key={i} className="flex gap-5 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-transparent hover:border-brand-100 transition-all shadow-sm">
                                            <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5 shadow-lg shadow-emerald-500/20">
                                              <Check className="w-3.5 h-3.5" />
                                            </div>
                                            <span className="text-slate-700 dark:text-slate-300 font-bold leading-relaxed">{goal}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Overview' && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="deen-card p-10">
                                <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-8">Instructor Profile</h2>
                                <div className="flex flex-col md:flex-row items-start gap-10">
                                    <div className="w-32 h-32 rounded-[2.5rem] bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-4 border-white dark:border-slate-950 shadow-2xl flex-shrink-0 relative overflow-hidden">
                                        <User className="w-12 h-12 text-slate-300" />
                                        <div className="absolute inset-x-0 bottom-0 bg-brand-600/10 h-1/2 islamic-accent"></div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Sheikh Ahmed Al-Bakri</h3>
                                        <div className="text-brand-600 font-bold text-sm uppercase tracking-widest mb-6">Principal Academic Oversight</div>
                                        <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-10 italic font-serif">
                                          Expert in Classical Fiqh and contemporary Islamic finance, with over 15 years of academic leadership in cross-disciplinary Islamic studies.
                                        </p>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                          <InstructorStat label="Experience" value="15+ Years" />
                                          <InstructorStat label="Credentials" value="Ijazah Al-Alim" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function TabButton({ label, active, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all duration-300 ${
        active 
          ? 'bg-white dark:bg-slate-800 text-brand-600 shadow-elevated border border-slate-100 dark:border-slate-700' 
          : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
      }`}
    >
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${active ? 'bg-brand-50 dark:bg-brand-900/40 text-brand-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
        {icon}
      </div>
      {label}
    </button>
  )
}

function InstructorStat({ label, value }) {
  return (
    <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</div>
      <div className="text-base font-bold text-slate-900 dark:text-white">{value}</div>
    </div>
  )
}
