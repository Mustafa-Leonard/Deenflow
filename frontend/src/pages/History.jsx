import React, { useEffect, useState } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'

export default function History() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const nav = useNavigate()

  useEffect(() => {
    api.get('/guidance/history/')
      .then(r => setItems(r.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-16 h-16 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
            Your Questions
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">
            Review past guidance and reflections
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-slate-500 dark:text-slate-400 text-sm font-bold">Total:</span>
          <span className="bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 text-xs font-extrabold px-2 py-1 rounded-lg">
            {items.length}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {items.length > 0 ? (
          items.map(i => (
            <div
              key={i.id}
              className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 hover:shadow-xl hover:shadow-brand-500/5 hover:border-brand-200 dark:hover:border-brand-800 transition-all duration-300 cursor-pointer relative overflow-hidden"
              onClick={() => nav(`/app/result/${i.id}`)}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg ${i.category ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                      {i.category || 'General'}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                      {new Date(i.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white line-clamp-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {i.input_text || 'No description provided'}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                    {i.ai_response ? i.ai_response.substring(0, 150) + '...' : 'Analysis in progress...'}
                  </p>
                </div>

                <div className="flex-shrink-0 flex items-center gap-3">
                  <button className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-brand-600 group-hover:text-white transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm">
              📜
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No history yet</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-8">
              Start by asking for guidance on a situation. Your past inquiries will appear here.
            </p>
            <button
              onClick={() => nav('/app/ask-ai')}
              className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg shadow-brand-500/20 transition-all hover:scale-105"
            >
              Start New Inquiry
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
