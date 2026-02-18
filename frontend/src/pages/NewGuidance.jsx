import React, { useState } from 'react'
import api from '../api'
import Loader from '../components/Loader'
import { useNavigate } from 'react-router-dom'

export default function NewGuidance() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const submit = async () => {
    if (!text.trim()) return alert('Please describe your situation')
    setLoading(true)
    try {
      const r = await api.post('/guidance/', { input_text: text })
      nav(`/app/result/${r.data.id}`)
    } catch (e) {
      alert('Failed to analyze. Please try again.')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
          Ask AI Scholar
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">
          Receive guidance based on Islamic principles and scholarly wisdom
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Input Area */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center text-xl shadow-sm">
                  ✍️
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white">Describe Your Situation</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Be as specific as possible for the best advice</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="E.g., I am facing a difficult decision at work regarding a project that might involve ethical ambiguity. The details are..."
                className="w-full min-h-[300px] p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none text-slate-900 dark:text-white leading-relaxed placeholder-slate-400 resize-none shadow-inner"
              />

              <div className="mt-6 flex items-center justify-end gap-4">
                {loading && (
                  <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 text-sm font-medium animate-pulse">
                    <Loader />
                    <span>Analyzing with DeenFlow AI...</span>
                  </div>
                )}
                <button
                  onClick={submit}
                  disabled={loading}
                  className={`px-8 py-3 rounded-xl font-bold text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-brand-500/20 flex items-center gap-2 ${loading
                      ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed'
                      : 'bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-600'
                    }`}
                >
                  <span>{loading ? 'Processing...' : 'Get Guidance'}</span>
                  {!loading && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/10 rounded-3xl p-6 border border-blue-100 dark:border-blue-900/30">
            <div className="flex items-start gap-3 mb-3">
              <span className="text-2xl">💡</span>
              <h3 className="font-bold text-blue-900 dark:text-blue-100">Tips for Best Results</h3>
            </div>
            <ul className="space-y-3 text-sm text-blue-800 dark:text-blue-200/80">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></span>
                Details matter: Mention who is involved and the specific conflict.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></span>
                Context: Is this work, family, or personal?
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></span>
                Intent: What is your goal in this situation?
              </li>
            </ul>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl p-6 border border-emerald-100 dark:border-emerald-900/30">
            <div className="flex items-start gap-3 mb-3">
              <span className="text-2xl">🔒</span>
              <h3 className="font-bold text-emerald-900 dark:text-emerald-100">Private & Secure</h3>
            </div>
            <p className="text-sm text-emerald-800 dark:text-emerald-200/80 leading-relaxed">
              Your questions are private. While AI analyzes them to provide guidance, your personal identity remains protected.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
