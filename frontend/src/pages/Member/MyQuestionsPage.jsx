import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api'

export default function MyQuestionsPage() {
    const [questions, setQuestions] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchQuestions()
    }, [])

    const fetchQuestions = async () => {
        try {
            const res = await api.get('/questions/')
            setQuestions(res.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">My Guidance History</h1>
                    <p className="text-slate-500 font-medium">Track the status of your queries and view scholarly answers.</p>
                </div>
                <Link to="/app/ask-ai" className="px-6 py-3 bg-brand-600 text-white rounded-xl font-bold shadow-lg shadow-brand-600/20 hover:bg-brand-700 transition-all">
                    Ask New
                </Link>
            </div>

            <div className="space-y-6">
                {loading ? (
                    <div className="text-center py-20 text-slate-400">Loading your history...</div>
                ) : questions.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                        <p className="text-slate-500 font-medium">You haven't asked any questions yet.</p>
                    </div>
                ) : (
                    questions.map(q => (
                        <div key={q.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-xl transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${q.status === 'answered' ? 'bg-green-100 text-green-700 dark:bg-green-950/30' :
                                        q.status === 'processing' ? 'bg-blue-100 text-blue-700 animate-pulse' :
                                            'bg-orange-100 text-orange-700'
                                    }`}>
                                    {q.status}
                                </span>
                                <span className="text-xs text-slate-400 font-medium">{new Date(q.created_at).toLocaleDateString()}</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 line-clamp-2">"{q.text}"</h3>

                            {q.status === 'answered' ? (
                                <Link to={`/app/result/${q.id}`} className="text-brand-600 font-bold text-sm hover:underline">View Scholarly Answer →</Link>
                            ) : (
                                <p className="text-slate-400 text-sm italic">Our scholars are currently reviewing the AI's draft answer for this question.</p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
