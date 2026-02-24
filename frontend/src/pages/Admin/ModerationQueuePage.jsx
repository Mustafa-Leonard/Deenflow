import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api'

export default function ModerationQueuePage() {
    const navigate = useNavigate()
    const [drafts, setDrafts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchQueue()
    }, [])

    const fetchQueue = async () => {
        setLoading(true)
        try {
            const response = await api.get('/answers/drafts/', { params: { status: 'draft' } })
            setDrafts(response.data)
        } catch (error) {
            console.error('Failed to fetch queue:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div>
                <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                    Moderation Queue
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium italic">
                    AI-generated drafts awaiting human verification and Islamic approval.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {loading ? (
                    <div className="text-center p-12 text-slate-400">Loading queue...</div>
                ) : drafts.length === 0 ? (
                    <div className="text-center p-20 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                        <div className="text-4xl mb-4">✅</div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">All caught up!</h3>
                        <p className="text-slate-500">There are no pending drafts to review.</p>
                    </div>
                ) : (
                    drafts.map(draft => (
                        <div key={draft.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col md:flex-row gap-6 items-start hover:shadow-xl transition-all group overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-2 h-full bg-brand-500 group-hover:w-3 transition-all"></div>

                            <div className="flex-1 space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                        Submitted {new Date(draft.created_at).toLocaleString()}
                                    </span>
                                    <span className="px-3 py-1 bg-brand-50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-400 text-[10px] font-bold rounded-lg uppercase tracking-tighter">
                                        ID: {draft.id}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide">The Question:</h3>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white line-clamp-2">
                                        "{draft.question_text || 'Loading question...'}"
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {draft.used_rulings_data?.map(r => (
                                        <span key={r.id} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs rounded-lg border border-slate-200 dark:border-slate-700">
                                            📚 {r.title}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="md:border-l border-slate-100 dark:border-slate-800 md:pl-8 flex flex-col gap-3 min-w-[200px]">
                                <button
                                    onClick={() => navigate(`/admin/reviews/${draft.id}`)}
                                    className="w-full py-3 bg-brand-600 text-white rounded-xl font-bold shadow-lg shadow-brand-500/20 hover:bg-brand-700 transition-all active:scale-[0.98]"
                                >
                                    Review Draft
                                </button>
                                <button className="w-full py-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors">
                                    Dismiss Flag
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
