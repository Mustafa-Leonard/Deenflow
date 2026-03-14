import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../api'
import { 
  Users, 
  MessageSquare, 
  Clock, 
  AlertTriangle, 
  Activity, 
  ChevronRight, 
  TrendingUp, 
  Search,
  FileText,
  ShieldCheck,
  Zap,
  BarChart3
} from 'lucide-react'

export default function AdminDashboardPage() {
    const navigate = useNavigate()
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
            const res = await api.get('/auth/admin/dashboard/overview/')
            const data = res.data
            setStats(data.stats)
            setRecentActivity(data.activity)
            setPendingReviews(data.reviews)
            setTopTopics(data.topics)
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDownloadReport = async () => {
        try {
            const response = await api.get('/auth/admin/dashboard/export/', {
                responseType: 'blob'
            })
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `deenflow-report-${new Date().toISOString().split('T')[0]}.csv`)
            document.body.appendChild(link)
            link.click()
            link.remove()
        } catch (error) {
            console.error('Failed to download report:', error)
            alert('Failed to generate report')
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="w-10 h-10 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
                <div>
                    <div className="flex items-center gap-2 text-brand-600 font-bold text-xs uppercase tracking-[0.2em] mb-2">
                      <ShieldCheck className="w-4 h-4" />
                      Admin Control Center
                    </div>
                    <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
                        Dashboard Overview
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleDownloadReport}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-all text-sm shadow-sm"
                    >
                        <FileText className="w-4 h-4" />
                        Export Data
                    </button>
                    <button
                        onClick={() => navigate('/admin/analytics')}
                        className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2"
                    >
                        <BarChart3 className="w-4 h-4" />
                        Analytics
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <AdminStatsCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={<Users className="w-6 h-6" />}
                    trend="+12%"
                    trendUp={true}
                    color="blue"
                    onClick={() => navigate('/admin/users')}
                />
                <AdminStatsCard
                    title="Queries Today"
                    value={stats.questionsToday}
                    icon={<MessageSquare className="w-6 h-6" />}
                    trend="+5%"
                    trendUp={true}
                    color="brand"
                    onClick={() => navigate('/admin/questions')}
                />
                <AdminStatsCard
                    title="Needs Review"
                    value={stats.pendingReviews}
                    icon={<Clock className="w-6 h-6" />}
                    trend="-2"
                    trendUp={true}
                    color="amber"
                    onClick={() => navigate('/admin/reviews')}
                />
                <AdminStatsCard
                    title="Flagged Answers"
                    value={stats.flaggedAIAnswers}
                    icon={<AlertTriangle className="w-6 h-6" />}
                    trend="+0"
                    trendUp={false}
                    color="rose"
                    onClick={() => navigate('/admin/answers?flagged=true')}
                />
            </div>

            {/* Content Body */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity Feed */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="deen-card overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-800/20">
                            <div className="flex items-center gap-3">
                                <Activity className="w-5 h-5 text-brand-600" />
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">AI Interaction Feed</h2>
                            </div>
                            <Link to="/admin/ai/logs" className="text-sm font-bold text-brand-600 hover:underline">
                                View Logs
                            </Link>
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {recentActivity.length === 0 ? (
                                <div className="p-12 text-center text-slate-400 font-medium">
                                    No recent activity found.
                                </div>
                            ) : (
                                recentActivity.map((activity) => (
                                    <div
                                        key={activity.id}
                                        onClick={() => navigate(`/admin/ai/review/${activity.id}`)}
                                        className="p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                                                <Zap className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-brand-600 transition-colors">
                                                        {activity.question}
                                                    </p>
                                                    <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap ml-4">
                                                        {activity.timestamp}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                                                    <span className="uppercase">{activity.user}</span>
                                                    {activity.flagged && (
                                                      <span className="flex items-center gap-1 text-rose-600 bg-rose-50 dark:bg-rose-900/20 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold">
                                                        <AlertTriangle className="w-3 h-3" />
                                                        Flagged
                                                      </span>
                                                    )}
                                                </div>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand-500 transition-all self-center" />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Widgets */}
                <div className="space-y-8">
                    {/* Pending Moderation */}
                    <div className="deen-card p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Pending Review</h3>
                            <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 text-[10px] font-bold px-2 py-0.5 rounded-lg">
                                {pendingReviews.length} Tasks
                            </span>
                        </div>
                        <div className="space-y-3">
                            {pendingReviews.slice(0, 4).map((review) => (
                                <div 
                                    key={review.id}
                                    onClick={() => navigate(`/admin/reviews/${review.id}`)}
                                    className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50 hover:border-brand-200 transition-all cursor-pointer group"
                                >
                                    <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 mb-1 group-hover:text-brand-600 transition-colors">
                                        {review.title}
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase">
                                        <span>{review.author}</span>
                                        <span>{review.date}</span>
                                    </div>
                                </div>
                            ))}
                            <button 
                                onClick={() => navigate('/admin/reviews')}
                                className="w-full py-3 text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors uppercase tracking-widest mt-2"
                            >
                                View All Queue
                            </button>
                        </div>
                    </div>

                    {/* Trending Topics */}
                    <div className="deen-card p-6 bg-brand-900 text-white border-0 islamic-accent">
                        <div className="flex items-center gap-2 mb-6">
                          <TrendingUp className="w-5 h-5 text-brand-300" />
                          <h3 className="text-sm font-bold uppercase tracking-widest">Trending Topics</h3>
                        </div>
                        <div className="space-y-4">
                            {topTopics.map((topic, idx) => (
                                <div key={idx} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-brand-400 tabular-nums">0{idx + 1}</span>
                                        <span className="text-sm font-bold group-hover:text-brand-300 transition-colors">{topic.name}</span>
                                    </div>
                                    <span className="text-[10px] font-bold bg-white/10 px-2 py-1 rounded-md tabular-nums">
                                        {topic.count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function AdminStatsCard({ title, value, icon, trend, trendUp, color, onClick }) {
    const colors = {
        blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
        brand: 'bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400',
        amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
        rose: 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400'
    }

    return (
        <div 
            onClick={onClick}
            className="deen-card p-6 hover:shadow-elevated transition-all cursor-pointer group active:scale-[0.98] relative overflow-hidden"
        >
            <div className={`w-12 h-12 rounded-xl ${colors[color]} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <div className="relative z-10">
                <div className="flex items-baseline justify-between gap-2 mb-1">
                    <div className="text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </div>
                    {trend && (
                      <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {trendUp ? '↑' : '↓'} {trend}
                      </div>
                    )}
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {title}
                </div>
            </div>
        </div>
    )
}
