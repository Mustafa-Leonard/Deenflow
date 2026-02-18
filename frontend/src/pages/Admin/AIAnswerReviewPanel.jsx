import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../api'

export default function AIAnswerReviewPanel() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [interaction, setInteraction] = useState(null)
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(false)
    const [reviewNotes, setReviewNotes] = useState('')

    useEffect(() => {
        fetchInteraction()
    }, [id])

    const fetchInteraction = async () => {
        try {
            const response = await api.get(`/auth/admin/ai/logs/${id}/`)
            setInteraction(response.data)
        } catch (error) {
            console.error('Failed to fetch interaction:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAction = async (action) => {
        setActionLoading(true)
        try {
            await api.post(`/auth/admin/ai/logs/${id}/action/`, {
                action,
                notes: reviewNotes
            })
            alert(`Action "${action}" completed successfully`)
            navigate('/admin/ai/logs')
        } catch (error) {
            alert('Failed to perform action')
        } finally {
            setActionLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-700 border-t-brand-600 rounded-full animate-spin mb-4"></div>
                <div className="text-slate-500 dark:text-slate-400 font-medium">Loading interaction details...</div>
            </div>
        )
    }

    if (!interaction) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Interaction Not Found</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
                    The requested AI interaction log could not be located. It may have been deleted or archived.
                </p>
                <button
                    onClick={() => navigate('/admin/ai/logs')}
                    className="px-6 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition"
                >
                    Return to Logs
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <button
                        onClick={() => navigate('/admin/ai/logs')}
                        className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 font-medium text-sm mb-3 transition-colors group"
                    >
                        <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Interaction Logs
                    </button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
                            Review AI Response
                        </h1>
                        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-mono font-bold border border-slate-200 dark:border-slate-700">
                            ID: {interaction.id}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleAction('mark_correct')}
                        disabled={actionLoading}
                        className="flex items-center gap-2 px-5 py-2.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl font-bold border border-green-200 dark:border-green-800/30 hover:bg-green-100 dark:hover:bg-green-900/30 transition-all disabled:opacity-50"
                    >
                        <span className="text-lg">✓</span> Verify Correct
                    </button>
                    <button
                        onClick={() => handleAction('flag')}
                        disabled={actionLoading}
                        className="flex items-center gap-2 px-5 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-xl font-bold border border-red-200 dark:border-red-800/30 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all disabled:opacity-50"
                    >
                        <span className="text-lg">🚩</span> Flag Issue
                    </button>
                    <button
                        onClick={() => handleAction('send_to_scholar')}
                        disabled={actionLoading}
                        className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl font-bold shadow-lg shadow-brand-600/20 hover:bg-brand-700 transition-all disabled:opacity-50"
                    >
                        <span className="text-lg">👨‍🏫</span> Escalate to Scholar
                    </button>
                </div>
            </div>

            {/* Interaction Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* User Question */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                        <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-80"></div>
                        <div className="p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-xl shadow-sm text-blue-600 dark:text-blue-400">
                                    ❓
                                </div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">User Query</h2>
                            </div>
                            <div className="prose dark:prose-invert max-w-none">
                                <p className="text-lg text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                                    "{interaction.input_text}"
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* AI Answer */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-md shadow-slate-200/50 dark:shadow-black/20">
                        <div className="p-1 bg-gradient-to-r from-brand-500 to-purple-600 opacity-80"></div>
                        <div className="p-6 md:p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center text-xl shadow-sm text-brand-600 dark:text-brand-400">
                                        🤖
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Generated Response</h2>
                                </div>
                                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-bold uppercase tracking-wider">
                                    {interaction.model || 'GPT-4'}
                                </span>
                            </div>
                            <div className="prose dark:prose-invert max-w-none">
                                <div className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                                    {interaction.ai_response || interaction.output_text}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Review Notes Input */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-sm shadow-sm text-orange-600 dark:text-orange-400">
                                📝
                            </div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Reviewer Notes</h2>
                        </div>
                        <textarea
                            value={reviewNotes}
                            onChange={(e) => setReviewNotes(e.target.value)}
                            placeholder="Add internal notes about this interaction for future reference..."
                            rows="4"
                            className="w-full px-5 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-900 dark:text-white resize-none shadow-sm transition-shadow placeholder-slate-400"
                        />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* System Prompt (Collapsible-ish feel but open) */}
                    <div className="bg-slate-900 text-slate-300 rounded-3xl overflow-hidden shadow-lg">
                        <div className="p-5 border-b border-slate-700 flex items-center gap-3 bg-slate-950/30">
                            <span className="text-lg">⚙️</span>
                            <h3 className="font-bold text-white text-sm uppercase tracking-wide">System Prompt</h3>
                        </div>
                        <div className="p-5 font-mono text-xs leading-relaxed opacity-80 bg-slate-900">
                            {interaction.system_prompt || 'You are a helpful Islamic assistant. Provide answers based on Quran and Sunnah...'}
                        </div>
                    </div>

                    {/* References Card */}
                    {interaction.references && interaction.references.length > 0 && (
                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-xl">📚</span>
                                <h3 className="font-bold text-slate-900 dark:text-white">Citations</h3>
                            </div>
                            <ul className="space-y-3">
                                {interaction.references.map((ref, index) => (
                                    <li key={index} className="flex items-start gap-3 text-sm group">
                                        <span className="min-w-[20px] h-[20px] rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:bg-brand-100 dark:group-hover:bg-brand-900/30 group-hover:text-brand-600 transition-colors">
                                            {index + 1}
                                        </span>
                                        <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                            {ref}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Metadata Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-5 text-sm uppercase tracking-widest text-center border-b border-slate-100 dark:border-slate-800 pb-3">
                            Session Metadata
                        </h3>
                        <div className="space-y-4">
                            <MetadataRow label="Timestamp" value={new Date(interaction.created_at).toLocaleString()} icon="🕒" />
                            <MetadataRow label="User ID" value={interaction.user_id || 'Anonymous'} icon="👤" />
                            <MetadataRow label="User Email" value={interaction.user_email || 'N/A'} icon="📧" />
                            <MetadataRow label="Category" value={interaction.category || 'General'} icon="🏷️" />
                            <MetadataRow
                                label="Status"
                                value={
                                    interaction.flagged ? (
                                        <span className="text-red-500 font-bold flex items-center gap-1">🚩 Flagged</span>
                                    ) : (
                                        <span className="text-green-500 font-bold flex items-center gap-1">✓ Normal</span>
                                    )
                                }
                                icon="📊"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function MetadataRow({ label, value, icon }) {
    return (
        <div className="flex items-center justify-between group">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                <span className="opacity-70 group-hover:opacity-100 transition-opacity">{icon}</span>
                <span>{label}</span>
            </div>
            <div className="font-medium text-slate-900 dark:text-white text-sm text-right">
                {value}
            </div>
        </div>
    )
}
