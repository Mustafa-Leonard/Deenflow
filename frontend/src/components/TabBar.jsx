import React from 'react'

export default function TabBar({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1">
      {tabs.map(t => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`px-6 py-2.5 rounded-[1.5rem] text-sm font-bold transition-all duration-300 ${t === active ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'}`}
        >
          {t}
        </button>
      ))}
    </div>
  )
}
