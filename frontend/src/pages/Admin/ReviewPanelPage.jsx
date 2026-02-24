import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../api'

const CHECKLIST_ITEMS = [
    "Is the ruling based on a verified fiqh ruling?",
    "Does the answer clearly address riba if applicable?",
    "Does it avoid personal opinion?",
    "Does it avoid falsely declaring necessity (darurah)?",
    "Does it include at least one scholarly or institutional source?",
    "Is the tone pastoral and non-judgmental?"
]

export default function ReviewPanelPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [draft, setDraft] = useState(null)
    const [loading, setLoading] = useState(true)
    const [checklist, setChecklist] = useState({})
    const [notes, setNotes] = useState('')
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        fetchDraft()
    }, [id])

    const fetchDraft = async () => {
        try {
            const res = await api.get(`/answers/drafts/${id}/`)
            setDraft(res.data)
        } catch (err) {
            alert('Draft not found')
            navigate('/admin/reviews')
        } finally {
            setLoading(false)
        }
    }

    const toggleCheck = (item) => {
        setChecklist(prev => ({ ...prev, [item]: !prev[item] }))
    }

    const isChecklistComplete = CHECKLIST_ITEMS.every(item => checklist[item])

    const handleApprove = async () => {
        if (!isChecklistComplete) {
            alert('Please confirm all professional criteria before approving.')
            return
        }
        setSubmitting(true)
        try {
            await api.post(`/answers/drafts/${id}/approve/`, { checklist, notes })
            navigate('/admin/reviews')
        } catch (err) {
            alert('Approval failed')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <div className="p-12 text-center text-slate-400">Loading review panel...</div>

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
                <div>
                    <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Review Answer Draft</h1>
                    <p className="text-slate-500 text-sm mt-1">Audit and verify AI response based on Fiqh Library evidence.</p>
                </div>
                <button onClick={() => navigate('/admin/reviews')} className="text-slate-500 hover:text-slate-900 font-medium">Exit Review</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* The Original Question */}
                    <div className="bg-slate-50 dark:bg-slate-950 p-8 rounded-3xl border border-slate-200 dark:border-slate-800">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">The User Question</div>
                        <p className="text-xl font-medium text-slate-900 dark:text-white leading-relaxed">
                            "{draft.question_text || 'Loan query...'}"
                        </p>
                    </div>

                    {/* AI Proposed Answer */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-brand-500/20 shadow-xl overflow-hidden">
                        <div className="bg-brand-500 px-6 py-3 flex justify-between items-center">
                            <span className="text-white text-xs font-bold uppercase tracking-widest">AI Proposed Draft</span>
                            <span className="text-white/80 text-[10px] font-bold tracking-tighter uppercase px-2 py-0.5 bg-black/20 rounded">Reference Locked</span>
                        </div>
                        <div className="p-8">
                            <textarea
                                className="w-full bg-transparent text-slate-800 dark:text-slate-200 leading-relaxed text-lg outline-none min-h-[300px] font-medium"
                                value={draft.ai_text}
                                onChange={(e) => setDraft({ ...draft, ai_text: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Linked Rulings */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-1">Authority Evidence / Primary Rulings</h3>
                        {draft.used_rulings_data?.map(r => (
                            <div key={r.id} className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="font-bold text-slate-900 dark:text-white">{r.title}</div>
                                    <span className="text-[10px] font-bold px-2 py-1 bg-brand-50 dark:bg-brand-950/30 text-brand-600 rounded">Verified ID {r.id}</span>
                                </div>
                                <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                                    {r.ruling_text}
                                </div>
                                <div className="text-xs text-slate-400 font-medium italic">— {r.scholar_name}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Approval Checklist */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-lg">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Approval Criteria</h3>
                        <div className="space-y-4">
                            {CHECKLIST_ITEMS.map((item, idx) => (
                                <label key={idx} className="flex gap-4 group cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={checklist[item] || false}
                                        onChange={() => toggleCheck(item)}
                                        className="w-5 h-5 mt-0.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500 transition-all"
                                    />
                                    <span className={`text-sm font-medium transition-colors ${checklist[item] ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                                        {item}
                                    </span>
                                </label>
                            ))}
                        </div>

                        <div className="mt-8 space-y-4">
                            <textarea
                                placeholder="Reviewer notes (optional)..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none text-sm min-h-[100px]"
                            />

                            <button
                                onClick={handleApprove}
                                disabled={!isChecklistComplete || submitting}
                                className={`w-full py-4 rounded-2xl font-bold text-white shadow-xl transition-all active:scale-95 ${isChecklistComplete
                                    ? 'bg-green-600 shadow-green-500/20 hover:bg-green-700'
                                    : 'bg-slate-300 cursor-not-allowed opacity-50'
                                    }`}
                            >
                                {submitting ? 'Approvng...' : 'Complete & Approve'}
                            </button>
                            <button className="w-full py-3 bg-red-50 text-red-600 dark:bg-red-950/20 rounded-2xl font-bold text-sm hover:bg-red-100 transition-colors">
                                Reject Draft
                            </button>
                        </div>
                    </div>

                    {/* Audit Metadata */}
                    <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800 pb-2 mb-4 text-center">Reference Meta</div>
                        <div className="flex justify-between text-xs font-medium">
                            <span className="text-slate-400">Pipeline Mode</span>
                            <span className="text-brand-600">Strict-Match</span>
                        </div>
                        <div className="flex justify-between text-xs font-medium">
                            <span className="text-slate-400">AI Tokens</span>
                            <span className="text-slate-900 dark:text-white">452</span>
                        </div>
                        <div className="flex justify-between text-xs font-medium">
                            <span className="text-slate-400">Authority Heat</span>
                            <span className="text-green-500">98% Verified</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
