import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../../api'
import AuthContext from '../../contexts/AuthContext'
import Card from '../../components/Card'

export default function LessonListPage() {
    const { slug } = useParams()
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()
    const [path, setPath] = useState(null)
    const [loading, setLoading] = useState(true)

    const isPremiumUser = user?.subscription?.slug === 'premium' || user?.subscription?.slug === 'pro' || user?.is_staff

    useEffect(() => {
        api.get(`/learning/paths/${slug}/`)
            .then(res => {
                setPath(res.data)
                setLoading(false)
            })
            .catch(err => {
                console.error('Failed to load path:', err)
                setLoading(false)
            })
    }, [slug])

    if (loading) return <div className="p-20 text-center animate-pulse text-slate-500">Retrieving academy syllabus...</div>
    if (!path) return <div className="p-20 text-center">Path not found.</div>

    const canAccessLessons = !path.is_premium || isPremiumUser

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="relative rounded-[3rem] overflow-hidden mb-12 shadow-2xl border border-white/10">
                <div className="absolute inset-0">
                    {path.thumbnail ? (
                        <img src={path.thumbnail} alt="" className="w-full h-full object-cover brightness-50" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-brand-900 via-slate-900 to-emerald-900" />
                    )}
                </div>

                <div className="relative p-12 md:p-16 flex flex-col md:flex-row items-end justify-between gap-8">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 bg-brand-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                                {path.difficulty}
                            </span>
                            {path.is_premium && (
                                <span className="px-3 py-1 bg-amber-500 text-brand-950 text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" />
                                    </svg>
                                    Premium
                                </span>
                            )}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 leading-tight">
                            {path.title}
                        </h1>
                        <p className="text-slate-300 text-lg leading-relaxed">
                            {path.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* Access Restriction Banner */}
            {!canAccessLessons && (
                <div className="mb-12 p-8 rounded-[2rem] bg-gradient-to-br from-amber-500/10 to-brand-500/10 border border-amber-500/20 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4 text-center md:text-left">
                        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center text-3xl">
                            🔒
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Premium Access Required</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">Upgrade to unlock this path and access all 65+ specialized Islamic lessons.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/app/upgrade')}
                        className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-brand-950 font-bold rounded-2xl transition-all shadow-xl shadow-amber-500/20 active:scale-95 whitespace-nowrap"
                    >
                        Unlock Full Academy
                    </button>
                </div>
            )}

            {/* Lesson List */}
            <div className="space-y-4">
                <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                    Academy Syllabus
                    <span className="text-sm font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{path.lessons?.length || 0} Modules</span>
                </h2>

                <div className="grid gap-4">
                    {path.lessons?.map((lesson, index) => (
                        <div
                            key={lesson.id}
                            className={`group p-6 rounded-3xl border transition-all duration-300 ${canAccessLessons
                                    ? 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-brand-500 hover:shadow-xl hover:shadow-brand-500/5 cursor-pointer'
                                    : 'bg-slate-50 dark:bg-slate-950/50 border-transparent opacity-75'
                                }`}
                            onClick={() => {
                                if (canAccessLessons) {
                                    navigate(`/app/lessons/${lesson.id}`)
                                }
                            }}
                        >
                            <div className="flex items-center justify-between gap-6">
                                <div className="flex items-center gap-6">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-display font-bold text-lg transition-colors ${canAccessLessons
                                            ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 group-hover:bg-brand-600 group-hover:text-white'
                                            : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                                        }`}>
                                        {lesson.order || index + 1}
                                    </div>
                                    <div>
                                        <h4 className={`text-lg font-bold transition-colors ${canAccessLessons
                                                ? 'text-slate-900 dark:text-white group-hover:text-brand-600'
                                                : 'text-slate-500'
                                            }`}>
                                            {lesson.title}
                                        </h4>
                                        <div className="text-sm text-slate-400 mt-1 flex items-center gap-4">
                                            <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider">
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                15 Minutes
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    {canAccessLessons ? (
                                        <div className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-300 group-hover:border-brand-500 group-hover:bg-brand-500 group-hover:text-white transition-all">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
