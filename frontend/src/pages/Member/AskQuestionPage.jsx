import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api'
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  Info,
  ChevronLeft,
  Search,
  BookOpen
} from 'lucide-react'

export default function AskQuestionPage() {
    const navigate = useNavigate()
    const [text, setText] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!text.trim()) return

        setSubmitting(true)
        try {
            await api.post('/questions/', { text })
            navigate('/app/my-questions')
        } catch (err) {
            console.error('Failed to submit question:', err)
            alert('Failed to submit question. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-6">
            {/* Page Header */}
            <div className="flex items-center gap-4 mb-8">
                <button 
                  onClick={() => navigate(-1)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-500"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div>
                  <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
                    Seek Guidance
                  </h1>
                  <p className="text-slate-500 font-medium">Connect with verified Islamic scholarship</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Input Form */}
                <div className="lg:col-span-2 space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="deen-card p-2 group focus-within:ring-2 ring-brand-500/20 transition-all">
                            <div className="p-6">
                                <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">
                                    <MessageSquare className="w-3 h-3 text-brand-500" />
                                    Your Question
                                </label>
                                <textarea
                                    required
                                    rows="8"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="Ask anything about Islamic principles, worship, or life guidance..."
                                    className="w-full bg-transparent text-xl text-slate-900 dark:text-white outline-none leading-relaxed resize-none placeholder:text-slate-300 dark:placeholder:text-slate-700 min-h-[240px]"
                                />
                                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                    <div className="text-xs text-slate-400 font-medium italic">
                                        Be as descriptive as possible for a precise ruling.
                                    </div>
                                    <div className="text-xs text-slate-300 dark:text-slate-600 font-bold tracking-widest tabular-nums">
                                        {text.length} Characters
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting || !text.trim()}
                            className="btn-primary w-full py-5 flex items-center justify-center gap-3 text-lg group overflow-hidden"
                        >
                            {submitting ? (
                              <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Processing...</span>
                              </>
                            ) : (
                              <>
                                <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                <span>Submit for Review</span>
                              </>
                            )}
                        </button>
                    </form>

                    <div className="p-6 bg-brand-50 dark:bg-brand-900/10 rounded-2xl border border-brand-100 dark:border-brand-900/30 flex gap-4">
                        <Info className="w-6 h-6 text-brand-600 flex-shrink-0" />
                        <p className="text-sm text-brand-800 dark:text-brand-300 font-medium leading-relaxed">
                          Your question will be drafted by our AI scholar based on verified Fiqh, 
                          then meticulously reviewed by a human Mufti before being finalized.
                        </p>
                    </div>
                </div>

                {/* Sidebar Guidelines */}
                <div className="space-y-8">
                    <div className="deen-card p-6">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                           <ShieldCheck className="w-4 h-4 text-brand-600" />
                           Guidelines
                        </h3>
                        <div className="space-y-4">
                            <GuidelineItem text="Check our Knowledge Base first" icon={<Search className="w-3 h-3" />} />
                            <GuidelineItem text="Avoid asking for medical advice" icon={<Sparkles className="w-3 h-3" />} />
                            <GuidelineItem text="Include context (location, situation)" icon={<BookOpen className="w-3 h-3" />} />
                            <GuidelineItem text="Remain respectful and focused" icon={<MessageSquare className="w-3 h-3" />} />
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-3xl p-6 bg-slate-900 text-white shadow-xl islamic-accent">
                        <h3 className="text-lg font-bold mb-3 relative z-10">Private & Confidential</h3>
                        <p className="text-slate-400 text-sm mb-4 relative z-10">
                          Your identity is never revealed in public rulings. Only the question and answer are published.
                        </p>
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function GuidelineItem({ text, icon }) {
  return (
    <div className="flex items-start gap-3 group">
      <div className="mt-1 w-5 h-5 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-500 transition-colors">
        {icon}
      </div>
      <span className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-tight">{text}</span>
    </div>
  )
}
