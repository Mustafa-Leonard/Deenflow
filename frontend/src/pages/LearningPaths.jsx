import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import Card from '../components/Card'

export default function LearningPaths() {
    const [paths, setPaths] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        api.get('/learning/paths/').then(res => {
            setPaths(res.data)
            setLoading(false)
        })
    }, [])

    if (loading) return <div className="p-20 text-center">Loading paths...</div>

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div>
                <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
                    Structured <span className="text-brand-600">Learning</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
                    Guided paths designed by scholars to master your deen.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paths.map(path => (
                    <Card key={path.id} className="p-0 overflow-hidden flex flex-col group h-full rounded-[2.5rem] border-0 shadow-lg hover:shadow-2xl transition-all duration-500">
                        <div className="h-48 bg-slate-200 relative">
                            {path.thumbnail ? (
                                <img src={path.thumbnail} alt={path.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-brand-600 to-indigo-600 flex items-center justify-center text-4xl">
                                    📚
                                </div>
                            )}
                            <div className="absolute top-4 right-4 flex gap-2">
                                {path.is_premium && (
                                    <span className="px-3 py-1 bg-amber-500 text-brand-950 text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1 shadow-lg">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" />
                                        </svg>
                                        Premium
                                    </span>
                                )}
                                <span className="px-3 py-1 bg-white/90 text-slate-900 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                                    {path.difficulty}
                                </span>
                            </div>
                        </div>
                        <div className="p-8 flex-1 flex flex-col">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-brand-600 transition-colors">
                                {path.title}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-6 flex-1">
                                {path.description}
                            </p>
                            <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50 dark:border-slate-800">
                                <div className="text-xs font-bold text-slate-400 tracking-widest uppercase">
                                    {path.lessons_count} Modules
                                </div>
                                <button
                                    onClick={() => navigate(`/app/learning/${path.slug}`)}
                                    className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all active:scale-95"
                                >
                                    Explore Academy
                                </button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
