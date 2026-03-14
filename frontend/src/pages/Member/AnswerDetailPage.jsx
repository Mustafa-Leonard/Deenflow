import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../api'
import { 
  ChevronLeft, 
  BookOpen, 
  ShieldCheck, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Share2,
  Printer,
  ChevronRight
} from 'lucide-react'

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
            console.error('Answer not found:', err)
            // Just for safety if 404
            if (err.response?.status === 404) {
              alert('Answer not found yet.')
              navigate('/app/my-questions')
            }
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <div className="w-10 h-10 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin mb-4"></div>
                <div className="text-slate-500 font-medium text-sm">Retrieving scholarly guidance...</div>
            </div>
        )
    }

    if (!answer) {
        return (
            <div className="max-w-4xl mx-auto py-12 px-6 text-center">
                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-10 h-10 text-slate-300" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Guidance Not Ready</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
                    This question is still being reviewed by our scholars. You will be notified once the response is finalized.
                </p>
                <button onClick={() => navigate('/app/my-questions')} className="btn-primary px-8">
                    Return to Questions
                </button>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-6 space-y-8">
            {/* Header / Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold text-xs uppercase tracking-widest transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to History
                </button>
                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400" title="Print">
                        <Printer className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400" title="Share">
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="deen-card overflow-hidden shadow-2xl relative">
                {/* Decorative Pattern Layer */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-bl-full pointer-events-none"></div>
                <div className="absolute left-0 bottom-0 w-48 h-48 bg-brand-600/5 rounded-tr-full pointer-events-none"></div>

                <div className="p-8 md:p-12 relative z-10">
                    <div className="flex items-center gap-2 text-brand-600 font-bold text-[10px] uppercase tracking-widest mb-6">
                        <ShieldCheck className="w-4 h-4" />
                        Verified Scholarly Response
                    </div>

                    <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white mb-10 leading-tight">
                        Scholarly Guidance
                    </h1>

                    <div className="space-y-10">
                        {/* Answer Text Area */}
                        <div className="prose prose-slate dark:prose-invert max-w-none">
                            <div className="text-xl md:text-2xl text-slate-800 dark:text-slate-200 leading-relaxed font-serif italic border-l-4 border-brand-200 dark:border-brand-900/40 pl-8 py-2">
                                {answer.text}
                            </div>
                        </div>

                        {/* Authority & Sources Section */}
                        <div className="pt-10 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2 mb-6">
                                <BookOpen className="w-4 h-4 text-brand-600" />
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Authority & References</h4>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {answer.sources && answer.sources.length > 0 ? (
                                    answer.sources.map(source => (
                                        <div 
                                            key={source.id} 
                                            className="p-5 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800/50 flex items-start gap-4 group hover:border-brand-200 transition-colors"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center text-brand-600 flex-shrink-0">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">
                                                    {source.title}
                                                </div>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                                        Authenticated Source
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-2 py-4 px-6 bg-slate-50 dark:bg-slate-950/50 rounded-2xl italic text-sm text-slate-400">
                                        Primary sources are being indexed for this response.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer Metadata */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-10 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center text-white ring-4 ring-brand-50 dark:ring-brand-900/20">
                                    <span className="font-display font-bold">DF</span>
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-slate-900 dark:text-white">DeenFlow Scholar Board</div>
                                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Certified Mujtahid Oversight</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
                                <Calendar className="w-3 h-3" />
                                <span>{new Date(answer.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Support / Feedback Section */}
            <div className="deen-card p-6 border-0 bg-brand-50 dark:bg-brand-950/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Sparkles className="w-12 h-12 text-brand-600" />
                </div>
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex-1">
                        <p className="text-brand-900 dark:text-brand-200 font-bold mb-1">
                            Was this guidance helpful?
                        </p>
                        <p className="text-brand-700 dark:text-brand-400 text-sm font-medium">
                            Your feedback helps us maintain the highest standards of Islamic reliability.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="px-4 py-2 hover:bg-white/50 dark:hover:bg-brand-900/30 rounded-xl text-brand-800 dark:text-brand-300 font-bold text-sm transition-colors border border-brand-200 dark:border-brand-900/50">
                            Flag for Clarification
                        </button>
                        <button 
                            onClick={() => navigate('/app/ask-ai')}
                            className="btn-primary px-6 flex items-center gap-2"
                        >
                            Ask Follow-up
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
