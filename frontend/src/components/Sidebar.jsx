import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import AuthContext from '../contexts/AuthContext'

const linkClass = ({ isActive }) =>
  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm group " +
  (isActive
    ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 shadow-sm border border-brand-100/50 dark:border-brand-800/50'
    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100')

export default function Sidebar() {
  const { user } = useContext(AuthContext)

  return (
    <aside className="w-72 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm border-r border-slate-200 dark:border-slate-800 pt-24 fixed h-full overflow-auto z-10 transition-all duration-300">
      <nav className="p-6 space-y-2">
        <NavLink to="/" className={linkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/new" className={linkClass}>
          New Guidance
        </NavLink>
        <NavLink to="/history" className={linkClass}>
          History
        </NavLink>
        <NavLink to="/reflections" className={linkClass}>
          Saved Reflections
        </NavLink>

        {user?.is_admin && (
          <>
            <div className="pt-6 pb-2 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 px-4">Admin</div>
            <NavLink to="/admin" className={linkClass}>
              Admin Dashboard
            </NavLink>
          </>
        )}

        <div className="pt-6 pb-2 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 px-4">Account</div>
        <NavLink to="/profile" className={linkClass}>
          Profile
        </NavLink>
        <NavLink to="/settings" className={linkClass}>
          Settings
        </NavLink>
      </nav>

      <div className="absolute bottom-10 left-6 right-6 p-6 bg-gradient-to-br from-brand-600 to-brand-700 rounded-3xl text-white shadow-lg overflow-hidden group">
        <div className="absolute top-0 right-0 -mr-4 -mt-4 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
        <div className="relative z-10">
          <div className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Coming Soon</div>
          <div className="text-sm font-bold mb-3">AI Community Insights</div>
          <button className="text-[10px] font-bold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg backdrop-blur-md transition-all">Notify Me</button>
        </div>
      </div>
    </aside>
  )
}
