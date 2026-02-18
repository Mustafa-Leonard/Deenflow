import React, { useEffect, useState, useContext } from 'react'
import api from '../api'
import Card from '../components/Card'
import { useNavigate, Link } from 'react-router-dom'
import AuthContext from '../contexts/AuthContext'

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, reflections: 0, recent: [] })
  const { user } = useContext(AuthContext)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hist, refl] = await Promise.all([
          api.get('/guidance/history/'),
          api.get('/guidance/reflections/')
        ])
        setStats({
          total: hist.data.length,
          reflections: refl.data.length,
          recent: hist.data.slice(0, 3)
        })
      } catch (e) { console.error(e) }
    }
    fetchData()
  }, [])

  return (
    <div className="pt-24 animate-in fade-in duration-700">
      <div className="mb-10">
        <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight">Assalamu Alaikum, <span className="text-brand-600">{user?.full_name?.split(' ')[0] || user?.username || 'User'}</span></h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Your Islamic life context dashboard is ready.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Card className="flex flex-col justify-center p-8 bg-white dark:bg-slate-900 border-0 shadow-soft hover:shadow-elevated transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="text-sm font-bold text-slate-400 uppercase tracking-[0.15em] mb-2">Total Insights</div>
          <div className="text-5xl font-display font-bold text-slate-900 dark:text-white leading-none">{stats.total}</div>
        </Card>

        <Card className="flex flex-col justify-center p-8 bg-white dark:bg-slate-900 border-0 shadow-soft hover:shadow-elevated transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 dark:text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <div className="text-sm font-bold text-slate-400 uppercase tracking-[0.15em] mb-2">Reflections</div>
          <div className="text-5xl font-display font-bold text-brand-600 leading-none">{stats.reflections}</div>
        </Card>

        <Card className="flex flex-col justify-center p-8 bg-slate-950 dark:bg-brand-600 border-0 shadow-elevated text-white relative overflow-hidden group translate-y-0 hover:-translate-y-1 transition-all duration-300">
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-brand-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
          <div className="relative z-10">
            <div className="text-sm font-bold opacity-60 uppercase tracking-[0.15em] mb-4">Quick Action</div>
            <Link to="/new" className="inline-flex items-center gap-2 bg-brand-500 dark:bg-slate-900 hover:bg-brand-400 dark:hover:bg-slate-800 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg active:scale-95 group text-sm">
              Start New Analysis
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white tracking-tight">Recent Activity</h3>
            <Link to="/history" className="text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors uppercase tracking-widest px-2 py-1">View All</Link>
          </div>
          <div className="space-y-4">
            {stats.recent.map((r, idx) => (
              <Card key={r.id} className="p-5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-soft transition-all cursor-pointer group animate-in slide-in-from-bottom duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-brand-50 dark:group-hover:bg-brand-900/30 group-hover:text-brand-500 transition-colors flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-slate-700 dark:text-slate-200 font-medium line-clamp-1 leading-snug">{r.input_text}</div>
                    <div className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-wider">{new Date(r.created_at).toLocaleDateString()} &bull; {r.category || 'General'}</div>
                  </div>
                </div>
              </Card>
            ))}
            {stats.recent.length === 0 && (
              <div className="py-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                <p className="text-slate-400 font-medium italic">No recent activities to show.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-brand-50/50 dark:bg-brand-900/10 rounded-[2.5rem] p-10 relative overflow-hidden flex flex-col justify-between border border-brand-100/50 dark:border-brand-800/30 transition-colors duration-300">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-brand-200/20 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex items-center justify-center text-brand-600 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight leading-tight mb-4">Islamic Principles for Daily Life</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              DeenFlow uses advanced analysis to help you navigate modern life's complexities while staying true to your faith. Every insight is generated with context-awareness and respect for scholarly traditions.
            </p>
            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
              <span>Guidance</span>
              <span>&bull;</span>
              <span>Reflection</span>
              <span>&bull;</span>
              <span>Action</span>
            </div>
          </div>
          <div className="relative z-10 mt-8">
            <div className="h-1 bg-brand-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-brand-500 w-1/3 rounded-full"></div>
            </div>
            <div className="mt-2 text-[10px] font-bold text-brand-400 uppercase tracking-widest">Platform Status: Active</div>
          </div>
        </div>
      </div>
    </div>
  )
}
