import React, { useContext } from 'react'
import AuthContext from '../contexts/AuthContext'

export default function Header() {
  const { user, logout } = useContext(AuthContext)
  return (
    <header className="flex items-center justify-between px-8 py-4 glass fixed w-full z-20 border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm transition-all duration-300">
      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <div className="font-display font-bold text-2xl tracking-tight text-slate-950 dark:text-white">Deen<span className="text-brand-600">Flow</span></div>
          <div className="text-[10px] uppercase tracking-[0.2em] font-semibold text-slate-400 -mt-1 pl-0.5">DeenInContext</div>
        </div>
      </div>

      <div className="hidden md:block font-display font-medium text-slate-600 dark:text-slate-400 uppercase tracking-widest text-xs">Islamic Life Context Guidance</div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-none">{user?.full_name || user?.username}</div>
          <div className="text-[10px] text-slate-400 font-medium mt-1 leading-none">Standard Account</div>
        </div>
        <button
          onClick={logout}
          className="bg-slate-900 dark:bg-brand-600 hover:bg-slate-800 dark:hover:bg-brand-700 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all shadow-md active:scale-95"
        >
          Logout
        </button>
      </div>
    </header>
  )
}
