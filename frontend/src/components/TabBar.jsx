import React from 'react'
import { Sparkles } from 'lucide-react'

export default function TabBar({ tabs, active, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-900/50 backdrop-blur-md rounded-[2rem] border border-slate-100 dark:border-slate-800/50 w-fit">
      {tabs.map(t => {
        const isActive = t === active
        return (
          <button
            key={t}
            onClick={() => onChange(t)}
            className={`
              relative px-6 py-3 rounded-[1.5rem] text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500 flex items-center gap-2
              ${isActive 
                ? 'bg-white dark:bg-slate-800 text-brand-600 shadow-xl shadow-brand-600/5 translate-y-[-1px]' 
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50/50 dark:hover:bg-slate-800/30'
              }
            `}
          >
            {isActive && <div className="w-1.5 h-1.5 bg-brand-600 rounded-full animate-pulse"></div>}
            {t}
          </button>
        )
      })}
    </div>
  )
}
