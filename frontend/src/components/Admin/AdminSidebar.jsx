import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import AuthContext from '../../contexts/AuthContext'

const adminLinkClass = ({ isActive }) =>
    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group " +
    (isActive
        ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-lg shadow-brand-500/30 translate-x-1'
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-brand-600 dark:hover:text-brand-400 hover:translate-x-1')

export default function AdminSidebar() {
    const { user } = useContext(AuthContext)

    const menuSections = [
        {
            title: 'OVERVIEW',
            items: [
                { to: '/admin/dashboard', icon: '📊', label: 'Dashboard' }
            ]
        },
        {
            title: 'CONTENT & MEDIA',
            items: [
                { to: '/admin/content', icon: '📝', label: 'Content Management' },
                { to: '/admin/fiqh', icon: '⚖️', label: 'Fiqh Library' },
                { to: '/admin/reviews', icon: '✅', label: 'Moderation Queue' },
                { to: '/admin/quran', icon: '🕌', label: "Qur'an Management" }
            ]
        },
        {
            title: 'INTELLIGENCE',
            items: [
                { to: '/admin/ai/logs', icon: '🧠', label: 'AI Interactions' },
                { to: '/admin/ai/flagged', icon: '🚩', label: 'Flagged Responses' },
                { to: '/admin/settings/ai', icon: '⚙️', label: 'AI Configuration' }
            ]
        },
        {
            title: 'COMMUNITY',
            items: [
                { to: '/admin/scholars', icon: '👳', label: 'Scholars' },
                { to: '/admin/users', icon: '👥', label: 'User Base' },
                { to: '/admin/roles', icon: '🔐', label: 'Access Control' }
            ]
        },
        {
            title: 'SYSTEM',
            items: [
                { to: '/admin/moderation', icon: '🛡️', label: 'Moderation' },
                { to: '/admin/analytics', icon: '📈', label: 'Analytics' },
                { to: '/admin/audit', icon: '📋', label: 'Audit Trail' }
            ]
        }
    ]

    return (
        <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 fixed h-full overflow-hidden flex flex-col transition-colors duration-300 z-50">
            {/* Branding - Fixed Top */}
            <div className="h-20 flex items-center px-6 border-b border-slate-100 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                <div className="flex items-center gap-2 group cursor-pointer">
                    <img
                        src="/deenflow-icon.svg"
                        alt="DeenFlow Icon"
                        className="w-10 h-10 transition-transform group-hover:scale-105 flex-shrink-0"
                    />
                    <div>
                        <img
                            src="/deenflow-logo.svg"
                            alt="DeenFlow"
                            className="h-7 w-auto"
                        />
                        <div className="text-[10px] uppercase tracking-wider text-brand-600 dark:text-brand-400 font-semibold mt-0.5">
                            Admin Portal
                        </div>
                    </div>
                </div>
            </div>

            {/* Scrollable Navigation */}
            <div className="flex-1 overflow-y-auto py-6 px-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700 hover:scrollbar-thumb-slate-300 dark:hover:scrollbar-thumb-slate-600">
                {/* Admin Profile Card */}
                <div className="mb-8 p-1 rounded-2xl bg-gradient-to-br from-brand-500/10 via-purple-500/10 to-blue-500/10">
                    <div className="p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-white/50 dark:border-slate-700/50">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-lg font-bold text-slate-600 dark:text-slate-300 ring-2 ring-white dark:ring-slate-700 shadow-md">
                                    {user?.full_name?.charAt(0) || user?.username?.charAt(0) || 'A'}
                                </div>
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                    {user?.full_name || user?.username || 'Admin User'}
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                    {user?.email || 'admin@deenflow.com'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <nav className="space-y-8">
                    {menuSections.map((section) => (
                        <div key={section.title}>
                            <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 px-4 mb-3 tracking-widest uppercase opacity-80">
                                {section.title}
                            </div>
                            <div className="space-y-1">
                                {section.items.map((item) => (
                                    <NavLink key={item.to} to={item.to} className={adminLinkClass}>
                                        <span className="text-xl transition-transform duration-300 group-hover:scale-110">{item.icon}</span>
                                        <span className="font-medium tracking-wide">{item.label}</span>
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 font-medium">
                    <span>v2.0.0 Pro</span>
                    <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        System Online
                    </span>
                </div>
            </div>
        </aside>
    )
}
