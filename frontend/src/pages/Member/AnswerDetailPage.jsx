import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../api'

export default function AnswerDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [answer, setAnswer] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchAnswer()
    }, [id])

    const fetchAnswer = async () => {
        try {
            // Fetch the final answer for this question
            const res = await api.get(`/answers/final/`, { params: { question: id } })
            const data = res.data.results ? res.data.results[0] : res.data[0]
            if (!data) throw new Error('Answer not found')
            setAnswer(data)
        } catch (err) {
            alert('Answer not found yet.')
            navigate('/app/my-questions')
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div className="p-20 text-center text-slate-400">Retrieving scholarly answer...</div>

    return (
        <div className="max-w-4xl mx-auto py-12 px-6 space-y-8">
            <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-900 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                ← Back to History
            </button>

            <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 p-10 shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-40 h-40 bg-brand-500/5 rounded-bl-full"></div>

                <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-8 leading-tight">
                    Scholarly Guidance
                </h1>

                <div className="space-y-8">
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                        <p className="text-xl text-slate-800 dark:text-slate-200 leading-relaxed font-serif italic">
                            {answer.text}
                        </p>
                    </div>

                    <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Authority & Sources</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {answer.sources?.map(source => (
                                <div key={source.id} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-start gap-4">
                                    <div className="text-2xl">📚</div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-900 dark:text-white">{source.title}</div>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-1">Verified Fiqh Ruling</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-8 text-xs font-bold text-slate-400 uppercase tracking-widest italic">
                        <span>Published by DeenFlow Scholar Board</span>
                        <span>{new Date(answer.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            <div className="text-center p-8 bg-brand-50 dark:bg-brand-950/20 rounded-3xl border border-brand-100 dark:border-brand-900/30">
                <p className="text-brand-800 dark:text-brand-300 font-medium text-sm">
                    Was this answer helpful? If you have doubts, you can <button className="underline font-bold">flag this response</button> for further clarification.
                </p>
            </div>
        </div>
    )
}
