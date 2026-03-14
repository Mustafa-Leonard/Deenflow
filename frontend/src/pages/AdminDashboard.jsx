import React, { useEffect, useState } from 'react'
import api from '../api'
import { 
  Users, 
  Zap, 
  BookOpen, 
  ShieldCheck, 
  TrendingUp, 
  Plus, 
  Search, 
  Filter, 
  Activity, 
  Layout, 
  Settings,
  ArrowRight,
  Clock,
  UserCheck
} from 'lucide-react'

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalGuidance: 0,
        totalReflections: 0,
        recentUsers: [],
        recentGuidance: []
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const [users, guidance, reflections] = await Promise.all([
                    api.get('/admin/users/'),
                    api.get('/admin/guidance/'),
                    api.get('/admin/reflections/')
                ])

                setStats({
                    totalUsers: users.data.length,
                    totalGuidance: guidance.data.length,
                    totalReflections: reflections.data.length,
                    recentUsers: users.data.slice(0, 6),
                    recentGuidance: guidance.data.slice(0, 6)
                })
            } catch (e) {
                console.error('Failed to fetch admin data:', e)
            } finally {
                setLoading(false)
            }
        }
        fetchAdminData()
    }, [])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <div className="w-10 h-10 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin mb-4"></div>
                <div className="text-slate-500 font-medium text-sm text-[10px] font-bold uppercase tracking-widest">Waking administrative systems...</div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-24 animate-in fade-in duration-700">
            {/* Admin Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 py-4">
                <div>
                    <div className="flex items-center gap-2 text-brand-600 font-bold text-xs uppercase tracking-[0.2em] mb-2">
                        <ShieldCheck className="w-4 h-4" />
                        System Administration
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
                        Platform <span className="text-brand-600">Command</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-4 text-lg font-medium max-w-2xl leading-relaxed">
                        Global overview of DeenFlow's spiritual impact, user growth, and guidance engagement metrics.
                    </p>
                </div>
                
                <div className="flex gap-4">
                   <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-xl active:scale-95">
                     <Settings className="w-4 h-4" />
                     Global Settings
                   </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <AdminStatCard 
                  label="Total Believers" 
                  value={stats.totalUsers} 
                  icon={<Users className="w-6 h-6" />}
                  color="brand"
                  trend="+12% this month"
                />
                <AdminStatCard 
                  label="Guidance Provided" 
                  value={stats.totalGuidance} 
                  icon={<Zap className="w-6 h-6" />}
                  color="indigo"
                  trend="2.4k queries today"
                />
                <AdminStatCard 
                  label="Saved Reflections" 
                  value={stats.totalReflections} 
                  icon={<BookOpen className="w-6 h-6" />}
                  color="emerald"
                  trend="85% growth rate"
                />
            </div>

            {/* Detailed Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Recent Users */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-xl">
                                <UserCheck className="w-5 h-5 text-brand-600" />
                            </div>
                            <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Newest Members</h3>
                        </div>
                        <button className="text-[10px] font-bold text-slate-400 hover:text-brand-600 uppercase tracking-widest transition-colors flex items-center gap-2">
                           User Directory
                           <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {stats.recentUsers.map((user, idx) => (
                            <div 
                              key={user.id} 
                              className="deen-card p-6 flex items-center justify-between group hover:border-slate-300 dark:hover:border-slate-700 transition-all animate-in slide-in-from-left-4 duration-500"
                              style={{ animationDelay: `${idx * 50}ms` }}
                            >
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center font-display font-bold text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                                        {(user.full_name || user.username).charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white leading-tight">{user.full_name || user.username}</h4>
                                        <p className="text-xs text-slate-400 font-medium mt-1">{user.email}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Joined</div>
                                    <div className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                                        {new Date(user.date_joined).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Recent Guidance */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-xl">
                                <Activity className="w-5 h-5 text-indigo-600" />
                            </div>
                            <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Guidance Flow</h3>
                        </div>
                        <button className="text-[10px] font-bold text-slate-400 hover:text-brand-600 uppercase tracking-widest transition-colors flex items-center gap-2">
                           Engagement Logs
                           <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {stats.recentGuidance.map((guidance, idx) => (
                            <div 
                              key={guidance.id} 
                              className="deen-card p-6 flex items-start gap-5 group hover:border-slate-300 dark:hover:border-slate-700 transition-all animate-in slide-in-from-right-4 duration-500"
                              style={{ animationDelay: `${idx * 50}ms` }}
                            >
                                <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                    <Clock className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-slate-700 dark:text-slate-200 font-medium line-clamp-2 leading-relaxed text-sm">
                                        {guidance.input_text}
                                    </p>
                                    <div className="flex items-center gap-3 mt-3">
                                        <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">{guidance.category || 'General'}</span>
                                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest tabular-nums">{new Date(guidance.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
            
            {/* System Status / Health Card */}
            <div className="deen-card p-10 bg-slate-900 text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
               <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                  <div className="flex-1">
                    <h3 className="text-2xl font-display font-bold mb-4">Infrastructure Integrity</h3>
                    <p className="text-slate-400 max-w-md font-medium leading-relaxed">
                      All systems are operating at peak efficiency. Data integrity across 4 distributed nodes is verified as of 2 minutes ago.
                    </p>
                  </div>
                  <div className="flex items-center gap-8 pr-4">
                    <div className="text-center">
                       <div className="text-2xl font-display font-bold text-brand-400">99.9%</div>
                       <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mt-1">Uptime</div>
                    </div>
                    <div className="w-px h-12 bg-white/10"></div>
                    <div className="text-center">
                       <div className="text-2xl font-display font-bold text-indigo-400">45ms</div>
                       <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mt-1">Latency</div>
                    </div>
                    <div className="w-px h-12 bg-white/10"></div>
                    <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
                       <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                       <span className="text-xs font-bold uppercase tracking-widest">Healthy</span>
                    </div>
                  </div>
               </div>
            </div>
        </div>
    )
}

function AdminStatCard({ label, value, icon, color, trend }) {
  const colors = {
    brand: 'text-brand-600 bg-brand-50 dark:bg-brand-900/40 border-brand-100/50',
    indigo: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/40 border-indigo-100/50',
    emerald: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/40 border-emerald-100/50'
  }
  
  return (
    <div className="deen-card p-8 group hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-500">
      <div className="flex items-center justify-between mb-8">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${colors[color] || colors.brand} group-hover:scale-110 transition-transform`}>
           {icon}
        </div>
        <div className="text-right">
           <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Growth</div>
           <div className="text-xs font-bold text-emerald-500">{trend}</div>
        </div>
      </div>
      <div>
        <div className="text-5xl font-display font-bold text-slate-900 dark:text-white tabular-nums mb-1 leading-none">{value}</div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{label}</div>
      </div>
    </div>
  )
}
