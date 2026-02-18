import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api'

export default function FlaggedAIAnswersPage() {
    const navigate = useNavigate()
    const [flaggedAnswers, setFlaggedAnswers] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedAnswer, setSelectedAnswer] = useState(null)
    const [showResolveModal, setShowResolveModal] = useState(false)
    const [resolveAction, setResolveAction] = useState('')
    const [resolveNotes, setResolveNotes] = useState('')

    useEffect(() => {
        fetchFlaggedAnswers()
    }, [])

    const fetchFlaggedAnswers = async () => {
        try {
            const response = await api.get('/auth/admin/ai/flagged/')
            setFlaggedAnswers(response.data)
        } catch (error) {
            console.error('Failed to fetch flagged answers:', error)
        } finally {
            setLoading(false)
        }
    }

    const openResolveModal = (answer) => {
        setSelectedAnswer(answer)
        setShowResolveModal(true)
        setResolveAction('')
        setResolveNotes('')
    }

    const handleResolve = async () => {
        if (!resolveAction) {
            alert('Please select an action')
            return
        }

        try {
            await api.post(`/auth/admin/ai/flagged/${selectedAnswer.id}/resolve/`, {
                action: resolveAction,
                notes: resolveNotes
            })
            alert('Flag resolved successfully')
            setShowResolveModal(false)
            fetchFlaggedAnswers()
        } catch (error) {
            alert('Failed to resolve flag')
        }
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                        Flagged Responses
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        Review and resolve AI content flagged for attention
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-bold border border-red-100 dark:border-red-900/30 shadow-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        {flaggedAnswers.length} Pending Review
                    </div>
                </div>
            </div>

            {/* Flagged Answers List */}
            <div className="space-y-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-700 border-t-brand-600 rounded-full animate-spin mb-4"></div>
                        <div className="text-slate-500 dark:text-slate-400 font-medium">Loading flagged content...</div>
                    </div>
                ) : flaggedAnswers.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-16 text-center shadow-xl shadow-slate-200/50 dark:shadow-black/20">
                        <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-sm">
                            ✓
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                            All Clear!
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                            There are no flagged AI responses pending review. Great job keeping the platform safe.
                        </p>
                        <button
                            onClick={() => navigate('/admin/ai/logs')}
                            className="mt-8 px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                        >
                            View All Activity
                        </button>
                    </div>
                ) : (
                    flaggedAnswers.map((answer) => (
                        <div
                            key={answer.id}
                            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-black/20 transition-all hover:shadow-2xl hover:-translate-y-1 group"
                        >
                            <div className="p-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>

                            <div className="p-6 md:p-8">
                                <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                                    {/* Icon Column */}
                                    <div className="flex-shrink-0">
                                        <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-3xl shadow-sm border border-red-100 dark:border-red-900/30">
                                            🚩
                                        </div>
                                    </div>

                                    {/* Content Column */}
                                    <div className="flex-1 min-w-0 space-y-6">
                                        {/* Header & Meta */}
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/30 uppercase tracking-wide">
                                                        High Priority
                                                    </span>
                                                    <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                                                        ID: #{String(answer.id).substring(0, 8)}
                                                    </span>
                                                    <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                                                        • {new Date(answer.flagged_at).toLocaleString()}
                                                    </span>
                                                </div>
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                                                    "{answer.input_text}"
                                                </h3>
                                            </div>

                                            <div className="flex -space-x-2">
                                                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-800 flex items-center justify-center text-xs font-bold" title="User">
                                                    {answer.user_email?.charAt(0) || 'U'}
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-brand-200 dark:bg-brand-900 border-2 border-white dark:border-slate-800 flex items-center justify-center text-xs font-bold text-brand-700 dark:text-brand-300" title="Model">
                                                    AI
                                                </div>
                                            </div>
                                        </div>

                                        {/* Flag Reason Box */}
                                        {answer.flag_reason && (
                                            <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/20">
                                                <div className="flex items-start gap-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    <div>
                                                        <div className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wide mb-1">
                                                            Flagged Reason
                                                        </div>
                                                        <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                                            {answer.flag_reason}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* AI Response Preview */}
                                        <div className="relative group/preview">
                                            <div className="absolute inset-0 bg-slate-50 dark:bg-slate-800 rounded-2xl transform transition-transform group-hover/preview:scale-[1.01]"></div>
                                            <div className="relative p-5 border border-slate-100 dark:border-slate-700 rounded-2xl">
                                                <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                                                    AI Response Generation
                                                </div>
                                                <div className="prose prose-sm dark:prose-invert max-w-none line-clamp-3 text-slate-600 dark:text-slate-300">
                                                    {answer.ai_response || answer.output_text}
                                                </div>
                                                <div className="mt-2 text-center">
                                                    <button className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 transition-colors">
                                                        View Full Response
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-wrap gap-3 pt-2">
                                            <button
                                                onClick={() => openResolveModal(answer)}
                                                className="flex-1 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-brand-600/20 active:scale-[0.98]"
                                            >
                                                Resolve Incident
                                            </button>
                                            <button
                                                onClick={() => navigate(`/admin/ai/review/${answer.id}`)}
                                                className="px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
                                            >
                                                Detailed Review
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Resolve Modal */}
            {showResolveModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col scale-100 animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">
                                    Resolve Incident
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Create a permanent record of this resolution
                                </p>
                            </div>
                            <button
                                onClick={() => setShowResolveModal(false)}
                                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-8">
                            {/* Question Context */}
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                                <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                                    Original Query
                                </div>
                                <div className="font-medium text-slate-900 dark:text-white">
                                    "{selectedAnswer?.input_text}"
                                </div>
                            </div>

                            {/* Action Selection */}
                            <div>
                                <label className="block text-sm font-bold text-slate-900 dark:text-white mb-4">
                                    Select Resolution Action
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {[
                                        { value: 'approve', label: 'Approve Content', desc: 'Mark as safe & correct', color: 'green', icon: '✅' },
                                        { value: 'edit', label: 'Edit Response', desc: 'Apply minor corrections', color: 'blue', icon: '✏️' },
                                        { value: 'remove', label: 'Remove Content', desc: 'Delete from system', color: 'red', icon: '🗑️' },
                                        { value: 'scholar_review', label: 'Scholar Review', desc: 'Escalate to expert', color: 'purple', icon: '👨‍🏫' }
                                    ].map((action) => (
                                        <label
                                            key={action.value}
                                            className={`relative p-4 border-2 rounded-2xl cursor-pointer transition-all group ${resolveAction === action.value
                                                ? `border-${action.color}-500 bg-${action.color}-50 dark:bg-${action.color}-900/10`
                                                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="action"
                                                value={action.value}
                                                checked={resolveAction === action.value}
                                                onChange={(e) => setResolveAction(e.target.value)}
                                                className="sr-only"
                                            />
                                            <div className="flex items-start gap-3">
                                                <span className="text-2xl">{action.icon}</span>
                                                <div>
                                                    <div className={`font-bold text-sm ${resolveAction === action.value ? `text-${action.color}-700 dark:text-${action.color}-400` : 'text-slate-900 dark:text-white'}`}>
                                                        {action.label}
                                                    </div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                        {action.desc}
                                                    </div>
                                                </div>
                                            </div>
                                            {resolveAction === action.value && (
                                                <div className={`absolute top-3 right-3 w-5 h-5 rounded-full bg-${action.color}-500 flex items-center justify-center`}>
                                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            )}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Resolution Notes */}
                            <div>
                                <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
                                    Internal Notes
                                </label>
                                <textarea
                                    value={resolveNotes}
                                    onChange={(e) => setResolveNotes(e.target.value)}
                                    placeholder="Add context explaining this resolution decision..."
                                    rows="4"
                                    className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/50 transition-all text-sm text-slate-900 dark:text-white placeholder-slate-400 resize-none shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end gap-3">
                            <button
                                onClick={() => setShowResolveModal(false)}
                                className="px-6 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold border border-slate-200 dark:border-slate-700 transition-all text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleResolve}
                                className="px-6 py-2.5 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-xl font-bold transition-all shadow-lg active:scale-95 text-sm"
                            >
                                Confirm Resolution
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
