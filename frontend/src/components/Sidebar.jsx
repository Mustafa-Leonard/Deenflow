import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import AuthContext from '../contexts/AuthContext'
import { 
  LayoutDashboard, 
  Sparkles, 
  History, 
  BookOpen, 
  Calendar, 
  GraduationCap, 
  Heart, 
  Users, 
  MessageSquare, 
  User, 
  Settings, 
  ShieldCheck,
  Compass,
  Zap,
  Star
} from 'lucide-react'

const linkClass = ({ isActive }) =>
  "flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 font-bold text-xs uppercase tracking-widest group " +
  (isActive
    ? 'bg-brand-600 text-white shadow-xl shadow-brand-600/20 active-nav-link'
    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-brand-600')

export default function Sidebar() {
  const { user } = useContext(AuthContext)

  return (
    <aside className="w-80 bg-white dark:bg-slate-950 border-r border-slate-100 dark:border-slate-800 pt-24 fixed h-full overflow-y-auto custom-scrollbar z-40 transition-all duration-300">
      <nav className="px-6 py-8 space-y-2 pb-32">
        <NavLink to="/app/dashboard" className={linkClass}>
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </NavLink>
        
        <div className="pt-6 pb-2 text-[10px] uppercase tracking-[0.3em] font-bold text-slate-300 dark:text-slate-600 px-5 flex items-center justify-between">
           Guidance
           <Sparkles className="w-3 h-3" />
        </div>
        <NavLink to="/app/new" className={linkClass}>
          <Zap className="w-4 h-4" />
          New Insight
        </NavLink>
        <NavLink to="/app/history" className={linkClass}>
          <History className="w-4 h-4" />
          Inquiry Log
        </NavLink>
        <NavLink to="/app/reflections" className={linkClass}>
          <Star className="w-4 h-4" />
          Reflections
        </NavLink>

        <div className="pt-6 pb-2 text-[10px] uppercase tracking-[0.3em] font-bold text-slate-300 dark:text-slate-600 px-5 flex items-center justify-between">
           Knowledge
           <BookOpen className="w-3 h-3" />
        </div>
        <NavLink to="/app/quran" className={linkClass}>
          <Compass className="w-4 h-4" />
          Noble Quran
        </NavLink>
        <NavLink to="/app/academy" className={linkClass}>
          <GraduationCap className="w-4 h-4" />
          Academy
        </NavLink>
        <NavLink to="/app/planner" className={linkClass}>
          <Calendar className="w-4 h-4" />
          Deen Planner
        </NavLink>

        <div className="pt-6 pb-2 text-[10px] uppercase tracking-[0.3em] font-bold text-slate-300 dark:text-slate-600 px-5 flex items-center justify-between">
           Community
           <Users className="w-3 h-3" />
        </div>
        <NavLink to="/app/consultations" className={linkClass}>
          <Users className="w-4 h-4" />
          Consultations
        </NavLink>
        <NavLink to="/app/donations" className={linkClass}>
          <Heart className="w-4 h-4" />
          Charity
        </NavLink>
        <NavLink to="/app/messages" className={linkClass}>
          <MessageSquare className="w-4 h-4" />
          Messages
        </NavLink>

        {user?.is_admin && (
          <>
            <div className="pt-8 pb-2 text-[10px] uppercase tracking-[0.3em] font-bold text-slate-300 dark:text-slate-600 px-5 flex items-center justify-between">
              Administrative
              <ShieldCheck className="w-3 h-3" />
            </div>
            <NavLink to="/app/admin" className={linkClass}>
              <LayoutDashboard className="w-4 h-4" />
              Command Center
            </NavLink>
          </>
        )}

        <div className="pt-8 pb-2 text-[10px] uppercase tracking-[0.3em] font-bold text-slate-300 dark:text-slate-600 px-5 flex items-center justify-between">
          Personal
          <Settings className="w-3 h-3" />
        </div>
        <NavLink to="/app/profile" className={linkClass}>
          <User className="w-4 h-4" />
          Identity
        </NavLink>
        <NavLink to="/app/settings" className={linkClass}>
          <Settings className="w-4 h-4" />
          Prefrences
        </NavLink>
      </nav>

      {/* Upgrade CTA */}
      <div className="mt-auto px-6 mb-12">
        <div className="p-6 bg-slate-900 rounded-3xl text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-brand-600/10 islamic-accent opacity-50"></div>
          <div className="relative z-10">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-400 mb-2">Level Up</div>
            <div className="text-sm font-bold mb-4 leading-tight">Unlock Scholar Access</div>
            <NavLink 
              to="/app/upgrade" 
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 px-4 py-2 rounded-xl text-[10px] font-bold transition-all shadow-lg shadow-brand-600/20 active:scale-95 uppercase tracking-widest"
            >
              Plus Plans
            </NavLink>
          </div>
          <div className="absolute right-[-15px] bottom-[-15px] opacity-10 group-hover:rotate-12 transition-transform">
             <Star className="w-20 h-20 fill-current" />
          </div>
        </div>
      </div>
    </aside>
  )
}
