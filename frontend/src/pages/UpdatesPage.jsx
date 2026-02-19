import React from 'react'
import { Link } from 'react-router-dom'

const updates = [
    {
        date: 'February 19, 2026',
        title: 'DeenFlow v2.1 — Admin Panel Enhancements',
        type: 'feature',
        description: 'Launched new admin pages including AI Configuration, Scholars Management, Roles & Permissions, Categories & Tags, Content Editor, and Moderation Queue.',
        highlights: [
            'AI Configuration with system prompt editing and safety filters',
            'Scholar management with specialization tracking and task assignment',
            'Granular role-based access control with permission matrix',
            'Content editor with Quran/Hadith source referencing',
        ]
    },
    {
        date: 'February 17, 2026',
        title: 'Admin Dashboard & Branding',
        type: 'improvement',
        description: 'Enhanced admin dashboard with system health monitoring, report export, and official DeenFlow branding across all pages.',
        highlights: [
            'System health real-time monitoring',
            'PDF/CSV report export functionality',
            'Official DeenFlow logo integration',
        ]
    },
    {
        date: 'February 15, 2026',
        title: 'Quran Reader v2',
        type: 'feature',
        description: 'Completely revamped Quran reading experience with Arabic text, translations, transliterations, audio recitations, and Juz navigation.',
        highlights: [
            'Multiple translator support',
            'Audio recitation playback',
            'Juz-based navigation',
            'Bookmark and sharing features',
        ]
    },
    {
        date: 'February 12, 2026',
        title: 'Member Dashboard & Deen Planner',
        type: 'feature',
        description: 'New member dashboard with personalized widgets, daily ayah, and the Deen Planner for tracking worship consistency.',
        highlights: [
            'Daily Ayah widget with reflection prompts',
            'Deen Planner for salah, Quran, and dhikr tracking',
            'Personalized learning path recommendations',
        ]
    },
]

const typeColors = {
    feature: 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400',
    improvement: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    fix: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
}

export default function UpdatesPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group">
                        <img src="/deenflow-icon.svg" alt="DeenFlow" className="w-8 h-8 transition-transform group-hover:scale-110" />
                        <img src="/deenflow-logo.svg" alt="DeenFlow" className="h-5 w-auto" />
                    </Link>
                    <Link to="/login" className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors">
                        ← Back to App
                    </Link>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-16">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Updates & Announcements</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-12">
                    Stay informed about the latest features, improvements, and changes to DeenFlow.
                </p>

                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800" />

                    <div className="space-y-10">
                        {updates.map((update, idx) => (
                            <div key={idx} className="relative pl-12">
                                {/* Timeline dot */}
                                <div className="absolute left-2.5 top-6 w-3 h-3 rounded-full bg-brand-500 ring-4 ring-slate-50 dark:ring-slate-950" />

                                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${typeColors[update.type]}`}>
                                            {update.type}
                                        </span>
                                        <span className="text-xs text-slate-400">{update.date}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{update.title}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{update.description}</p>
                                    <ul className="space-y-1.5">
                                        {update.highlights.map((h, i) => (
                                            <li key={i} className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />
                                                {h}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}
