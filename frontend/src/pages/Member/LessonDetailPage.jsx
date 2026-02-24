import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import api from '../../api'

export default function LessonDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [lesson, setLesson] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

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
            alert(`Please answer all questions before submitting. (${answeredCount}/${totalCount})`)
            return
        }

        setSubmitting(true)
        try {
            const res = await api.post(`/learning/lessons/${id}/complete/`, {
                answers: quizAnswers
            })
            setQuizResult(res.data)
            alert(`Alhamdulillah! Quiz submitted. Your score: ${res.data.score}%`)
        } catch (err) {
            console.error('Failed to submit quiz:', err)
            alert('Failed to submit quiz. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    const handleMarkComplete = async () => {
        setSubmitting(true)
        try {
            await api.post(`/learning/lessons/${id}/complete/`)
            alert('Lesson marked as complete! BarakAllah Feek.')
            setQuizResult({ score: 100, success: true })
        } catch (err) {
            console.error('Failed to complete lesson:', err)
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-brand-200 dark:border-brand-900 border-t-brand-600 rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium animate-pulse">Opening module...</p>
            </div>
        </div>
    )

    if (error === 'PREMIUM_REQUIRED') {
        return (
            <div className="max-w-3xl mx-auto py-20 px-4 text-center">
                <div className="w-24 h-24 bg-amber-500/10 rounded-3xl flex items-center justify-center text-5xl mx-auto mb-8 animate-bounce">
                    🔒
                </div>
                <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white mb-4">
                    Exclusive Academy Content
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mb-10 text-lg leading-relaxed">
                    This lesson is part of our specialized premium curriculum.
                    Upgrade your account to unlock full access to this and 65+ other lessons.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => navigate('/app/upgrade')}
                        className="w-full sm:w-auto px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-brand-600/20 active:scale-95"
                    >
                        Explore Plans
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full sm:w-auto px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl transition-all hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        )
    }

    if (!lesson) return <div className="p-20 text-center">Lesson not found.</div>

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in duration-700">
            <button
                onClick={() => navigate(-1)}
                className="mb-8 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand-600 transition-colors group"
            >
                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Path
            </button>

            <header className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-bold text-brand-600 uppercase tracking-widest px-3 py-1 bg-brand-50 dark:bg-brand-900/20 rounded-lg">
                        Lesson {lesson.order}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">{lesson.duration_minutes} Minutes</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white leading-tight">
                    {lesson.title}
                </h1>
            </header>

            {lesson.video_url && (
                <div className="mb-12 aspect-video rounded-[2.5rem] overflow-hidden bg-slate-100 dark:bg-slate-900 shadow-2xl border border-white/5 group relative">
                    {/* Placeholder for video player */}
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-4 bg-slate-900/40 backdrop-blur-sm absolute inset-0 z-10 transition-opacity group-hover:opacity-0">
                        <svg className="w-20 h-20 text-brand-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M10 15.065V8.935L15 12L10 15.065ZM12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
                        </svg>
                    </div>
                    <img
                        src={`https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80`}
                        alt="Lesson Thumbnail"
                        className="w-full h-full object-cover blur-[2px]"
                    />
                </div>
            )}

            <article className="prose prose-slate dark:prose-invert max-w-none mb-16">
                <ReactMarkdown>{lesson.content_markdown}</ReactMarkdown>
            </article>

            {/* Quiz Section */}
            {lesson.quiz && !quizResult && (
                <div className="mb-16 p-8 md:p-10 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl shadow-brand-500/5">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-14 h-14 bg-brand-500 text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-brand-500/20">
                            📝
                        </div>
                        <div>
                            <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">{lesson.quiz.title}</h2>
                            <p className="text-slate-500 font-medium">Verify your understanding of this module</p>
                        </div>
                    </div>

                    <div className="space-y-12">
                        {lesson.quiz.questions.map((q, idx) => (
                            <div key={q.id} className="space-y-6">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex gap-3">
                                    <span className="text-brand-600">Q{idx + 1}.</span>
                                    {q.text}
                                </h3>
                                <div className="grid gap-3">
                                    {q.options.map((option, optIdx) => (
                                        <button
                                            key={optIdx}
                                            onClick={() => handleOptionSelect(q.id, optIdx)}
                                            className={`p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between group ${quizAnswers[q.id] === optIdx
                                                ? 'bg-brand-50 dark:bg-brand-900/20 border-brand-500 text-brand-700 dark:text-brand-400'
                                                : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                                                }`}
                                        >
                                            <span className="font-medium">{option}</span>
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${quizAnswers[q.id] === optIdx
                                                ? 'border-brand-500 bg-brand-500 text-white'
                                                : 'border-slate-300 dark:border-slate-600'
                                                }`}>
                                                {quizAnswers[q.id] === optIdx && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 flex justify-center">
                        <button
                            onClick={handleSubmitQuiz}
                            disabled={submitting}
                            className="px-12 py-5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl shadow-xl shadow-brand-600/30 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3"
                        >
                            {submitting ? 'Submitting...' : 'Submit Answers'}
                            {!submitting && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>}
                        </button>
                    </div>
                </div>
            )}

            {quizResult && (
                <div className="mb-16 p-10 bg-emerald-50 dark:bg-emerald-900/10 rounded-[3rem] border border-emerald-200 dark:border-emerald-800/50 text-center animate-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 bg-emerald-500 text-white rounded-[2rem] flex items-center justify-center text-4xl mx-auto mb-6 shadow-lg shadow-emerald-500/20">
                        🎉
                    </div>
                    <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">Module Completed!</h2>
                    <p className="text-emerald-700 dark:text-emerald-400 font-bold text-xl mb-8">Score: {quizResult.score}%</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold rounded-2xl border border-emerald-200 dark:border-emerald-800 shadow-sm hover:shadow-md transition-all"
                    >
                        Return to Syllabus
                    </button>
                </div>
            )}

            {!lesson.quiz && !quizResult && (
                <div className="pt-12 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Completion</span>
                        <span className="text-slate-900 dark:text-white font-bold">Finished the module?</span>
                    </div>
                    <button
                        onClick={handleMarkComplete}
                        disabled={submitting}
                        className="px-10 py-5 bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-500 hover:to-emerald-500 text-white font-bold rounded-2xl shadow-xl shadow-brand-600/20 transition-all active:scale-[0.98] flex items-center gap-3"
                    >
                        {submitting ? 'Processing...' : 'Mark as Complete'}
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    )
}
