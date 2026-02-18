import React, { useEffect, useState } from 'react'
import api from '../../api'

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        questionsToday: 0,
        pendingReviews: 0,
        flaggedAIAnswers: 0
    })
    const [recentActivity, setRecentActivity] = useState([])
    const [pendingReviews, setPendingReviews] = useState([])
    const [topTopics, setTopTopics] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            const [statsRes, activityRes, reviewsRes, topicsRes] = await Promise.all([
                api.get('/auth/admin/dashboard/stats/'),
                api.get('/auth/admin/dashboard/recent-activity/'),
                api.get('/auth/admin/dashboard/pending-reviews/'),
                api.get('/auth/admin/dashboard/top-topics/')
            ])

            setStats(statsRes.data)
            setRecentActivity(activityRes.data)
            setPendingReviews(reviewsRes.data)
            setTopTopics(topicsRes.data)
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="relative w-16 h-16">
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-brand-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                        Dashboard Overview
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        Real-time insights for your DeenFlow platform
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-medium shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm">
                        Download Report
                    </button>
                    <button className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-medium shadow-lg shadow-brand-600/20 transition-all active:scale-95 text-sm">
                        System Health
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon="👥"
                    trend="+12%"
                    trendUp={true}
                    color="blue"
                />
                <StatsCard
                    title="Questions Today"
                    value={stats.questionsToday}
                    icon="💬"
                    trend="+5%"
                    trendUp={true}
                    color="brand"
                />
                <StatsCard
                    title="Pending Reviews"
                    value={stats.pendingReviews}
                    icon="⏳"
                    trend="-3%"
                    trendUp={false}
                    color="orange"
                />
                <StatsCard
                    title="Flagged AI Answers"
                    value={stats.flaggedAIAnswers}
                    icon="🚩"
                    trend="+2"
                    trendUp={false}
                    alert={stats.flaggedAIAnswers > 10}
                    color="red"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent AI Activity */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-black/20">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent AI Interactions</h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Live feed of user questions</p>
                            </div>
                            <button className="text-brand-600 dark:text-brand-400 text-sm font-bold hover:underline">View All</button>
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {recentActivity.length > 0 ? (
                                recentActivity.map((activity) => (
                                    <div key={activity.id} className="p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-900/20 dark:to-brand-800/20 flex items-center justify-center flex-shrink-0 text-brand-600 dark:text-brand-400 shadow-sm border border-brand-100 dark:border-brand-800/30">
                                                <span className="text-lg">🤖</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <div className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1 group-hover:text-brand-600 transition-colors">
                                                        {activity.question}
                                                    </div>
                                                    <span className="text-[10px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full whitespace-nowrap ml-2">
                                                        {activity.timestamp}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                                    <span className="flex items-center gap-1">
                                                        <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                                                        {activity.user}
                                                    </span>
                                                    {activity.flagged && (
                                                        <span className="flex items-center gap-1 text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-md font-medium border border-red-100 dark:border-red-900/30">
                                                            🚩 Flagged
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center text-slate-500 dark:text-slate-400">
                                    <div className="text-4xl mb-3 opacity-20">📊</div>
                                    No recent activity to display
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Widgets (Right Column) */}
                <div className="space-y-8">
                    {/* Pending Reviews */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-black/20">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-orange-50/50 to-transparent dark:from-orange-900/10">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Pending Reviews</h2>
                                <span className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 text-xs font-bold px-2 py-1 rounded-lg">
                                    {pendingReviews.length}
                                </span>
                            </div>
                        </div>
                        <div className="p-4 space-y-3">
                            {pendingReviews.length > 0 ? (
                                pendingReviews.map((review) => (
                                    <div key={review.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 hover:border-orange-200 dark:hover:border-orange-900/30 transition-colors cursor-pointer group">
                                        <div className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1 mb-1 group-hover:text-orange-600 transition-colors">
                                            {review.title}
                                        </div>
                                        <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
                                            <span>{review.author}</span>
                                            <span className="text-[10px] opacity-70">{review.date}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-3 text-xl">
                                        ✓
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">All caught up!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Most Searched Topics */}
                    <div className="bg-gradient-to-br from-brand-900 to-brand-800 rounded-3xl overflow-hidden shadow-xl text-white relative">
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>

                        <div className="p-6 border-b border-white/10 relative z-10">
                            <h2 className="text-lg font-bold">Trending Topics</h2>
                            <p className="text-xs text-brand-200 mt-1">Most queried subjects this week</p>
                        </div>
                        <div className="p-4 space-y-1 relative z-10">
                            {topTopics.length > 0 ? (
                                topTopics.map((topic, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group">
                                        <div className="flex items-center gap-4">
                                            <div className="font-bold text-brand-200 text-sm tabular-nums opacity-60 group-hover:opacity-100 group-hover:text-white transition-all">
                                                0{index + 1}
                                            </div>
                                            <span className="text-sm font-medium">{topic.name}</span>
                                        </div>
                                        <div className="text-xs font-bold bg-white/10 px-2 py-1 rounded-lg tabular-nums">
                                            {topic.count}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-sm text-brand-200 py-6">
                                    Collecting data...
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatsCard({ title, value, icon, trend, trendUp, alert, color }) {
    const colorStyles = {
        blue: {
            bg: 'from-blue-500/10 to-blue-600/5',
            iconBg: 'from-blue-500 to-blue-600',
            text: 'text-blue-600 dark:text-blue-400'
        },
        brand: {
            bg: 'from-brand-500/10 to-brand-600/5',
            iconBg: 'from-brand-500 to-brand-600',
            text: 'text-brand-600 dark:text-brand-400'
        },
        orange: {
            bg: 'from-orange-500/10 to-orange-600/5',
            iconBg: 'from-orange-500 to-orange-600',
            text: 'text-orange-600 dark:text-orange-400'
        },
        red: {
            bg: 'from-red-500/10 to-red-600/5',
            iconBg: 'from-red-500 to-red-600',
            text: 'text-red-600 dark:text-red-400'
        }
    }

    const style = colorStyles[color] || colorStyles.brand

    return (
        <div className={`bg-white dark:bg-slate-900 rounded-3xl border ${alert ? 'border-red-300 dark:border-red-800 ring-2 ring-red-500/20' : 'border-slate-200 dark:border-slate-800'} p-6 transition-all hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group`}>
            {/* Background Gradient Decoration */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${style.bg} rounded-bl-full opacity-50 transition-opacity group-hover:opacity-100`}></div>

            <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${style.iconBg} flex items-center justify-center text-2xl text-white shadow-lg shadow-brand-500/20 group-hover:scale-110 transition-transform duration-300`}>
                        {icon}
                    </div>
                    {trend && (
                        <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-full ${trendUp ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                            {trendUp ? '↗' : '↘'} {trend}
                        </div>
                    )}
                </div>
                <div>
                    <div className="text-4xl font-display font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                        {value.toLocaleString()}
                    </div>
                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {title}
                    </div>
                </div>
            </div>
        </div>
    )
}
