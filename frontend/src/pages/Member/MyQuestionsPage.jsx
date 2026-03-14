import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../api'
import { 
  MessageSquare, 
  Search, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  Filter,
  History,
  Calendar
} from 'lucide-react'

export default function MyQuestionsPage() {
    const [questions, setQuestions] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        fetchQuestions()
    }, [])

    const fetchQuestions = async () => {
        try {
            const res = await api.get('/questions/')
            setQuestions(res.data)
        } catch (err) {
            console.error('Failed to fetch questions:', err)
        } finally {
            setLoading(false)
        }
    }

    const filteredQuestions = questions.filter(q => 
      q.text.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <div className="w-10 h-10 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin mb-4"></div>
                <div className="text-slate-500 font-medium text-sm">Loading your history...</div>
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto py-8 px-6 pb-20">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <div className="flex items-center gap-2 text-brand-600 font-bold text-xs uppercase tracking-[0.2em] mb-2">
                        <History className="w-4 h-4" />
                        Spiritual Record
                    </div>
                    <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
                        My Guidance History
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">
                        Track your path to knowledge and review scholarly insights.
                    </p>
                </div>
                <button
                    onClick={() => navigate('/app/ask-ai')}
                    className="btn-primary px-8 py-3.5 flex items-center gap-2 shadow-xl"
                >
                    <Plus className="w-5 h-5" />
                    Seek New Guidance
                </button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search your questions..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 pl-11 pr-4 focus:ring-2 ring-brand-500/20 outline-none transition-all text-sm"
                    />
                </div>
                <button className="px-5 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-600 dark:text-slate-400 font-bold text-sm flex items-center gap-2 hover:bg-slate-50 transition-colors">
                    <Filter className="w-4 h-4" />
                    Filter
                </button>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
                {filteredQuestions.length === 0 ? (
                    <div className="deen-card p-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 bg-transparent flex flex-col items-center">
                        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                            <MessageSquare className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                            {searchQuery ? 'No matching questions' : "Your journal is empty"}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs mx-auto">
                            {searchQuery ? 'Try exploring different keywords or check for typos.' : 'Ask your first question to our scholarly board to begin your history.'}
                        </p>
                        {!searchQuery && (
                            <button
                                onClick={() => navigate('/app/ask-ai')}
                                className="btn-primary px-8"
                            >
                                Ask First Question
                            </button>
                        )}
                    </div>
                ) : (
                    filteredQuestions.map(q => (
                        <div 
                            key={q.id} 
                            onClick={() => q.status === 'answered' && navigate(`/app/result/${q.id}`)}
                            className={`deen-card flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 group transition-all duration-300 ${q.status === 'answered' ? 'cursor-pointer hover:border-brand-200 dark:hover:border-brand-900/40 hover:shadow-lg' : ''}`}
                        >
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-4">
                                    <StatusBadge status={q.status} />
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(q.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight group-hover:text-brand-600 transition-colors">
                                    "{q.text}"
                                </h3>
                                {q.status !== 'answered' && (
                                    <div className="flex items-center gap-2 text-xs font-medium text-slate-400 italic">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>Scholars are currently reviewing this response.</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-4">
                                {q.status === 'answered' && (
                                    <>
                                        <span className="hidden sm:block text-xs font-bold text-brand-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">View Answer</span>
                                        <div className="w-10 h-10 rounded-full border border-slate-100 dark:border-slate-800 flex items-center justify-center group-hover:bg-brand-50 group-hover:border-brand-100 transition-colors">
                                            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand-500 transition-colors" />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

function StatusBadge({ status }) {
    const configs = {
        answered: {
            icon: <CheckCircle2 className="w-3 h-3" />,
            classes: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30"
        },
        processing: {
            icon: <Clock className="w-3 h-3" />,
            classes: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border-blue-100 dark:border-blue-900/30"
        },
        pending: {
          icon: <AlertCircle className="w-3 h-3" />,
          classes: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-100 dark:border-amber-900/30"
        }
    }

    const config = configs[status] || configs.pending

    return (
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest ${config.classes}`}>
            {config.icon}
            {status}
        </div>
    )
}
