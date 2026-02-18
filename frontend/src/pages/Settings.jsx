import React, { useState, useContext } from 'react'
import Card from '../components/Card'
import ThemeContext from '../contexts/ThemeContext'

export default function Settings() {
  const [madhab, setMadhab] = useState('Hanafi')
  const { theme, toggleTheme } = useContext(ThemeContext)

  return (
    <div className="pt-24 max-w-2xl animate-in fade-in duration-700">
      <div className="mb-10">
        <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight">App <span className="text-brand-600">Settings</span></h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Customize your library experience and analysis context.</p>
      </div>

      <Card className="p-10 bg-white dark:bg-slate-900 border-0 shadow-soft rounded-[2.5rem] space-y-10">
        <div className="space-y-6">
          <div className="pb-4 border-b border-slate-50 dark:border-slate-800">
            <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white tracking-tight leading-tight">Jurisprudential Context</h3>
            <p className="text-sm text-slate-400 font-medium mt-1">Select your preferred Madhab for more relevant analysis.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['Hanafi', "Shafi'i", 'Maliki', 'Hanbali'].map(m => (
              <button
                key={m}
                onClick={() => setMadhab(m)}
                className={`px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all border ${madhab === m ? 'bg-slate-950 dark:bg-brand-600 text-white border-slate-950 dark:border-brand-600 shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-100 dark:border-slate-700 hover:border-slate-300'}`}
              >
                {m}
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
              className={`w-14 h-8 rounded-full p-1 transition-all duration-300 ${theme === 'dark' ? 'bg-brand-500' : 'bg-slate-200'}`}
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
          </div>
        </div>

        <div className="pt-6">
          <button className="w-full bg-slate-950 dark:bg-brand-600 hover:bg-slate-800 dark:hover:bg-brand-700 text-white py-4 rounded-2xl font-bold transition-all shadow-xl active:scale-[0.98]">Save All Preferences</button>
        </div>
      </Card>
    </div>
  )
}
