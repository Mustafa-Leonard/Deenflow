import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import AuthContext from '../../contexts/AuthContext'

const memberLinkClass = ({ isActive }) =>
    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden " +
    (isActive
        ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-lg shadow-brand-500/30 translate-x-1'
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-brand-600 dark:hover:text-brand-400 hover:translate-x-1')

export default function AppSidebar() {
    const { user } = useContext(AuthContext)

    return (
        <aside className="w-72 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 fixed h-full flex flex-col z-50 transition-all duration-300">
            {/* Branding - Fixed Top */}
            <div className="h-20 flex items-center px-6 border-b border-slate-100 dark:border-slate-800/50 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md">
                <div className="flex items-center gap-2 group cursor-pointer">
                    <img
                        src="/deenflow-icon.svg"
                        alt="DeenFlow Icon"
                        className="w-10 h-10 transition-transform group-hover:scale-105"
                    />
                    <div>
                        <img
                            src="/deenflow-logo.svg"
                            alt="DeenFlow"
                            className="h-7 w-auto"
                        />
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse"></span>
                            <span className="text-[10px] uppercase tracking-wider text-brand-600 dark:text-brand-400 font-bold">
                                Member Portal
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto py-6 px-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700 hover:scrollbar-thumb-slate-300 dark:hover:scrollbar-thumb-slate-600">

                {/* User Profile Card */}
                <div className="mb-8 relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-500 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                    <div className="relative p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg font-bold text-brand-600 dark:text-brand-400 ring-2 ring-white dark:ring-slate-700 shadow-sm transition-transform group-hover:scale-105">
                                    {user?.full_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                                </div>
                                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                    {user?.full_name || user?.username}
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                                    Knowledge Seeker
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-800">
                            <p className="text-[10px] italic text-slate-400 dark:text-slate-500 text-center font-medium leading-relaxed">
                                "Seek knowledge from the cradle to the grave"
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-8">
                    <div>
                        <div className="flex items-center gap-2 px-4 mb-3 opacity-60">
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase">
                                Dashboard
                            </span>
                            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
                        </div>
                        <div className="space-y-1">
                            <NavLink to="/app/dashboard" className={memberLinkClass}>
                                <span className="text-xl transition-transform duration-300 group-hover:scale-110">🏠</span>
                                <span className="font-medium tracking-wide">Overview</span>
                            </NavLink>
                            <NavLink to="/app/ask-ai" className={memberLinkClass}>
                                <span className="text-xl transition-transform duration-300 group-hover:scale-110">🤖</span>
                                <span className="font-medium tracking-wide">Ask AI Scholar</span>
                            </NavLink>
                            <NavLink to="/app/quran" className={memberLinkClass}>
                                <span className="text-xl transition-transform duration-300 group-hover:scale-110">🕌</span>
                                <span className="font-medium tracking-wide">Qur'an</span>
                            </NavLink>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 px-4 mb-3 opacity-60">
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase">
                                Personal
                            </span>
                            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
                        </div>
                        <div className="space-y-1">
                            <NavLink to="/app/planner" className={memberLinkClass}>
                                <span className="text-xl transition-transform duration-300 group-hover:scale-110">📈</span>
                                <span className="font-medium tracking-wide">Deen Planner</span>
                            </NavLink>
                            <NavLink to="/app/my-questions" className={memberLinkClass}>
                                <span className="text-xl transition-transform duration-300 group-hover:scale-110">💬</span>
                                <span className="font-medium tracking-wide">My Questions</span>
                            </NavLink>
                            <NavLink to="/app/saved" className={memberLinkClass}>
                                <span className="text-xl transition-transform duration-300 group-hover:scale-110">🔖</span>
                                <span className="font-medium tracking-wide">Saved Items</span>
                            </NavLink>
                            <NavLink to="/app/learning" className={memberLinkClass}>
                                <span className="text-xl transition-transform duration-300 group-hover:scale-110">🎓</span>
                                <span className="font-medium tracking-wide">Learning Paths</span>
                            </NavLink>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 px-4 mb-3 opacity-60">
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase">
                                Growth & Support
                            </span>
                            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
                        </div>
                        <div className="space-y-1">
                            <NavLink to="/app/upgrade" className={memberLinkClass}>
                                <span className="text-xl transition-transform duration-300 group-hover:scale-110">💎</span>
                                <span className="font-medium tracking-wide">Upgrade to Premium</span>
                            </NavLink>
                            <NavLink to="/app/donations" className={memberLinkClass}>
                                <span className="text-xl transition-transform duration-300 group-hover:scale-110">🤝</span>
                                <span className="font-medium tracking-wide">Donations & Zakat</span>
                            </NavLink>
                            <NavLink to="/app/consultation" className={memberLinkClass}>
                                <span className="text-xl transition-transform duration-300 group-hover:scale-110">👨‍🏫</span>
                                <span className="font-medium tracking-wide">Consultations</span>
                            </NavLink>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 px-4 mb-3 opacity-60">
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase">
                                Settings
                            </span>
                            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
                        </div>
                        <div className="space-y-1">
                            <NavLink to="/app/profile" className={memberLinkClass}>
                                <span className="text-xl transition-transform duration-300 group-hover:scale-110">👤</span>
                                <span className="font-medium tracking-wide">Profile</span>
                            </NavLink>
                            <NavLink to="/app/settings" className={memberLinkClass}>
                                <span className="text-xl transition-transform duration-300 group-hover:scale-110">⚙️</span>
                                <span className="font-medium tracking-wide">Preferences</span>
                            </NavLink>
                        </div>
                    </div>

                    {/* Admin Link */}
                    {user?.is_admin && (
                        <div>
                            <div className="flex items-center gap-2 px-4 mb-3 opacity-80">
                                <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 tracking-widest uppercase">
                                    Admin Access
                                </span>
                                <div className="flex-1 h-px bg-brand-200 dark:bg-brand-900/50"></div>
                            </div>
                            <NavLink to="/admin/dashboard" className={memberLinkClass}>
                                <span className="text-xl transition-transform duration-300 group-hover:scale-110">🔐</span>
                                <span className="font-medium tracking-wide">Admin Panel</span>
                            </NavLink>
                        </div>
                    )}
                </nav>

                {/* Daily Reminder Widget */}
                <div className="mt-8 mx-1 relative overflow-hidden rounded-2xl group shadow-lg shadow-brand-900/20">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-700 to-brand-900 transition-transform duration-500 group-hover:scale-105"></div>
                    {/* Decorative circles */}
                    <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
                    <div className="absolute -left-4 -bottom-4 w-16 h-16 bg-black/20 rounded-full blur-xl"></div>

                    <div className="relative p-5 text-white">
                        <div className="flex items-center justify-between mb-3 opacity-90">
                            <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full">Reminder</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                        </div>
                        <p className="text-sm font-medium leading-relaxed italic opacity-95 mb-3">
                            "The best of you are those who learn the Quran and teach it"
                        </p>
                        <div className="flex items-center gap-2 border-t border-white/10 pt-2">
                            <span className="text-lg">📜</span>
                            <span className="text-[10px] font-bold uppercase tracking-wide opacity-75">
                                Prophet Muhammad ﷺ
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-sm">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    <span className="hover:text-brand-600 transition-colors cursor-default">DeenFlow v2.0</span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        Online
                    </span>
                </div>
            </div>
        </aside>
    )
}
