import React from 'react'
import { Link } from 'react-router-dom'

const changes = [
    {
        version: 'v2.1.0',
        date: 'February 19, 2026',
        changes: [
            { type: 'added', text: 'Admin pages for AI Configuration, Scholars, Roles, and Moderation.' },
            { type: 'added', text: 'Global footer with comprehensive navigation and community links.' },
            { type: 'fixed', text: 'Layout overlapping issues on mobile devices.' },
            { type: 'improved', text: 'API response times for Quran search queries.' },
        ]
    },
    {
        version: 'v2.0.5',
        date: 'February 15, 2026',
        changes: [
            { type: 'added', text: 'Quran Reader audio recitation support.' },
            { type: 'fixed', text: 'Translation selection bug in Surah view.' },
        ]
    },
    {
        version: 'v2.0.0',
        date: 'February 10, 2026',
        changes: [
            { type: 'major', text: 'Platform re-launch with DeenFlow Branding.' },
            { type: 'added', text: 'AI Scholar integration for context-aware guidance.' },
            { type: 'added', text: 'Deen Planner for ibadah tracking.' },
        ]
    }
]

const badgeColors = {
    added: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    fixed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    improved: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    major: 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400',
}

export default function ChangelogPage() {
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
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Changelog</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-12">
                    Tracking every improvement and fix we bring to DeenFlow.
                </p>

                <div className="space-y-12">
                    {changes.map((item) => (
                        <section key={item.version} className="relative pl-8 border-l-2 border-slate-200 dark:border-slate-800">
                            <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-brand-500 border-4 border-slate-50 dark:border-slate-950" />
                            <div className="mb-4">
                                <span className="text-2xl font-bold text-slate-900 dark:text-white">{item.version}</span>
                                <span className="ml-4 text-sm text-slate-500 dark:text-slate-400">{item.date}</span>
                            </div>
                            <ul className="space-y-3">
                                {item.changes.map((change, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <span className={`mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${badgeColors[change.type]}`}>
                                            {change.type}
                                        </span>
                                        <span className="text-slate-600 dark:text-slate-400">{change.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ))}
                </div>
            </main>
        </div>
    )
}
