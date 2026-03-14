import React, { useState, useEffect, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import AuthContext from '../../contexts/AuthContext'
import api from '../../api'
import { 
  BookOpen, 
  MessageSquare, 
  Sparkles, 
  Clock, 
  ChevronRight, 
  Trophy, 
  Bookmark, 
  Zap,
  Star,
  LayoutDashboard,
  Calendar,
  ArrowRight
} from 'lucide-react'

export default function MemberDashboardPage() {
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()
    const [stats, setStats] = useState({
        salahStreak: 0,
        totalQuestions: 0,
        savedItems: 0,
        spiritScore: 0
    })
    const [recentQuestions, setRecentQuestions] = useState([])
    const [dailyAyah, setDailyAyah] = useState(null)
    const [suggestedTopics, setSuggestedTopics] = useState([])
    const [loading, setLoading] = useState(true)
    const [extras, setExtras] = useState(null)

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            const [overviewRes, topicsRes, extrasRes] = await Promise.all([
                api.get('/auth/dashboard/overview/'),
                api.get('/academy/topics/suggested/'),
                api.get('/auth/dashboard/extras/')
            ])

            setStats(overviewRes.data.stats)
            setRecentQuestions(overviewRes.data.recent_questions)
            setDailyAyah(overviewRes.data.daily_ayah)
            setSuggestedTopics(topicsRes.data)
            setExtras(extrasRes.data)
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <div className="w-10 h-10 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin mb-4"></div>
                <div className="text-slate-500 font-medium text-sm">Loading your dashboard...</div>
            </div>
        )
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-3xl p-8 md:p-12 text-white shadow-xl mosque-hero-bg">
                <div className="absolute inset-0 bg-brand-900/60 backdrop-blur-[2px]"></div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-xs font-bold tracking-wider uppercase mb-4">
                            <Sparkles className="w-3 h-3 text-brand-300" />
                            <span>Spiritual Journey</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tight leading-tight">
                            As-salamu alaykum, <span className="text-brand-300">{user?.full_name?.split(' ')[0] || user?.username}</span>!
                        </h1>
                        <p className="text-white/80 text-lg max-w-2xl leading-relaxed font-medium">
                            Welcome back to DeenFlow. Your personalized space for seeking knowledge, 
                            tracking your progress, and connecting with the community.
                        </p>
                    </div>
                    <div className="flex-shrink-0">
                        <button
                            onClick={() => navigate('/app/ask-ai')}
                            className="group flex items-center gap-3 px-8 py-4 bg-white text-brand-900 rounded-2xl font-bold hover:bg-brand-50 transition-all shadow-xl hover:-translate-y-1 active:translate-y-0"
                        >
                            <MessageSquare className="w-5 h-5 text-brand-600" />
                            <span>Seek Guidance</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Salah Streak"
                    value={`${stats.salahStreak} Days`}
                    icon={<Clock className="w-6 h-6" />}
                    color="amber"
                    onClick={() => navigate('/app/planner')}
                />
                <StatsCard
                    title="Total Questions"
                    value={stats.totalQuestions}
                    icon={<MessageSquare className="w-6 h-6" />}
                    color="brand"
                    onClick={() => navigate('/app/my-questions')}
                />
                <StatsCard
                    title="Saved Items"
                    value={stats.savedItems}
                    icon={<Bookmark className="w-6 h-6" />}
                    color="purple"
                    onClick={() => navigate('/app/saved')}
                />
                <StatsCard
                    title="Spirit Score"
                    value={stats.spiritScore}
                    icon={<Trophy className="w-6 h-6" />}
                    color="blue"
                    onClick={() => navigate('/app/activity')}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Ayah and Activity */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Daily Ayah */}
                    {dailyAyah && (
                        <div className="deen-card overflow-hidden group">
                            <div className="h-1.5 w-full bg-brand-500"></div>
                            <div className="p-8">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
                                        <BookOpen className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">Ayah of the Day</h2>
                                        <p className="text-slate-500 text-sm font-medium">Daily spiritual reflection</p>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <p className="text-3xl md:text-4xl font-arabic text-slate-900 dark:text-white leading-[1.8] text-right" dir="rtl">
                                        {dailyAyah.arabic}
                                    </p>
                                    <div className="relative pl-6 border-l-4 border-brand-200 dark:border-brand-900/40 py-1">
                                        <p className="text-lg text-slate-700 dark:text-slate-300 italic font-medium leading-relaxed">
                                            "{dailyAyah.translation}"
                                        </p>
                                    </div>
                                    <div className="flex justify-end">
                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl text-xs font-bold tracking-widest uppercase">
                                            <Sparkles className="w-3 h-3" />
                                            <span>{dailyAyah.reference}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Recent Activity */}
                    <div className="deen-card overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-brand-600" />
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Activity</h2>
                            </div>
                            <Link to="/app/my-questions" className="text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors">
                                View History
                            </Link>
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {recentQuestions.length === 0 ? (
                                <div className="p-16 text-center">
                                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <MessageSquare className="w-10 h-10 text-slate-300" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No activity yet</h3>
                                    <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs mx-auto">
                                        Start your journey by asking a question to our AI scholar.
                                    </p>
                                    <button
                                        onClick={() => navigate('/app/ask-ai')}
                                        className="btn-primary px-8"
                                    >
                                        Ask First Question
                                    </button>
                                </div>
                            ) : (
                                recentQuestions.map((q) => (
                                    <div
                                        key={q.id}
                                        onClick={() => navigate(`/app/result/${q.id}`)}
                                        className="p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                                                <MessageSquare className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-brand-600 transition-colors">
                                                    {q.input_text}
                                                </p>
                                                <div className="flex items-center gap-3 mt-1 text-xs font-semibold text-slate-500">
                                                    <span className="flex items-center gap-1 uppercase tracking-tighter">
                                                        {new Date(q.created_at).toLocaleDateString()}
                                                    </span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                                    <span className="text-brand-600 bg-brand-50 dark:bg-brand-900/20 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
                                                        {q.category || 'General'}
                                                    </span>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand-500 group-hover:translate-x-1 transition-all self-center" />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Widgets */}
                <div className="space-y-8">
                    {/* Quick Ask Widget */}
                    <div className="relative overflow-hidden rounded-3xl bg-brand-900 p-8 text-white shadow-xl islamic-accent">
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-brand-300 fill-brand-300" />
                                Quick Guidance
                            </h3>
                            <p className="text-brand-100 text-sm mb-6 leading-relaxed">
                                Get verified answers to your Islamic questions instantly.
                            </p>
                            <button
                                onClick={() => navigate('/app/ask-ai')}
                                className="w-full bg-white text-brand-900 py-3.5 rounded-xl font-bold hover:bg-brand-50 transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2"
                            >
                                Ask Question
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Suggested Topics */}
                    <div className="deen-card overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Recommended</h3>
                        </div>
                        <div className="p-4 space-y-2">
                            {suggestedTopics.map((topic) => (
                                <button
                                    key={topic.id}
                                    onClick={() => navigate(`/app/learning/${topic.slug}`)}
                                    className="w-full flex items-center gap-4 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all group"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl group-hover:scale-110 transition-all">
                                        {topic.icon || '📚'}
                                    </div>
                                    <div className="flex-1 text-left min-w-0">
                                        <div className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-brand-600 transition-colors">
                                            {topic.name}
                                        </div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                            {topic.lessons_count || 0} Lessons
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-500 transition-colors" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Learning Progress Widget */}
                    <div className="deen-card p-6">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-6">Learning Path</h3>
                        <div className="space-y-6">
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Intro to Tafsir</h4>
                                    <span className="text-xs font-bold text-brand-600">65%</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-brand-600 h-full rounded-full" style={{ width: '65%' }}></div>
                                </div>
                            </div>
                            <button className="w-full py-3 border-2 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl text-sm hover:border-brand-200 hover:text-brand-600 transition-all">
                                Continue Course
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatsCard({ title, value, icon, color, onClick }) {
    const colors = {
        amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
        brand: 'bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400',
        purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
        blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
    }

    return (
        <div 
            onClick={onClick}
            className="deen-card p-6 hover:shadow-elevated transition-all cursor-pointer group active:scale-[0.98]"
        >
            <div className={`w-12 h-12 rounded-xl ${colors[color]} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <div className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-1 tracking-tight">
                {value}
            </div>
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {title}
            </div>
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br transition-opacity opacity-0 group-hover:opacity-10 pointer-events-none ${
                color === 'amber' ? 'from-amber-400 to-transparent' :
                color === 'brand' ? 'from-brand-400 to-transparent' :
                color === 'purple' ? 'from-purple-400 to-transparent' :
                'from-blue-400 to-transparent'
            }`}></div>
        </div>
    )
}
