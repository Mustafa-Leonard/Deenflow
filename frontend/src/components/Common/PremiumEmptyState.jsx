import React from 'react'
import { Sparkles, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function PremiumEmptyState({ title, description, icon: Icon, badge, actionText, actionLink }) {
  const navigate = useNavigate()
  
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-fade-in">
      <div className="relative mb-10">
        <div className="absolute inset-0 bg-brand-500/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
        <div className="relative w-32 h-32 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center shadow-2xl">
          <Icon className="w-14 h-14 text-brand-600" />
        </div>
        <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-brand-500 flex items-center justify-center text-white shadow-xl shadow-brand-500/40 animate-bounce">
          <Sparkles className="w-6 h-6" />
        </div>
      </div>
      
      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-full text-xs font-bold tracking-widest uppercase mb-6 border border-brand-100 dark:border-brand-900/40">
        <Sparkles className="w-3 h-3" />
        <span>{badge || 'Coming Soon'}</span>
      </div>
      
      <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-6 tracking-tight max-w-2xl">
        {title}
      </h2>
      <p className="text-slate-500 dark:text-slate-400 text-xl font-medium max-w-xl leading-relaxed mb-10 italic">
        {description}
      </p>
      
      {actionText && (
        <button 
          onClick={() => navigate(actionLink || '/app/dashboard')}
          className="btn-primary py-4 px-10 text-lg flex items-center gap-3 active:scale-95 transition-all"
        >
          {actionText}
          <ArrowRight className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}
