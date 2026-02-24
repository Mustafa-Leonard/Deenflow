import React, { useState, useContext, useEffect } from 'react'
import Card from '../components/Card'
import ThemeContext from '../contexts/ThemeContext'
import AuthContext from '../contexts/AuthContext'

export default function Settings() {
  const { user, updateProfile } = useContext(AuthContext)
  const { theme, toggleTheme } = useContext(ThemeContext)

  const [madhab, setMadhab] = useState(user?.madhhab || 'hanafi')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    if (user?.madhhab) setMadhab(user.madhhab)
  }, [user])

  const handleSave = async () => {
    setLoading(true)
    setMessage({ type: '', text: '' })
    try {
      // Sync theme to profile too if desired
      await updateProfile({
        madhhab: madhab,
        theme: theme
      })
      setMessage({ type: 'success', text: 'All preferences saved successfully!' })
      // Auto-clear message
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save preferences. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const madhabOptions = [
    { label: 'Hanafi', value: 'hanafi' },
    { label: "Shafi'i", value: 'shafii' },
    { label: 'Maliki', value: 'maliki' },
    { label: 'Hanbali', value: 'hanbali' }
  ]

  return (
    <div className="pt-24 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-10">
        <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight">App <span className="text-brand-600">Settings</span></h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Customize your library experience and analysis context.</p>
      </div>

      <Card className="p-10 bg-white dark:bg-slate-900 border-0 shadow-soft rounded-[2.5rem] space-y-10">
        {message.text && (
          <div className={`p-4 rounded-2xl font-bold text-sm text-center animate-in zoom-in duration-300 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400'}`}>
            {message.type === 'success' ? '✨ ' : '⚠️ '}{message.text}
          </div>
        )}

        <div className="space-y-6">
          <div className="pb-4 border-b border-slate-50 dark:border-slate-800">
            <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white tracking-tight leading-tight">Jurisprudential Context</h3>
            <p className="text-sm text-slate-400 font-medium mt-1">Select your preferred Madhab for more relevant analysis.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {madhabOptions.map(m => (
              <button
                key={m.value}
                onClick={() => setMadhab(m.value)}
                className={`px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all border ${madhab === m.value ? 'bg-slate-950 dark:bg-brand-600 text-white border-slate-950 dark:border-brand-600 shadow-lg scale-105' : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-100 dark:border-slate-700 hover:border-slate-300'}`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-50 dark:border-slate-800">
            <div>
              <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white tracking-tight leading-tight">Interface Theme</h3>
              <p className="text-sm text-slate-400 font-medium mt-1">Adjust the appearance of the application.</p>
            </div>
            <button
              onClick={toggleTheme}
              className={`w-14 h-8 rounded-full p-1 transition-all duration-300 relative ${theme === 'dark' ? 'bg-brand-500' : 'bg-slate-200'}`}
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center text-[10px] ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`}>
                {theme === 'dark' ? '🌙' : '☀️'}
              </div>
            </button>
          </div>
        </div>

        <div className="pt-6">
          <button
            disabled={loading}
            onClick={handleSave}
            className="w-full bg-slate-950 dark:bg-brand-600 hover:bg-slate-800 dark:hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : null}
            {loading ? 'Saving...' : 'Save All Preferences'}
          </button>
        </div>
      </Card>
    </div>
  )
}
