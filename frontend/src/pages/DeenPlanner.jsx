import React, { useState, useEffect } from 'react'
import api from '../api'
import { 
  Layout, 
  Activity, 
  Sparkles, 
  Check, 
  Clock, 
  Target, 
  ShieldCheck, 
  Calendar, 
  Zap, 
  TrendingUp, 
  Compass,
  ChevronRight,
  Sun,
  Moon,
  CloudSun,
  Sunrise,
  Sunset
} from 'lucide-react'

export default function DeenPlanner() {
    const [plan, setPlan] = useState(null)
    const [analytics, setAnalytics] = useState(null)
    const [loggedPrayers, setLoggedPrayers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    const handleLog = async (prayer) => {
        try {
            await api.post('/sis/log/', { category: `salah_${prayer.toLowerCase()}` })
            setLoggedPrayers([...loggedPrayers, prayer])
        } catch (error) {
            console.error('Failed to log prayer:', error)
        }
    }

    const fetchData = async () => {
        try {
            const [pResp, aResp, lResp] = await Promise.all([
                api.get('/sis/plan/'),
                api.get('/sis/analytics/summary/'),
                api.get('/sis/log/')
            ])
            setPlan(pResp.data)
            setAnalytics(aResp.data)
            setLoggedPrayers(lResp.data.prayers || [])
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <div className="w-10 h-10 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin mb-4"></div>
                <div className="text-slate-500 font-medium text-sm">Designing your growth path...</div>
            </div>
        )
    }

    const prayerIcons = {
        Fajr: <Sunrise className="w-5 h-5" />,
        Dhuhr: <Sun className="w-5 h-5" />,
        Asr: <CloudSun className="w-5 h-5" />,
        Maghrib: <Sunset className="w-5 h-5" />,
        Isha: <Moon className="w-5 h-5" />
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 py-4">
                <div>
                    <div className="flex items-center gap-2 text-brand-600 font-bold text-xs uppercase tracking-[0.2em] mb-2">
                        <Compass className="w-4 h-4" />
                        Spiritual Intelligence
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
                        Deen <span className="text-brand-600">Planner</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg font-medium max-w-xl leading-relaxed">
                        Personalized worship strategy & AI-driven spiritual intelligence tracking your daily growth.
                    </p>
                </div>

                {analytics && (
                    <div className="relative overflow-hidden p-8 bg-brand-900 text-white rounded-[2.5rem] shadow-2xl flex items-center gap-6 group">
                        <div className="absolute inset-0 bg-brand-600/20 islamic-accent opacity-50"></div>
                        <div className="relative z-10 flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                                <TrendingUp className="w-8 h-8 text-brand-300" />
                            </div>
                            <div>
                                <div className="text-4xl font-display font-bold">{analytics.score}%</div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-brand-300">Consistency Score</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* AI Insight Section */}
            {analytics?.insight && (
                <div className="deen-card p-10 bg-gradient-to-br from-brand-700 to-indigo-900 text-white border-0 shadow-2xl relative overflow-hidden group">
                    <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/5 rounded-full blur-3xl transition-transform group-hover:scale-110"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="w-16 h-16 flex-shrink-0 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                            <Sparkles className="w-8 h-8 text-brand-300" />
                        </div>
                        <div className="flex-1">
                            <div className="text-[10px] uppercase font-bold tracking-[0.3em] text-brand-300 mb-2">Weekly Spiritual Guidance</div>
                            <p className="text-xl md:text-2xl font-medium leading-relaxed italic font-serif">
                              "{analytics.insight}"
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Tracker Column */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="deen-card overflow-hidden">
                        <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/40 flex items-center justify-center text-brand-600 border border-brand-100 dark:border-brand-900/30">
                                    <Activity className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Daily Worship</h3>
                                    <p className="text-xs text-slate-500 font-medium">Track your mandatory prayers</p>
                                </div>
                            </div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl">
                                Today
                            </div>
                        </div>

                        <div className="p-4 md:p-8 space-y-4">
                            {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map(prayer => (
                                <div 
                                    key={prayer} 
                                    className={`flex items-center justify-between p-5 rounded-3xl transition-all duration-300 border-2 ${loggedPrayers.includes(prayer) 
                                        ? 'bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/40' 
                                        : 'bg-slate-50 dark:bg-slate-900 border-transparent hover:border-slate-200 dark:hover:border-slate-800 group'}`}
                                >
                                    <div className="flex items-center gap-5">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${loggedPrayers.includes(prayer) 
                                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30' 
                                            : 'bg-white dark:bg-slate-800 text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-600 shadow-sm'}`}>
                                            {loggedPrayers.includes(prayer) ? <Check className="w-6 h-6" /> : prayerIcons[prayer]}
                                        </div>
                                        <div>
                                          <span className={`text-lg font-bold block ${loggedPrayers.includes(prayer) ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                                            {prayer}
                                          </span>
                                          {!loggedPrayers.includes(prayer) && (
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Mandatory</span>
                                          )}
                                        </div>
                                    </div>
                                    <button
                                        disabled={loggedPrayers.includes(prayer)}
                                        onClick={() => handleLog(prayer)}
                                        className={`px-8 py-3 rounded-2xl text-xs font-bold transition-all ${loggedPrayers.includes(prayer) 
                                            ? 'text-emerald-600 font-bold' 
                                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-brand-600 hover:text-white shadow-elevated border border-slate-100 dark:border-slate-700 active:scale-95'}`}
                                    >
                                        {loggedPrayers.includes(prayer) ? 'Completed' : 'Log Prayer'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-8">
                    {/* Active Goals */}
                    <div className="deen-card p-8 bg-slate-900 text-white overflow-hidden relative group">
                        <div className="absolute inset-0 bg-brand-600/5 islamic-accent pointer-events-none"></div>
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                                <Target className="w-5 h-5 text-brand-400" />
                                Active Goals
                            </h3>
                            <div className="space-y-8">
                                <GoalItem 
                                    label="Quran Progress" 
                                    progress={plan?.quran_progress || 42} 
                                    color="brand"
                                />
                                <GoalItem 
                                    label="Learning Paths" 
                                    progress={plan?.learning_progress || 68} 
                                    color="blue"
                                />
                                <GoalItem 
                                    label="Dhikr Count" 
                                    progress={85} 
                                    color="amber"
                                />
                            </div>
                            <button className="w-full mt-10 py-4 bg-white/10 hover:bg-white/15 text-brand-300 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all border border-white/5">
                                Refine My Strategy
                            </button>
                        </div>
                    </div>

                    {/* Upcoming Rituals */}
                    <div className="deen-card p-8">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                           <Calendar className="w-4 h-4 text-brand-600" />
                           Ritual Calendar
                        </h3>
                        <div className="space-y-4">
                            <div className="group flex gap-5 p-5 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-transparent hover:border-slate-100 dark:hover:border-slate-800 transition-all cursor-pointer">
                                <div className="w-12 h-12 flex-shrink-0 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                                  🌙
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">White Days Fasting</div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Starting in 2 days</div>
                                </div>
                            </div>
                            
                            <div className="group flex gap-5 p-5 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-transparent hover:border-slate-100 dark:hover:border-slate-800 transition-all cursor-pointer">
                                <div className="w-12 h-12 flex-shrink-0 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                                  📿
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">Tahajjud Target</div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Tonight at 3:30 AM</div>
                                </div>
                            </div>
                        </div>
                        <button className="w-full mt-6 py-3 text-xs font-bold text-slate-400 hover:text-brand-600 transition-colors uppercase tracking-widest flex items-center justify-center gap-2">
                            View Calendar
                            <ChevronRight className="w-3 h-3" />
                        </button>
                    </div>

                    {/* Security Badge */}
                    <div className="p-6 bg-brand-50 dark:bg-brand-950/20 rounded-[2rem] border border-brand-100 dark:border-brand-900/30 flex gap-4">
                        <ShieldCheck className="w-6 h-6 text-brand-600 flex-shrink-0" />
                        <p className="text-[11px] text-brand-800 dark:text-brand-200 font-medium leading-relaxed">
                          Your spiritual data is end-to-end encrypted and never shared. This is your private sanctuary.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function GoalItem({ label, progress, color }) {
    const colorClasses = {
        brand: 'bg-brand-500',
        blue: 'bg-blue-500',
        amber: 'bg-amber-500'
    }

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-end">
                <span className="text-sm font-bold text-slate-200">{label}</span>
                <span className="text-xs font-bold text-brand-300 tabular-nums">{progress}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden p-0.5">
                <div 
                    className={`${colorClasses[color]} h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(72,192,143,0.3)]`} 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    )
}
