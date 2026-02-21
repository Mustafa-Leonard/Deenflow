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

    const handleMarkComplete = async () => {
        try {
            await api.post(`/learning/lessons/${id}/complete/`)
            // Find next lesson if available
            // This would require path context or a more complex API response
            // For now, just show success
            alert('Lesson marked as complete! BarakAllah Feek.')
        } catch (err) {
            console.error('Failed to complete lesson:', err)
        }
    }

    if (loading) return <div className="p-20 text-center animate-pulse text-slate-500">Opening module...</div>

    if (error === 'PREMIUM_REQUIRED') {
        return (
            <div className="max-w-3xl mx-auto py-20 px-4 text-center">
                <div className="w-24 h-24 bg-amber-500/10 rounded-3xl flex items-center justify-center text-5xl mx-auto mb-8">
                    🔒
                </div>
                <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-4">
                    Exclusive Academy Content
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mb-10 text-lg">
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
                className="mb-8 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand-600 transition-colors"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                <div className="mb-12 aspect-video rounded-[2.5rem] overflow-hidden bg-slate-100 dark:bg-slate-900 shadow-2xl border border-white/5">
                    {/* Placeholder for video player */}
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-4">
                        <svg className="w-20 h-20 opacity-20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M10 15.065V8.935L15 12L10 15.065ZM12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
                        </svg>
                        <span className="font-bold text-sm uppercase tracking-widest">Video Stream Unavailable (Mock)</span>
                    </div>
                </div>
            )}

            <article className="prose prose-slate dark:prose-invert max-w-none mb-16">
                <ReactMarkdown>{lesson.content_markdown}</ReactMarkdown>
            </article>

            <div className="pt-12 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Knowledge Check</span>
                    <span className="text-slate-900 dark:text-white font-bold">Ready for the quiz?</span>
                </div>
                <button
                    onClick={handleMarkComplete}
                    className="px-10 py-5 bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-500 hover:to-emerald-500 text-white font-bold rounded-2xl shadow-xl shadow-brand-600/20 transition-all active:scale-[0.98] flex items-center gap-3"
                >
                    Mark as Complete
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </button>
            </div>
        </div>
    )
}
