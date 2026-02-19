import React, { useState, useEffect } from 'react'
import api from '../../api'

export default function AnalyticsPage() {
    const [stats, setStats] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchAnalytics()
    }, [])

    const fetchAnalytics = async () => {
        try {
            const res = await api.get('/analytics/')
            setStats(res.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div>
                <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">Platform Analytics</h1>
                <p className="text-slate-500 font-medium">Monitoring growth, engagement, and moderation health.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Growth Chart Placeholder */}
                <div className="bg-white dark:bg-slate-950 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 h-80 flex flex-col items-center justify-center">
                    <div className="text-slate-300 mb-4">📈 Growth Visualization</div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">[ Chart.js / Recharts Integrated Here ]</p>
                </div>

                {/* Engagement Chart Placeholder */}
                <div className="bg-white dark:bg-slate-950 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 h-80 flex flex-col items-center justify-center">
                    <div className="text-slate-300 mb-4">📊 Interaction Heatmap</div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">[ Real-time Engagement Data ]</p>
                </div>
            </div>

            {/* Daily Breakdown Table */}
            <div className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl">
                <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Daily Snapshot History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 dark:bg-slate-900/50">
                            <tr>
                                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
                                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Users</th>
                                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Questions</th>
                                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Answers</th>
                                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Flags</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {loading ? (
                                <tr><td colSpan="5" className="px-8 py-12 text-center text-slate-400">Loading data...</td></tr>
                            ) : stats.length === 0 ? (
                                <tr><td colSpan="5" className="px-8 py-12 text-center text-slate-400">No records found.</td></tr>
                            ) : (
                                stats.map(s => (
                                    <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-4 font-bold text-slate-900 dark:text-white">{s.date}</td>
                                        <td className="px-8 py-4 text-slate-600 dark:text-slate-400">{s.total_users}</td>
                                        <td className="px-8 py-4 text-slate-600 dark:text-slate-400">{s.questions_count}</td>
                                        <td className="px-8 py-4 text-slate-600 dark:text-slate-400">{s.answers_count}</td>
                                        <td className="px-8 py-4 text-red-500 font-bold">{s.flags_count}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
