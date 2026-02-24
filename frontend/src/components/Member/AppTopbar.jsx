import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../../contexts/AuthContext'
import { ThemeContext } from '../../contexts/ThemeContext'

export default function AppTopbar({ setIsOpen }) {
    const navigate = useNavigate()
    const { user, logout } = useContext(AuthContext)
    const { theme, toggleTheme } = useContext(ThemeContext)
    const [showProfileMenu, setShowProfileMenu] = useState(false)
    const [showNotifications, setShowNotifications] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    // Mock notifications
    const notifications = [
        { id: 1, text: 'Your question was answered', time: '5m ago', unread: true },
        { id: 2, text: 'New lesson available: Tafsir Basics', time: '1h ago', unread: true },
        { id: 3, text: 'Community post liked', time: '2h ago', unread: false }
    ]

    const unreadCount = notifications.filter(n => n.unread).length

    return (
        <header className="fixed top-0 right-0 left-0 lg:left-72 h-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 z-40 transition-all duration-300">
            <div className="h-full px-4 sm:px-8 flex items-center justify-between max-w-7xl mx-auto w-full gap-4">

                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setIsOpen(true)}
                    className="lg:hidden p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 transition-all active:scale-95 flex-shrink-0"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                {/* Search Bar */}
                <div className="flex-1 max-w-xl md:block">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-brand-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative flex items-center">
                            <div className="absolute left-4 text-slate-400 group-focus-within:text-brand-500 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search..."
                                className="w-full bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-brand-500/50 dark:focus:border-brand-500/50 transition-all text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 shadow-sm"
                            />
                            <div className="absolute right-3 hidden xl:flex items-center gap-1">
                                <span className="text-[10px] font-bold text-slate-400 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">⌘K</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4 ml-8">

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-200 dark:hover:border-brand-800 hover:shadow-lg hover:shadow-brand-500/10 flex items-center justify-center transition-all group"
                        title="Toggle theme"
                    >
                        <span className="text-xl transform group-hover:rotate-45 transition-transform duration-300">
                            {theme === 'dark' ? '🌙' : '☀️'}
                        </span>
                    </button>

                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-200 dark:hover:border-brand-800 hover:shadow-lg hover:shadow-brand-500/10 flex items-center justify-center transition-all group relative"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            {unreadCount > 0 && (
                                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse"></span>
                            )}
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 mt-4 w-96 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-slate-800 overflow-hidden transform origin-top-right animate-in fade-in zoom-in-95 duration-200">
                                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50 backdrop-blur-sm">
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">You have {unreadCount} unread messages</p>
                                    </div>
                                    <button
                                        onClick={() => navigate('/app/notifications')}
                                        className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 bg-brand-50 dark:bg-brand-900/20 px-3 py-1.5 rounded-full transition-colors"
                                    >
                                        View All
                                    </button>
                                </div>
                                <div className="max-h-[400px] overflow-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                                    {notifications.length === 0 ? (
                                        <div className="p-12 text-center flex flex-col items-center">
                                            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-3xl mb-4 text-slate-300">
                                                🔔
                                            </div>
                                            <div className="text-sm font-medium text-slate-900 dark:text-white">No notifications</div>
                                            <p className="text-xs text-slate-500 mt-1">We'll notify you when something happens.</p>
                                        </div>
                                    ) : (
                                        notifications.map((notif) => (
                                            <div
                                                key={notif.id}
                                                className={`p-4 border-b last:border-0 border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group relative ${notif.unread ? 'bg-brand-50/30 dark:bg-brand-900/10' : ''
                                                    }`}
                                            >
                                                {notif.unread && (
                                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>
                                                )}
                                                <div className="flex items-start gap-4">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg ${notif.unread ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                                                        {notif.icon || '📢'}
                                                    </div>
                                                    <div className="flex-1 min-w-0 pt-0.5">
                                                        <div className={`text-sm ${notif.unread ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-600 dark:text-slate-300'}`}>
                                                            {notif.text}
                                                        </div>
                                                        <div className="text-xs text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-2">
                                                            <span>{notif.time}</span>
                                                            {notif.unread && <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Profile Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-800 group"
                        >
                            <div className="text-right hidden md:block">
                                <div className="text-sm font-bold text-slate-900 dark:text-white leading-none mb-1">
                                    {user?.full_name || user?.username}
                                </div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    Member
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-300 ring-4 ring-slate-50 dark:ring-slate-900">
                                {user?.full_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                            </div>
                        </button>

                        {showProfileMenu && (
                            <div className="absolute right-0 mt-4 w-72 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-slate-800 overflow-hidden transform origin-top-right animate-in fade-in zoom-in-95 duration-200">
                                <div className="p-6 bg-gradient-to-br from-brand-600 to-brand-800 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                                    <div className="relative z-10 flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-2xl font-bold shadow-inner">
                                            {user?.full_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                                        </div>
                                        <div>
                                            <div className="font-bold text-white text-lg">
                                                {user?.full_name || user?.username}
                                            </div>
                                            <div className="text-xs text-brand-100 font-medium opacity-90">
                                                {user?.email}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-2">
                                    <div className="space-y-1">
                                        <MenuLink icon="👤" label="My Profile" onClick={() => navigate('/app/profile')} />
                                        <MenuLink icon="⚙️" label="Settings" onClick={() => navigate('/app/settings')} />
                                        {user?.is_admin && (
                                            <MenuLink icon="🔐" label="Admin Panel" onClick={() => navigate('/admin/dashboard')} highlight />
                                        )}
                                    </div>

                                    <div className="my-2 border-t border-slate-100 dark:border-slate-800 mx-2"></div>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-bold text-red-600 dark:text-red-400 transition-all flex items-center gap-3 group"
                                    >
                                        <span className="text-lg grayscale group-hover:grayscale-0 transition-all">🚪</span>
                                        <span>Sign Out</span>
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

function MenuLink({ icon, label, onClick, highlight }) {
    return (
        <button
            onClick={onClick}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm font-bold flex items-center gap-3 group ${highlight
                ? 'bg-brand-50 text-brand-700 hover:bg-brand-100 dark:bg-brand-900/20 dark:text-brand-300'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
        >
            <span className="text-lg group-hover:scale-110 transition-transform">{icon}</span>
            <span>{label}</span>
        </button>
    )
}
