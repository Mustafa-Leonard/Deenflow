import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import api from '../../api'
import { 
  ChevronLeft, 
  BookOpen, 
  Award, 
  Play, 
  CheckCircle2, 
  Lock, 
  ShieldCheck, 
  FileText, 
  Layout, 
  Zap, 
  Check, 
  ArrowRight,
  Info,
  Clock,
  Sparkles,
  Trophy,
  History
} from 'lucide-react'

export default function LessonDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [lesson, setLesson] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [activeTab, setActiveTab] = useState('Content')

    const [quizAnswers, setQuizAnswers] = useState({})
    const [submitting, setSubmitting] = useState(false)
    const [quizResult, setQuizResult] = useState(null)

    useEffect(() => {
        api.get(`/learning/lessons/${id}/`)
            .then(res => {
                setLesson(res.data)
                setLoading(false)
            })
            .catch(err => {
                if (err.response?.status === 403) {
                    setError('PREMIUM_REQUIRED')
                } else {
                    setError('FAILED_TO_LOAD')
                }
                setLoading(false)
            })
    }, [id])

    const handleOptionSelect = (questionId, optionIndex) => {
        setQuizAnswers(prev => ({
            ...prev,
            [questionId]: optionIndex
        }))
    }

    const handleSubmitQuiz = async () => {
        if (!lesson.quiz) {
            handleMarkComplete()
            return
        }

        const answeredCount = Object.keys(quizAnswers).length
        const totalCount = lesson.quiz.questions.length

        if (answeredCount < totalCount) {
            // In a real app, use a nicer toast
            return
        }

        setSubmitting(true)
        try {
            const res = await api.post(`/learning/lessons/${id}/complete/`, {
                answers: quizAnswers
            })
            setQuizResult(res.data)
        } catch (err) {
            console.error('Failed to submit quiz:', err)
        } finally {
            setSubmitting(false)
        }
    }

    const handleMarkComplete = async () => {
        setSubmitting(true)
        try {
            await api.post(`/learning/lessons/${id}/complete/`)
            setQuizResult({ score: 100, success: true })
        } catch (err) {
            console.error('Failed to complete lesson:', err)
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <div className="w-10 h-10 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin mb-4"></div>
                <div className="text-slate-500 font-medium text-sm">Opening academic module...</div>
            </div>
        )
    }

    if (error === 'PREMIUM_REQUIRED') {
        return (
            <div className="max-w-3xl mx-auto py-20 px-6 text-center animate-in fade-in duration-700">
                <div className="w-24 h-24 bg-amber-500 text-white rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-amber-500/30 mx-auto mb-10 relative group">
                    <Lock className="w-10 h-10" />
                    <div className="absolute inset-0 bg-white/20 islamic-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white mb-6">
                    Exclusive Academy Content
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mb-12 text-lg leading-relaxed max-w-xl mx-auto font-serif">
                    This lesson is part of our specialized premium curriculum.
                    Refine your knowledge by unlocking full access to our comprehensive Islamic academy.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => navigate('/app/upgrade')}
                        className="btn-primary px-12 py-4 shadow-2xl shadow-brand-600/30"
                    >
                        Explore Academy Plans
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-10 py-4 text-slate-500 font-bold hover:text-brand-600 transition-colors uppercase tracking-widest text-xs"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        )
    }

    if (!lesson) return <div className="p-20 text-center">Lesson not found.</div>

    return (
        <div className="max-w-5xl mx-auto py-8 px-6 pb-24 animate-in fade-in duration-700">
            {/* Header / Nav */}
            <div className="flex items-center justify-between mb-10">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-500 hover:text-brand-600 font-bold text-xs uppercase tracking-widest transition-colors group"
                >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Course Syllabus
                </button>
                <div className="flex items-center gap-3">
                   <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 dark:bg-slate-900 rounded-full border border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <Clock className="w-3 h-3 text-brand-600" />
                      <span>{lesson.duration_minutes}m Duration</span>
                   </div>
                </div>
            </div>

            <header className="mb-12">
                <div className="flex items-center gap-2 text-brand-600 font-bold text-xs uppercase tracking-[0.2em] mb-4">
                    <History className="w-4 h-4" />
                    Module {lesson.order}
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
                    {lesson.title}
                </h1>
            </header>

            {/* Content vs Quiz Tabs */}
            <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl mb-12 w-full md:w-fit shadow-inner">
                <TabItem 
                  label="The Module" 
                  active={activeTab === 'Content'} 
                  onClick={() => setActiveTab('Content')}
                  icon={<BookOpen className="w-4 h-4" />}
                />
                <TabItem 
                  label="Knowledge Quiz" 
                  active={activeTab === 'Quiz'} 
                  onClick={() => setActiveTab('Quiz')}
                  icon={<Award className="w-4 h-4" />}
                />
            </div>

            {activeTab === 'Content' && (
                <div className="space-y-12 animate-in fade-in slide-in-from-left-4 duration-500">
                    {lesson.video_url && (
                        <div className="relative aspect-video rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 group cursor-pointer">
                            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] z-10 flex items-center justify-center transition-opacity hover:opacity-0">
                                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform shadow-2xl">
                                    <Play className="w-10 h-10 text-white fill-current" />
                                </div>
                            </div>
                            <img
                                src={`https://images.unsplash.com/photo-1592754898573-5825de100c8f?auto=format&fit=crop&q=80&w=1200`}
                                alt="Lesson Visual"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                    )}

                    <div className="deen-card p-10 md:p-16">
                      <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-bold prose-p:text-lg prose-p:leading-relaxed prose-p:font-serif prose-p:text-slate-600 dark:prose-p:text-slate-400">
                          <ReactMarkdown>{lesson.content_markdown}</ReactMarkdown>
                      </article>

                      {!lesson.quiz && !quizResult && (
                          <div className="mt-16 pt-12 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
                              <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/40 flex items-center justify-center text-brand-600">
                                    <CheckCircle2 className="w-6 h-6" />
                                  </div>
                                  <div>
                                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">Knowledge Assimilation</h4>
                                      <p className="text-xs text-slate-500 font-medium">Have you reflected on these concepts?</p>
                                  </div>
                              </div>
                              <button
                                  onClick={handleMarkComplete}
                                  disabled={submitting}
                                  className="btn-primary px-12 py-4 flex items-center gap-3 w-full md:w-auto shadow-xl shadow-brand-600/30"
                              >
                                  {submitting ? 'Processing...' : 'Mark as Complete'}
                                  <ArrowRight className="w-4 h-4" />
                              </button>
                          </div>
                      )}
                    </div>
                </div>
            )}

            {activeTab === 'Quiz' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                    {lesson.quiz && !quizResult && (
                        <div className="deen-card p-10 md:p-16 border-0 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none"></div>
                            
                            <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8 mb-16 px-4">
                                <div className="w-16 h-16 bg-brand-600 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-brand-600/30">
                                    <Zap className="w-8 h-8 fill-current" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white">{lesson.quiz.title}</h2>
                                    <p className="text-slate-500 font-medium mt-1">Challenge your understanding through this assessment.</p>
                                </div>
                            </div>

                            <div className="space-y-16">
                                {lesson.quiz.questions.map((q, idx) => (
                                    <div key={q.id} className="space-y-8 px-4">
                                        <div className="flex items-start gap-5">
                                          <div className="text-4xl font-display font-bold text-brand-100 dark:text-slate-800 select-none">
                                            {String(idx + 1).padStart(2, '0')}
                                          </div>
                                          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mt-2 leading-snug">
                                              {q.text}
                                          </h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-0 md:ml-12">
                                            {q.options.map((option, optIdx) => (
                                                <button
                                                    key={optIdx}
                                                    onClick={() => handleOptionSelect(q.id, optIdx)}
                                                    className={`p-6 rounded-3xl border-2 text-left transition-all relative overflow-hidden group/opt ${quizAnswers[q.id] === optIdx
                                                        ? 'bg-brand-50/50 dark:bg-brand-900/10 border-brand-500 shadow-lg'
                                                        : 'bg-slate-50 dark:bg-slate-900 border-transparent hover:border-slate-100 dark:hover:border-slate-800'
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between gap-4 relative z-10">
                                                      <span className={`text-lg font-bold flex-1 ${quizAnswers[q.id] === optIdx ? 'text-brand-700 dark:text-brand-300' : 'text-slate-600 dark:text-slate-400'}`}>
                                                        {option}
                                                      </span>
                                                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${quizAnswers[q.id] === optIdx
                                                          ? 'border-brand-500 bg-brand-500 text-white scale-110 shadow-lg shadow-brand-500/30'
                                                          : 'border-slate-200 dark:border-slate-800'
                                                          }`}>
                                                          {quizAnswers[q.id] === optIdx && <Check className="w-3.5 h-3.5" strokeWidth={4} />}
                                                      </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-20 flex flex-col items-center gap-6">
                                <button
                                    onClick={handleSubmitQuiz}
                                    disabled={submitting || Object.keys(quizAnswers).length < lesson.quiz.questions.length}
                                    className="btn-primary px-16 py-5 shadow-2xl shadow-brand-600/30 flex items-center gap-4 disabled:opacity-30 disabled:shadow-none"
                                >
                                    {submitting ? (
                                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                      <>
                                        <span>Submit Assessment</span>
                                        <ArrowRight className="w-5 h-5" />
                                      </>
                                    )}
                                </button>
                                {Object.keys(quizAnswers).length < lesson.quiz.questions.length && (
                                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Info className="w-3 h-3" />
                                    Please answer all {lesson.quiz.questions.length} questions
                                  </p>
                                )}
                            </div>
                        </div>
                    )}

                    {quizResult && (
                        <div className="deen-card p-12 md:p-20 text-center animate-in zoom-in-95 duration-700 relative overflow-hidden">
                            <div className="absolute inset-x-0 top-0 h-2 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]"></div>
                            
                            <div className="w-24 h-24 bg-emerald-500 text-white rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-emerald-500/30 mx-auto mb-10 relative">
                                <Trophy className="w-10 h-10" />
                                <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-amber-400 animate-bounce" />
                            </div>
                            
                            <h2 className="text-4xl font-display font-bold text-slate-900 dark:text-white mb-4 tracking-tight">Kudos on Completion!</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-lg mb-12 max-w-md mx-auto">
                              Your dedication to seeking knowledge is truly inspiring. May it be a source of constant growth.
                            </p>
                            
                            <div className="max-w-xs mx-auto mb-16 p-8 bg-emerald-50 dark:bg-emerald-950/20 rounded-[2.5rem] border border-emerald-100 dark:border-emerald-900/30">
                              <div className="text-[10px] uppercase font-bold tracking-[0.3em] text-emerald-600 mb-2">Academic Score</div>
                              <div className="text-6xl font-display font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">{quizResult.score}%</div>
                            </div>

                            <button
                                onClick={() => navigate(-1)}
                                className="btn-primary px-12 py-4 shadow-xl"
                            >
                                Continue Your Journey
                            </button>
                        </div>
                    )}

                    {!lesson.quiz && !quizResult && (
                        <div className="p-32 text-center deen-card border-2 border-dashed border-slate-200 dark:border-slate-800 bg-transparent flex flex-col items-center">
                            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-200 mb-8">
                                <Award className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">No Quiz Required</h3>
                            <p className="text-slate-500 max-w-sm font-medium leading-relaxed">
                              This academic module is focused on deep spiritual reflection and contemplation. No formal assessment is necessary.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

function TabItem({ label, active, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 md:flex-none px-10 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-3 ${
        active 
          ? 'bg-white dark:bg-slate-800 text-brand-600 shadow-elevated border border-slate-100 dark:border-slate-700' 
          : 'text-slate-500 hover:text-brand-600'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}
