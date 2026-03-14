import React, { useContext } from 'react'
import AuthContext from '../contexts/AuthContext'
import { 
  LogOut, 
  Bell, 
  Search, 
  User as UserIcon, 
  Sparkles, 
  ShieldCheck,
  Menu,
  Moon,
  Sun
} from 'lucide-react'

export default function Header() {
  const { user, logout } = useContext(AuthContext)
  
  return (
    <header className="flex items-center justify-between px-8 py-5 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl fixed w-full z-50 border-b border-slate-100 dark:border-slate-800/50 shadow-sm transition-all duration-300">
      <div className="flex items-center gap-12">
        {/* Brand */}
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.location.href = '/app/dashboard'}>
          <div className="w-10 h-10 bg-brand-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-brand-600/30 group-hover:rotate-12 transition-transform">
             <Sparkles className="w-6 h-6 fill-current" />
          </div>
          <div className="flex flex-col">
            <div className="font-display font-bold text-2xl tracking-tighter text-slate-950 dark:text-white leading-none">
              Deen<span className="text-brand-600">Flow</span>
            </div>
            <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-300 dark:text-slate-600 pl-0.5 mt-1">
              Contextual Guidance
            </div>
          </div>
        </div>

        {/* Global Search */}
        <div className="hidden lg:flex items-center relative group">
          <Search className="absolute left-4 w-4 h-4 text-slate-300 group-hover:text-brand-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search for wisdom..."
            className="w-96 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl py-2.5 pl-11 pr-4 text-xs font-bold outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        {/* Action Icons */}
        <div className="hidden md:flex items-center gap-2">
           <button className="p-2.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-xl transition-all relative">
             <Bell className="w-5 h-5" />
             <span className="absolute top-2 right-2 w-2 h-2 bg-brand-500 rounded-full border-2 border-white dark:border-slate-950"></span>
           </button>
           <button className="p-2.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-xl transition-all">
             <Sun className="w-5 h-5" />
           </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-5 pl-8 border-l border-slate-100 dark:border-slate-800">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-slate-900 dark:text-white leading-none mb-1">
              {user?.full_name || user?.username}
            </div>
            <div className="flex items-center justify-end gap-1.5">
               {user?.is_premium ? (
                 <span className="text-[9px] font-bold text-brand-600 uppercase tracking-widest flex items-center gap-1">
                    <ShieldCheck className="w-2.5 h-2.5" />
                    Premium User
                 </span>
               ) : (
                 <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Seeker Account</span>
               )}
            </div>
          </div>
          
          <div className="relative group">
             <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-900 shadow-xl flex items-center justify-center font-display font-bold text-slate-400 overflow-hidden ring-0 group-hover:ring-4 ring-brand-500/10 transition-all">
               {user?.profile_picture ? (
                 <img src={user.profile_picture} alt="" className="w-full h-full object-cover" />
               ) : (
                 <UserIcon className="w-6 h-6" />
               )}
             </div>
             
             {/* Simple Dropdown Trigger (Logout) */}
             <div className="absolute right-0 top-full pt-4 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all translate-y-2 group-hover:translate-y-0 w-48">
                <div className="deen-card p-2 shadow-2xl border-slate-100 dark:border-slate-800">
                   <button 
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 text-slate-600 hover:text-red-600 transition-all font-bold text-xs uppercase tracking-widest"
                   >
                     <LogOut className="w-4 h-4" />
                     Sign Out
                   </button>
                </div>
             </div>
          </div>

          <button className="md:hidden p-2.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  )
}
