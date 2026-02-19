import React, { useState, useEffect } from 'react'
import api from '../../api'

const mockReports = [
    { id: 1, type: 'question', contentId: 12, contentPreview: 'Is Bitcoin halal or haram in Islam?', reporter: 'user@email.com', reason: 'Misleading information', details: 'The AI answer does not cite any authentic sources and makes a definitive halal ruling without scholarly backing', status: 'pending', priority: 'high', createdAt: '2026-02-18T14:30:00Z' },
    { id: 2, type: 'answer', contentId: 45, contentPreview: 'Regarding marriage to People of the Book...', reporter: 'student@email.com', reason: 'Inaccurate ruling', details: 'This answer contradicts the majority scholarly opinion on conditions for marriage to Ahl al-Kitab', status: 'pending', priority: 'critical', createdAt: '2026-02-18T10:15:00Z' },
    { id: 3, type: 'comment', contentId: 89, contentPreview: 'You are following bid\'ah and will go to hell...', reporter: 'member@email.com', reason: 'Hate speech / Takfir', details: 'User is making takfir (declaring others as disbelievers) which violates community guidelines', status: 'pending', priority: 'critical', createdAt: '2026-02-17T22:40:00Z' },
    { id: 4, type: 'question', contentId: 33, contentPreview: 'What is the ruling on music in Islam?', reporter: 'user2@email.com', reason: 'One-sided opinion', details: 'Only presents the strict view without mentioning other scholarly opinions', status: 'resolved', priority: 'medium', createdAt: '2026-02-16T09:20:00Z', resolvedBy: 'admin@deenflow.com', resolvedAt: '2026-02-16T11:00:00Z', resolution: 'Updated answer to include multiple scholarly opinions' },
    { id: 5, type: 'answer', contentId: 67, contentPreview: 'According to the Quran, women cannot...', reporter: 'sister@email.com', reason: 'Misogynistic interpretation', details: 'Answer presents a culturally biased interpretation as Islamic ruling', status: 'dismissed', priority: 'medium', createdAt: '2026-02-15T16:45:00Z', resolvedBy: 'admin@deenflow.com', resolvedAt: '2026-02-15T18:00:00Z', resolution: 'Content reviewed — answer accurately represents scholarly opinion with proper nuance' },
]

const reportReasons = [
    'Misleading information',
    'Inaccurate ruling',
    'One-sided opinion',
    'Hate speech / Takfir',
    'Misogynistic interpretation',
    'Sectarian bias',
    'Inappropriate content',
    'Spam',
    'Other',
]

export default function ReportedContentPage() {
    const [reports, setReports] = useState(mockReports)
    const [selectedReport, setSelectedReport] = useState(null)
    const [showActionModal, setShowActionModal] = useState(false)
    const [filterStatus, setFilterStatus] = useState('pending')
    const [filterPriority, setFilterPriority] = useState('all')
    const [actionType, setActionType] = useState('')
    const [actionNote, setActionNote] = useState('')

    useEffect(() => {
        api.get('/auth/admin/moderation/reports/')
            .then(res => { if (res.data?.length) setReports(res.data) })
            .catch(() => { })
    }, [])

    const filteredReports = reports.filter(r => {
        const matchStatus = filterStatus === 'all' || r.status === filterStatus
        const matchPriority = filterPriority === 'all' || r.priority === filterPriority
        return matchStatus && matchPriority
    })

    const handleAction = () => {
        if (!selectedReport || !actionType) return
        setReports(prev => prev.map(r =>
            r.id === selectedReport.id ? {
                ...r,
                status: actionType === 'dismiss' ? 'dismissed' : 'resolved',
                resolvedBy: 'Current Admin',
                resolvedAt: new Date().toISOString(),
                resolution: actionNote,
            } : r
        ))
        api.post(`/auth/admin/moderation/reports/${selectedReport.id}/action/`, {
            action: actionType,
            notes: actionNote,
        }).catch(() => { })
        setShowActionModal(false)
        setSelectedReport(null)
        setActionType('')
        setActionNote('')
    }

    const statusConfig = {
        pending: { label: 'Pending', bg: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
        resolved: { label: 'Resolved', bg: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
        dismissed: { label: 'Dismissed', bg: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400' },
    }

    const priorityConfig = {
        critical: { label: 'Critical', bg: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', dot: 'bg-red-500' },
        high: { label: 'High', bg: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', dot: 'bg-orange-500' },
        medium: { label: 'Medium', bg: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', dot: 'bg-yellow-500' },
        low: { label: 'Low', bg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', dot: 'bg-blue-500' },
    }

    const typeIcons = { question: '❓', answer: '💬', comment: '💭' }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white text-lg shadow-lg">🛡️</span>
                    Moderation Queue
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                    Review and take action on reported content to maintain community integrity
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: 'Pending Reports', value: reports.filter(r => r.status === 'pending').length, color: 'from-amber-500 to-orange-600', icon: '⏳' },
                    { label: 'Critical', value: reports.filter(r => r.priority === 'critical' && r.status === 'pending').length, color: 'from-red-500 to-rose-600', icon: '🚨' },
                    { label: 'Resolved Today', value: reports.filter(r => r.status === 'resolved').length, color: 'from-green-500 to-emerald-600', icon: '✅' },
                    { label: 'Dismissed', value: reports.filter(r => r.status === 'dismissed').length, color: 'from-slate-500 to-slate-600', icon: '❌' },
                ].map(stat => (
                    <div key={stat.label} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
                            </div>
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-xl shadow-lg`}>
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-200 dark:border-slate-800 shadow-sm">
                {['pending', 'resolved', 'dismissed', 'all'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filterStatus === status
                                ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-md'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                ))}
                <div className="ml-auto">
                    <select
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                    >
                        <option value="all">All Priorities</option>
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                    </select>
                </div>
            </div>

            {/* Reports List */}
            <div className="space-y-3">
                {filteredReports.map(report => (
                    <div
                        key={report.id}
                        className={`bg-white dark:bg-slate-900 rounded-2xl border shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md ${report.priority === 'critical' && report.status === 'pending'
                                ? 'border-red-200 dark:border-red-900/50'
                                : 'border-slate-200 dark:border-slate-800'
                            }`}
                    >
                        <div className="p-5">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl flex-shrink-0">
                                    {typeIcons[report.type]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-medium text-slate-400 uppercase">{report.type}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityConfig[report.priority].bg}`}>
                                            {report.priority}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[report.status].bg}`}>
                                            {report.status}
                                        </span>
                                    </div>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                                        {report.contentPreview}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                                        <strong>Reason:</strong> {report.reason}
                                    </p>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                                        {report.details}
                                    </p>
                                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                                        <span>Reported by: {report.reporter}</span>
                                        <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                                        {report.resolvedBy && <span>Resolved by: {report.resolvedBy}</span>}
                                    </div>
                                    {report.resolution && (
                                        <div className="mt-2 p-2 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30">
                                            <p className="text-xs text-green-700 dark:text-green-400">
                                                <strong>Resolution:</strong> {report.resolution}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                {report.status === 'pending' && (
                                    <div className="flex gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => { setSelectedReport(report); setActionType('resolve'); setShowActionModal(true) }}
                                            className="px-4 py-2 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs font-medium hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                                        >
                                            Resolve
                                        </button>
                                        <button
                                            onClick={() => { setSelectedReport(report); setActionType('warn'); setShowActionModal(true) }}
                                            className="px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-xs font-medium hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
                                        >
                                            Warn User
                                        </button>
                                        <button
                                            onClick={() => { setSelectedReport(report); setActionType('remove'); setShowActionModal(true) }}
                                            className="px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                        >
                                            Remove
                                        </button>
                                        <button
                                            onClick={() => { setSelectedReport(report); setActionType('dismiss'); setShowActionModal(true) }}
                                            className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            Dismiss
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {filteredReports.length === 0 && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-sm">
                        <div className="text-5xl mb-4">✅</div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">All Clear!</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">No reports matching the current filter criteria</p>
                    </div>
                )}
            </div>

            {/* Action Modal */}
            {showActionModal && selectedReport && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[200]" onClick={() => setShowActionModal(false)}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-800" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                {actionType === 'resolve' ? 'Resolve Report' :
                                    actionType === 'warn' ? 'Warn User' :
                                        actionType === 'remove' ? 'Remove Content' :
                                            'Dismiss Report'}
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                Taking action on: <em>{selectedReport.contentPreview}</em>
                            </p>
                        </div>
                        <div className="p-6 space-y-4">
                            {actionType === 'remove' && (
                                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30">
                                    <p className="text-xs text-red-600 dark:text-red-400">
                                        ⚠️ This will permanently remove the content. This action cannot be undone.
                                    </p>
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Action Note</label>
                                <textarea
                                    value={actionNote}
                                    onChange={(e) => setActionNote(e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white resize-y focus:ring-2 focus:ring-brand-500"
                                    placeholder="Provide context for this action..."
                                />
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                            <button onClick={() => setShowActionModal(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Cancel</button>
                            <button
                                onClick={handleAction}
                                className={`px-6 py-2.5 rounded-xl text-sm font-semibold shadow-lg transition-all ${actionType === 'remove'
                                        ? 'bg-red-500 text-white hover:bg-red-600'
                                        : actionType === 'dismiss'
                                            ? 'bg-slate-500 text-white hover:bg-slate-600'
                                            : 'bg-gradient-to-r from-brand-600 to-brand-500 text-white hover:shadow-brand-500/40'
                                    }`}
                            >
                                Confirm {actionType.charAt(0).toUpperCase() + actionType.slice(1)}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
