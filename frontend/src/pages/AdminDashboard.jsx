import React, { useEffect, useState } from 'react'
import api from '../api'
import Card from '../components/Card'

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalGuidance: 0,
        totalReflections: 0,
        recentUsers: [],
        recentGuidance: []
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const [users, guidance, reflections] = await Promise.all([
                    api.get('/admin/users/'),
                    api.get('/admin/guidance/'),
                    api.get('/admin/reflections/')
                ])

                setStats({
                    totalUsers: users.data.length,
                    totalGuidance: guidance.data.length,
                    totalReflections: reflections.data.length,
                    recentUsers: users.data.slice(0, 5),
                    recentGuidance: guidance.data.slice(0, 5)
                })
            } catch (e) {
                console.error('Failed to fetch admin data:', e)
            } finally {
                setLoading(false)
            }
        }
        fetchAdminData()
    }, [])

    if (loading) {
        return (
            <div className="pt-24 flex items-center justify-center">
                <div className="text-slate-500 dark:text-slate-400">Loading admin dashboard...</div>
            </div>
        )
    }

    return (
        <div className="pt-24 animate-in fade-in duration-700">
            <div className="mb-10">
                <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
                    Admin <span className="text-brand-600">Dashboard</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
                    Manage and monitor your DeenFlow platform.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <Card className="flex flex-col justify-center p-8 bg-white dark:bg-slate-900 border-0 shadow-soft hover:shadow-elevated transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-[0.15em] mb-2">Total Users</div>
                    <div className="text-5xl font-display font-bold text-slate-900 dark:text-white leading-none">{stats.totalUsers}</div>
                </Card>

                <Card className="flex flex-col justify-center p-8 bg-white dark:bg-slate-900 border-0 shadow-soft hover:shadow-elevated transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 dark:text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-[0.15em] mb-2">Total Guidance</div>
                    <div className="text-5xl font-display font-bold text-brand-600 leading-none">{stats.totalGuidance}</div>
                </Card>

                <Card className="flex flex-col justify-center p-8 bg-white dark:bg-slate-900 border-0 shadow-soft hover:shadow-elevated transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                    </div>
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-[0.15em] mb-2">Reflections</div>
                    <div className="text-5xl font-display font-bold text-slate-900 dark:text-white leading-none">{stats.totalReflections}</div>
                </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white tracking-tight">Recent Users</h3>
                    <div className="space-y-4">
                        {stats.recentUsers.map((user) => (
                            <Card key={user.id} className="p-5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-soft transition-all">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-slate-900 dark:text-slate-100 font-semibold">{user.full_name || user.username}</div>
                                        <div className="text-xs text-slate-400 mt-1">{user.email}</div>
                                    </div>
                                    <div className="text-xs text-slate-400">
                                        {new Date(user.date_joined).toLocaleDateString()}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white tracking-tight">Recent Guidance Requests</h3>
                    <div className="space-y-4">
                        {stats.recentGuidance.map((guidance) => (
                            <Card key={guidance.id} className="p-5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-soft transition-all">
                                <div className="flex items-start gap-4">
                                    <div className="flex-1">
                                        <div className="text-slate-700 dark:text-slate-200 font-medium line-clamp-2">{guidance.input_text}</div>
                                        <div className="text-xs text-slate-400 mt-1">
                                            {new Date(guidance.created_at).toLocaleDateString()} • {guidance.category || 'General'}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
