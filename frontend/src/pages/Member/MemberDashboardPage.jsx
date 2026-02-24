import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../../contexts/AuthContext'
import api from '../../api'

export default function MemberDashboardPage() {
    const navigate = useNavigate()
    const { user } = useContext(AuthContext)
    const [stats, setStats] = useState({
        totalQuestions: 0,
        savedItems: 0,
        learningProgress: 0,
        communityParticipation: 0
    })
    const [recentQuestions, setRecentQuestions] = useState([])
    const [suggestedTopics, setSuggestedTopics] = useState([])
    const [dailyAyah, setDailyAyah] = useState(null)
    const [extras, setExtras] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            const res = await api.get('/auth/member/dashboard-overview/')
            const data = res.data

            setStats(data.stats)
            setRecentQuestions(data.questions)
            setSuggestedTopics(data.topics)
            setDailyAyah(data.ayah)
            setExtras(data.extras)
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-700 border-t-brand-600 rounded-full animate-spin mb-4"></div>
                <div className="text-slate-500 dark:text-slate-400 font-medium">Loading your personal dashboard...</div>
            </div>
        )
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 p-8 md:p-12 text-white shadow-2xl shadow-brand-900/20">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl mix-blend-overlay"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl mix-blend-overlay"></div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tight">
                            As-salamu alaykum, {user?.full_name?.split(' ')[0] || user?.username}! 👋
                        </h1>
                        <p className="text-brand-50 text-lg md:text-xl max-w-2xl font-medium leading-relaxed opacity-90">
                            Welcome back to your journey of knowledge. Explore AI guidance, track your progress, and connect with the community.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/app/ask-ai')}
                        className="flex-shrink-0 px-8 py-4 bg-white text-brand-700 rounded-2xl font-bold hover:bg-brand-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 active:scale-95 group"
                    >
                        <span className="flex items-center gap-2">
                            <span>Ask a Question</span>
                            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </span>
                    </button>
                </div>
            </div>

            {/* Daily Ayah Widget */}
            {dailyAyah && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-black/20 group hover:border-brand-200 dark:hover:border-brand-900/50 transition-colors">
                    <div className="p-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                    <div className="p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-3xl shadow-sm text-emerald-600 dark:text-emerald-400">
                                📖
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Ayah of the Day</h2>
                                <p className="text-slate-500 dark:text-slate-400 font-medium">Daily spiritual reflection</p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="text-center md:text-right">
                                <p className="text-3xl md:text-4xl font-arabic text-slate-900 dark:text-white leading-loose" dir="rtl">
                                    {dailyAyah.arabic || "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"}
                                </p>
                            </div>
                            <div className="relative pl-6 border-l-4 border-emerald-500/30 dark:border-emerald-500/50">
                                <p className="text-lg text-slate-700 dark:text-slate-300 italic font-medium leading-relaxed">
                                    "{dailyAyah.translation || 'In the name of Allah, the Most Gracious, the Most Merciful'}"
                                </p>
                            </div>
                            <div className="flex justify-end">
                                <span className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-bold tracking-wide uppercase">
                                    {dailyAyah.reference || 'Quran 1:1'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Salah Streak"
                    value={`${stats.salahStreak} Days`}
                    icon="streak"
                    customIcon={<span className="text-2xl">🔥</span>}
                    color="orange"
                    onClick={() => navigate('/app/tracker')}
                />
                <StatsCard
                    title="Questions"
                    value={stats.totalQuestions}
                    icon="💬"
                    color="blue"
                    onClick={() => navigate('/app/my-questions')}
                />
                <StatsCard
                    title="Saved Items"
                    value={stats.savedItems}
                    icon="fp"
                    customIcon={<span className="text-2xl">🔖</span>}
                    color="purple"
                    onClick={() => navigate('/app/saved')}
                />
                <StatsCard
                    title="Spirit Score"
                    value={`${stats.learningProgress}%`}
                    icon="books"
                    customIcon={<span className="text-2xl">✨</span>}
                    color="green"
                    onClick={() => navigate('/app/learning')}
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Questions */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-black/20">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="text-xl">🕒</span> Recent Activity
                            </h2>
                            <button
                                onClick={() => navigate('/app/my-questions')}
                                className="text-sm font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
                            >
                                View All
                            </button>
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {recentQuestions.length === 0 ? (
                                <div className="p-16 text-center flex flex-col items-center">
                                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 text-4xl shadow-inner">
                                        🤔
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                        No questions yet
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm text-center">
                                        Start your learning journey by asking your first question to our AI scholar.
                                    </p>
                                    <button
                                        onClick={() => navigate('/app/ask-ai')}
                                        className="px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                    >
                                        Ask Your First Question
                                    </button>
                                </div>
                            ) : (
                                recentQuestions.slice(0, 5).map((question) => (
                                    <div
                                        key={question.id}
                                        className="p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                                        onClick={() => navigate(`/app/result/${question.id}`)}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0 text-2xl group-hover:scale-110 transition-transform duration-300">
                                                💬
                                            </div>
                                            <div className="flex-1 min-w-0 pt-1">
                                                <div className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                                                    {question.input_text}
                                                </div>
                                                <div className="flex items-center gap-3 mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        {new Date(question.created_at).toLocaleDateString()}
                                                    </span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                                                    <span className="capitalize px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-300">
                                                        {question.category || 'General'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="self-center">
                                                <svg className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-brand-500 dark:group-hover:text-brand-400 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Widgets */}
                <div className="space-y-8">
                    {/* Quick Ask Card */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-brand-800 to-brand-950 rounded-3xl p-8 text-white shadow-xl shadow-brand-900/30">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-3xl">⚡</span>
                                <h3 className="text-xl font-bold">Quick Ask</h3>
                            </div>
                            <p className="text-brand-200 mb-6 font-medium leading-relaxed">
                                Need immediate guidance? Get instant answers powered by authenticated Islamic sources.
                            </p>
                            <button
                                onClick={() => navigate('/app/ask-ai')}
                                className="w-full px-4 py-3.5 bg-white text-brand-900 rounded-xl font-bold hover:bg-brand-50 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                            >
                                <span>Ask Now</span>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </div>
                        {/* Abstract Shapes */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-500/20 rounded-full blur-2xl -ml-10 -mb-10"></div>
                    </div>

                    {/* Suggested Topics */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-sm">Suggested Topics</h3>
                        </div>
                        <div className="p-4 space-y-3">
                            {suggestedTopics.length === 0 ? (
                                <div className="text-center text-sm text-slate-500 dark:text-slate-400 py-6">
                                    No topic suggestions available at the moment.
                                </div>
                            ) : (
                                suggestedTopics.slice(0, 5).map((topic, index) => (
                                    <button
                                        key={index}
                                        onClick={() => navigate(`/app/learning?topic=${topic.slug}`)}
                                        className="w-full text-left p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all group border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300">
                                                {topic.icon || '📚'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                                                    {topic.name}
                                                </div>
                                                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                                    {topic.lessons_count || 0} lessons available
                                                </div>
                                            </div>
                                            <svg className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-brand-500 dark:group-hover:text-brand-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Continue Learning */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-sm">Continue Learning</h3>
                        </div>
                        <div className="p-6">
                            <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 mb-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">Introduction to Tafsir</h4>
                                    <span className="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 px-2 py-1 rounded-lg">60%</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-1 overflow-hidden">
                                    <div className="bg-brand-600 h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: '60%' }}></div>
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 text-right mt-1">3 lessons remaining</div>
                            </div>
                            <button
                                onClick={() => navigate('/app/learning')}
                                className="w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 hover:border-brand-200 dark:hover:border-brand-700 text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 rounded-xl font-bold transition-all text-sm"
                            >
                                Resume Course
                            </button>
                        </div>
                    </div>
                    {/* Social Impact Card */}
                    {import.meta.env.VITE_PAYMENTS_ENABLED === 'true' && extras && (
                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-sm">Social Impact</h3>
                                <div className="text-brand-600 dark:text-brand-400 font-bold text-sm">
                                    ${extras.walletBalance}
                                </div>
                            </div>
                            <div className="p-6">
                                {extras.featuredCampaign ? (
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Featured Goal</span>
                                                <span className="text-xs font-bold text-emerald-600">{extras.featuredCampaign.progress.toFixed(0)}%</span>
                                            </div>
                                            <div className="text-sm font-bold text-slate-900 dark:text-white mb-2">{extras.featuredCampaign.title}</div>
                                            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                                                <div className="bg-emerald-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${extras.featuredCampaign.progress}%` }}></div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => navigate('/app/donations')}
                                            className="w-full px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-xl font-bold transition-all text-sm hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
                                        >
                                            Automate Zakat
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <p className="text-sm text-slate-500 mb-4">No active campaigns.</p>
                                        <button
                                            onClick={() => navigate('/app/donations')}
                                            className="text-brand-600 text-sm font-bold hover:underline"
                                        >
                                            Explore Campaigns
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div >
    )
}

function StatsCard({ title, value, icon, customIcon, color, onClick }) {
    const colorStyles = {
        blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 ring-blue-100 dark:ring-blue-900/30',
        purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 ring-purple-100 dark:ring-purple-900/30',
        green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 ring-green-100 dark:ring-green-900/30',
        orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 ring-orange-100 dark:ring-orange-900/30'
    }

    const hoverStyles = {
        blue: 'group-hover:ring-blue-200 dark:group-hover:ring-blue-800',
        purple: 'group-hover:ring-purple-200 dark:group-hover:ring-purple-800',
        green: 'group-hover:ring-green-200 dark:group-hover:ring-green-800',
        orange: 'group-hover:ring-orange-200 dark:group-hover:ring-orange-800'
    }

    return (
        <div
            onClick={onClick}
            className={`bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/20 transition-all cursor-pointer group relative overflow-hidden`}
        >
            <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl ${colorStyles[color]} flex items-center justify-center text-2xl transition-all duration-300 ring-4 ring-offset-2 dark:ring-offset-slate-900 ${hoverStyles[color]} group-hover:scale-110`}>
                        {customIcon || icon}
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity -mr-2 -mt-2">
                        <svg className="w-5 h-5 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </div>
                </div>
                <div className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-1 tracking-tight">
                    {value}
                </div>
                <div className="text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">
                    {title}
                </div>
            </div>
        </div>
    )
}
