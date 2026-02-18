import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../../contexts/AuthContext'
import { ThemeContext } from '../../contexts/ThemeContext'

export default function AdminTopbar() {
    const navigate = useNavigate()
    const { user, logout } = useContext(AuthContext)
    const { theme, toggleTheme } = useContext(ThemeContext)
    const [showProfileMenu, setShowProfileMenu] = useState(false)
    const [showNotifications, setShowNotifications] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    const handleLogout = () => {
        logout()
        navigate('/admin/login')
    }

    return (
        <header className="fixed top-0 right-0 left-72 h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-40 transition-all duration-300">
            <div className="h-full px-8 flex items-center justify-between">
                {/* Global Command/Search */}
                <div className="flex-1 max-w-2xl">
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 group-focus-within:bg-brand-50 dark:group-focus-within:bg-brand-900/20 group-focus-within:text-brand-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Type to search content, users, or logs..."
                            className="w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl pl-14 pr-4 py-3 outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 shadow-sm"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 pointer-events-none">
                            <span className="text-[10px] bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded px-1.5 py-0.5 text-slate-400 font-mono">⌘</span>
                            <span className="text-[10px] bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded px-1.5 py-0.5 text-slate-400 font-mono">K</span>
                        </div>
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4 ml-6">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-all active:scale-95"
                        title="Toggle theme"
                    >
                        {theme === 'dark' ? '🌙' : '☀️'}
                    </button>

                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-all active:scale-95 relative"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse"></span>
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-200 dark:border-slate-800 overflow-hidden transform origin-top-right transition-all">
                                <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
                                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">Notifications</h3>
                                    <button className="text-[10px] text-brand-600 font-bold hover:underline">MARK ALL READ</button>
                                </div>
                                <div className="max-h-80 overflow-auto">
                                    <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500 dark:text-slate-400">
                                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                                            <span className="text-xl">🔔</span>
                                        </div>
                                        <p className="text-sm font-medium">No new notifications</p>
                                        <p className="text-xs opacity-70 mt-1">You're all caught up!</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="h-8 w-px bg-slate-200 dark:bg-slate-800"></div>

                    {/* Profile Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full border border-transparent hover:border-slate-200 dark:hover:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all group"
                        >
                            <div className="text-right hidden md:block">
                                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">
                                    {user?.full_name || 'Admin'}
                                </div>
                                <div className="text-[10px] text-slate-500 font-medium">
                                    Super Admin
                                </div>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 p-[2px] shadow-sm">
                                <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
                                    <span className="text-brand-600 font-bold text-xs">
                                        {user?.full_name?.charAt(0) || user?.username?.charAt(0) || 'A'}
                                    </span>
                                </div>
                            </div>
                        </button>

                        {showProfileMenu && (
                            <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-200 dark:border-slate-800 overflow-hidden transform origin-top-right">
                                <div className="p-2">
                                    <button
                                        onClick={() => navigate('/profile')}
                                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 transition-colors group"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            👤
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-slate-900 dark:text-white">Profile</div>
                                            <div className="text-[10px] text-slate-500">Edit your details</div>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => navigate('/settings')}
                                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 transition-colors group"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            ⚙️
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-slate-900 dark:text-white">Settings</div>
                                            <div className="text-[10px] text-slate-500">System preferences</div>
                                        </div>
                                    </button>

                                    <div className="my-2 border-t border-slate-100 dark:border-slate-800"></div>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 group flex items-center gap-3 transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            🛑
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-red-600">Sign Out</div>
                                            <div className="text-[10px] text-slate-500 group-hover:text-red-500/80">End session</div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
