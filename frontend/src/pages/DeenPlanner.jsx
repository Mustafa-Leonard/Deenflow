import React, { useState, useEffect } from 'react'
import api from '../api'
import Card from '../components/Card'

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
            // API returns { prayers: ['Fajr', ...] }
            setLoggedPrayers(lResp.data.prayers || [])
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div className="p-20 text-center animate-pulse">Designing your growth path...</div>

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
                        Deen <span className="text-brand-600">Planner</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">
                        Personalized worship strategy & spiritual intelligence.
                    </p>
                </div>

                {analytics && (
                    <div className="flex items-center gap-4 p-4 bg-brand-600 text-white rounded-[2rem] shadow-xl shadow-brand-500/20">
                        <div className="text-3xl font-bold">{analytics.score}%</div>
                        <div className="text-xs font-bold uppercase tracking-widest opacity-80">Weekly Consistency</div>
                    </div>
                )}
            </div>

            {/* AI Insight Section */}
            {analytics?.insight && (
                <div className="p-8 bg-gradient-to-br from-indigo-600 to-brand-600 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-wider">AI Spiritual Insight</span>
                        </div>
                        <p className="text-xl font-medium leading-relaxed italic">"{analytics.insight}"</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Daily Tracker */}
                <Card className="lg:col-span-2 p-8 border-0 shadow-soft rounded-[2.5rem]">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                        <span className="w-1.5 h-8 bg-brand-600 rounded-full"></span>
                        Daily Worship Tracker
                    </h3>

                    <div className="space-y-4">
                        {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map(prayer => (
                            <div key={prayer} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-sm font-bold ${loggedPrayers.includes(prayer) ? 'bg-brand-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-400 group-hover:text-brand-600'}`}>
                                        {loggedPrayers.includes(prayer) ? '✓' : prayer.charAt(0)}
                                    </div>
                                    <span className={`font-bold ${loggedPrayers.includes(prayer) ? 'text-brand-600' : 'text-slate-900 dark:text-white'}`}>{prayer}</span>
                                </div>
                                <button
                                    disabled={loggedPrayers.includes(prayer)}
                                    onClick={() => handleLog(prayer)}
                                    className={`px-6 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${loggedPrayers.includes(prayer) ? 'bg-brand-50 text-brand-600 border-brand-100 cursor-default' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-brand-600 hover:text-white hover:border-brand-600'}`}
                                >
                                    {loggedPrayers.includes(prayer) ? 'Logged' : 'Log Prayer'}
                                </button>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Growth Goals */}
                <div className="space-y-6">
                    <Card className="p-8 border-0 shadow-soft rounded-[2.5rem] bg-slate-900 text-white">
                        <h3 className="text-xl font-bold mb-6">Active Goals</h3>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                                    <span>Quran Progress</span>
                                    <span>{plan?.quran_progress || 40}%</span>
                                </div>
                                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                    <div className="bg-brand-500 h-full w-[40%]"></div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                                    <span>Learning Paths</span>
                                    <span>{plan?.learning_progress || 65}%</span>
                                </div>
                                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                    <div className="bg-emerald-500 h-full w-[65%]"></div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-8 border-0 shadow-soft rounded-[2.5rem]">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Upcoming Reminders</h3>
                        <div className="space-y-4">
                            <div className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                                <div className="text-2xl">🌙</div>
                                <div>
                                    <div className="font-bold text-sm text-slate-900 dark:text-white">White Days Fasting</div>
                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Starting in 2 days</div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
