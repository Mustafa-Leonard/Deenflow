import React, { useEffect, useState, useContext } from 'react'
import api from '../api'
import { useNavigate, Link } from 'react-router-dom'
import AuthContext from '../contexts/AuthContext'
import { 
  Sparkles, 
  History, 
  Zap, 
  ArrowRight, 
  Clock, 
  TrendingUp, 
  BookOpen, 
  GraduationCap, 
  Star,
  Users,
  Compass,
  Layout,
  Calendar,
  Activity
} from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, reflections: 0, recent: [] })
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

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
          recent: hist.data.slice(0, 4)
        })
      } catch (e) { console.error(e) }
    }
    fetchData()
  }, [])

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24 animate-in fade-in duration-700">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 py-4">
        <div>
          <div className="flex items-center gap-2 text-brand-600 font-bold text-xs uppercase tracking-[0.2em] mb-2">
            <Compass className="w-4 h-4" />
            Spiritual Sanctuary
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
            Assalamu Alaikum, <span className="text-brand-600">{user?.full_name?.split(' ')[0] || user?.username || 'User'}</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-4 text-lg font-medium max-w-2xl">
            "Indeed, in the remembrance of Allah do hearts find rest." Welcome back to your holistic Islamic life center.
          </p>
        </div>
        
        <div className="flex gap-4">
           <Link 
            to="/app/planner" 
            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-600 dark:text-slate-300 font-bold text-sm hover:border-brand-500 hover:text-brand-600 transition-all shadow-sm"
           >
             <Calendar className="w-4 h-4" />
             My Planner/Daily
           </Link>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatItem 
          label="Guidance Analysis" 
          value={stats.total} 
          icon={<Zap className="w-5 h-5 text-brand-600" />} 
          delay="0"
        />
        <StatItem 
          label="Deep Reflections" 
          value={stats.reflections} 
          icon={<BookOpen className="w-5 h-5 text-indigo-600" />} 
          delay="100"
        />
        <StatItem 
          label="Planner Streak" 
          value="7 Days" 
          icon={<TrendingUp className="w-5 h-5 text-emerald-600" />} 
          delay="200"
        />
        <StatItem 
          label="Academy XP" 
          value="1,240" 
          icon={<GraduationCap className="w-5 h-5 text-amber-600" />} 
          delay="300"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        {/* Left: Quick Actions & Recent Activity */}
        <div className="xl:col-span-2 space-y-12">
          {/* Hero CTA */}
          <div className="deen-card p-10 bg-slate-900 dark:bg-slate-900 border-0 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-110"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-display font-bold mb-4 leading-tight">Navigating Modern Life with Ancient Wisdom</h2>
                <p className="text-slate-400 mb-8 max-w-md font-medium">DeenFlow uses advanced analysis to provide Islamic context for any situation you encounter.</p>
                <Link 
                  to="/new" 
                  className="inline-flex items-center gap-3 bg-brand-600 hover:bg-brand-500 text-white px-10 py-4 rounded-[2rem] font-bold transition-all shadow-2xl shadow-brand-600/30 group/btn"
                >
                  Start New Spiritual Analysis
                  <Sparkles className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                </Link>
              </div>
              <div className="w-48 h-48 bg-white/5 rounded-[3rem] backdrop-blur-md border border-white/10 flex items-center justify-center p-8 shrink-0">
                 <Zap className="w-full h-full text-brand-400 opacity-20" />
                 <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-20 h-20 bg-brand-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                      <Sparkles className="w-8 h-8 text-white" />
                   </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Activity Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-xl">
                  <Activity className="w-5 h-5 text-brand-600" />
                </div>
                <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Recent Correspondence</h3>
              </div>
              <Link to="/history" className="text-xs font-bold text-slate-400 hover:text-brand-600 uppercase tracking-widest transition-colors flex items-center gap-2">
                View Full Logs
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stats.recent.map((r, idx) => (
                <div 
                  key={r.id} 
                  onClick={() => navigate(`/app/guidance/${r.slug || r.id}`)}
                  className="deen-card p-6 flex items-start gap-5 group cursor-pointer hover:border-brand-500 transition-all animate-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-brand-50 dark:group-hover:bg-brand-900/30 transition-colors shrink-0 overflow-hidden relative">
                    <div className="absolute inset-0 islamic-accent opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    <Clock className="w-6 h-6 text-slate-300 group-hover:text-brand-600 transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 mb-1 leading-snug">
                      {r.input_text}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">{r.category || 'Spiritual'}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest tabular-nums">{new Date(r.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
              {stats.recent.length === 0 && (
                <div className="col-span-full p-20 text-center deen-card border-2 border-dashed border-slate-100 bg-transparent flex flex-col items-center">
                   <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mb-6">
                     <History className="w-8 h-8" />
                   </div>
                   <p className="text-slate-400 font-bold uppercase tracking-widest">No Analyzed Guidance Yet</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right: Insights & Features Sidebar */}
        <div className="space-y-12">
          {/* Platform Status / Insight Card */}
          <div className="deen-card p-10 bg-brand-50/50 dark:bg-brand-900/10 border-brand-200/50 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 bg-brand-200/30 rounded-full blur-3xl pointer-events-none"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-brand-500/10 flex items-center justify-center text-brand-600 mb-8">
                  <Star className="w-7 h-7 fill-current" />
                </div>
                <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight leading-tight mb-4">Ethical Analysis Engine</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-serif italic text-base">
                  DeenFlow respects the sanctity of your queries. Every insight is generated with extreme caution, referencing verified scholarly perspectives to ensure alignment with Islamic principles.
                </p>
              </div>
              <div className="mt-10 pt-8 border-t border-brand-200/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-brand-400 uppercase tracking-[0.2em]">Spiritual Alignment Index</span>
                  <span className="text-[10px] font-bold text-brand-600 tabular-nums">100% Verified</span>
                </div>
                <div className="h-1.5 bg-brand-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-600 w-full rounded-full shadow-[0_0_10px_rgba(72,192,143,0.5)]"></div>
                </div>
              </div>
          </div>

          <div className="deen-card p-8 space-y-8">
             <SidebarFeatureTile 
              title="Quranic Journey" 
              desc="Continue where you left off in your study." 
              icon={<BookOpen className="w-5 h-5" />} 
              link="/app/quran"
             />
             <SidebarFeatureTile 
              title="Academy Sessions" 
              desc="Structured modules for deeper mastery." 
              icon={<GraduationCap className="w-5 h-5" />} 
              link="/app/academy"
             />
             <SidebarFeatureTile 
              title="Member Support" 
              desc="Reach out to our administrators." 
              icon={<Users className="w-5 h-5" />} 
              link="/app/messages"
             />
          </div>

          <div className="px-6 py-6 bg-slate-900 rounded-[2.5rem] flex items-center gap-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-brand-600/10 islamic-accent opacity-50"></div>
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/10 group-hover:rotate-6 transition-transform">
               <Zap className="w-8 h-8 text-brand-400" />
            </div>
            <div>
               <h4 className="font-bold text-white mb-1">Impact Wallet</h4>
               <p className="text-slate-400 text-xs font-medium">Auto-distribute your Sadaqah.</p>
            </div>
            <Link to="/app/donations" className="absolute inset-0"></Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatItem({ label, value, icon, delay }) {
  return (
    <div className={`deen-card p-8 relative overflow-hidden group hover:border-brand-500 transition-all duration-500 animate-in zoom-in-95`} style={{ animationDelay: `${delay}ms` }}>
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-50 dark:bg-slate-800/50 rounded-full blur-2xl group-hover:bg-brand-50 transition-colors pointer-events-none"></div>
      <div className="relative z-10 flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowRight className="w-4 h-4 text-brand-600" />
        </div>
      </div>
      <div className="relative z-10">
        <div className="text-3xl font-display font-bold text-slate-900 dark:text-white tabular-nums mb-1">{value}</div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{label}</div>
      </div>
    </div>
  )
}

function SidebarFeatureTile({ title, desc, icon, link }) {
  return (
    <Link to={link} className="flex gap-4 group cursor-pointer border-b border-slate-50 dark:border-slate-800/50 pb-8 last:pb-0 last:border-0">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-brand-600 group-hover:text-white transition-all shadow-sm">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors mb-1">{title}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{desc}</p>
      </div>
    </Link>
  )
}
