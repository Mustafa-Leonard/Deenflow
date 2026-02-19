import React, { useState, useEffect } from 'react'
import api from '../api'
import Card from '../components/Card'

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchNotifications()
    }, [])

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications/')
            setNotifications(res.data)
        } catch (error) {
            console.error('Failed to fetch notifications:', error)
        } finally {
            setLoading(false)
        }
    }

    const markAsRead = async (id) => {
        try {
            await api.patch(`/notifications/${id}/`, { is_read: true })
            setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n))
        } catch (error) {
            console.error('Failed to mark as read:', error)
        }
    }

    if (loading) return <div className="p-20 text-center animate-pulse text-slate-500">Retrieving alerts...</div>

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
            <div>
                <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
                    Your <span className="text-brand-600">Notifications</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Stay updated with your spiritual journey.</p>
            </div>

            <div className="space-y-4">
                {notifications.length > 0 ? (
                    notifications.map((n) => (
                        <div
                            key={n.id}
                            onClick={() => !n.is_read && markAsRead(n.id)}
                            className={`p-6 bg-white dark:bg-slate-900 rounded-[2rem] border transition-all cursor-pointer group ${n.is_read ? 'border-slate-100 dark:border-slate-800 opacity-70' : 'border-brand-200 dark:border-brand-900 shadow-lg shadow-brand-500/5'}`}
                        >
                            <div className="flex gap-5">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm transition-transform group-hover:scale-110 ${n.is_read ? 'bg-slate-50 dark:bg-slate-800 text-slate-400' : 'bg-brand-50 dark:bg-brand-900/40 text-brand-600'}`}>
                                    {n.notification_type === 'info' ? 'ℹ️' : n.notification_type === 'success' ? '✅' : '🔔'}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className={`font-bold ${n.is_read ? 'text-slate-600 dark:text-slate-400' : 'text-slate-900 dark:text-white'}`}>{n.title}</h3>
                                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">{new Date(n.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{n.message}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-20 text-center bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
                        <div className="text-4xl mb-4 grayscale">📭</div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">All caught up</h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">No new notifications at this time.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
