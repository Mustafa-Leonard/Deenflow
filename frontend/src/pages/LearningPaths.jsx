import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import { 
  GraduationCap, 
  Clock, 
  Lock, 
  ShieldCheck, 
  ChevronRight, 
  Sparkles, 
  BookOpen, 
  Layers,
  ArrowRight
} from 'lucide-react'

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

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <div className="w-10 h-10 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin mb-4"></div>
                <div className="text-slate-500 font-medium text-sm">Organizing academic paths...</div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 py-4">
                <div>
                    <div className="flex items-center gap-2 text-brand-600 font-bold text-xs uppercase tracking-[0.2em] mb-2">
                        <GraduationCap className="w-4 h-4" />
                        Scholar-Led Curriculum
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
                        Structured <span className="text-brand-600">Learning</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-4 text-lg font-medium max-w-2xl leading-relaxed">
                        Guided educational paths designed by scholars and educators to help you master foundational and advanced Islamic concepts.
                    </p>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paths.map(path => (
                    <div 
                      key={path.id} 
                      className="deen-card group p-0 overflow-hidden flex flex-col h-full hover:border-brand-300 transition-all duration-500"
                    >
                        {/* Thumbnail Wrap */}
                        <div className="h-56 relative overflow-hidden">
                            {path.thumbnail ? (
                                <img 
                                  src={path.thumbnail} 
                                  alt={path.title} 
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-brand-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-brand-600/10 islamic-accent opacity-30"></div>
                                    <BookOpen className="w-16 h-16 text-brand-300 relative z-10" />
                                </div>
                            )}
                            
                            {/* Overlay Badges */}
                            <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                                {path.is_premium && (
                                    <span className="px-3 py-1.5 bg-amber-500 text-brand-900 text-[9px] font-bold uppercase tracking-[0.15em] rounded-xl flex items-center gap-1.5 shadow-xl shadow-amber-500/20 backdrop-blur-md">
                                        <ShieldCheck className="w-3 h-3" />
                                        Premium
                                    </span>
                                )}
                                <span className="px-3 py-1.5 bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 text-[9px] font-bold uppercase tracking-[0.15em] rounded-xl shadow-xl backdrop-blur-md border border-white/20">
                                    {path.difficulty || 'General'}
                                </span>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-8 flex-1 flex flex-col relative">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-brand-600 transition-colors leading-tight">
                                {path.title}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8 flex-1 line-clamp-2 italic font-serif">
                                {path.description}
                            </p>
                            
                            <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50 dark:border-slate-800/50">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-brand-600">
                                      <Layers className="w-4 h-4" />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">
                                        {path.lessons_count || 0} Modules
                                    </span>
                                </div>
                                <button
                                    onClick={() => navigate(`/app/learning/${path.slug}`)}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-brand-50 hover:bg-brand-600 text-brand-600 hover:text-white rounded-xl text-xs font-bold transition-all active:scale-95 group/btn border border-brand-100 dark:border-brand-900/30"
                                >
                                    <span>Explore Path</span>
                                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Empty State */}
            {paths.length === 0 && (
              <div className="deen-card p-32 text-center border-2 border-dashed border-slate-100 bg-transparent flex flex-col items-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mb-8">
                      <GraduationCap className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">No Academy Paths Yet</h3>
                  <p className="text-slate-500 max-w-sm">Our scholars are currently curating new academic paths for you.</p>
              </div>
            )}
        </div>
    )
}
