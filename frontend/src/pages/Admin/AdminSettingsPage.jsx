import React, { useContext, useState } from 'react'
import { ThemeContext } from '../../contexts/ThemeContext'

const SECTIONS = [
    {
        id: 'general',
        title: 'General',
        icon: '⚙️'
    },
    {
        id: 'ai',
        title: 'AI Configuration',
        icon: '🧠'
    },
    {
        id: 'security',
        title: 'Security',
        icon: '🔐'
    },
    {
        id: 'notifications',
        title: 'Notifications',
        icon: '🔔'
    }
]

export default function AdminSettingsPage() {
    const { theme, toggleTheme } = useContext(ThemeContext)
    const [activeSection, setActiveSection] = useState('general')
    const [saved, setSaved] = useState(false)

    // AI settings state
    const [aiSettings, setAiSettings] = useState({
        model: 'gpt-4o',
        temperature: 0.7,
        maxTokens: 1500,
        requireScholarReview: true,
        autoFlagThreshold: 0.8,
        enableContentFilter: true
    })

    // Notification settings
    const [notifSettings, setNotifSettings] = useState({
        emailOnFlag: true,
        emailOnNewUser: false,
        emailDailyDigest: true,
        browserNotifications: true
    })

    // Security settings
    const [secSettings, setSecSettings] = useState({
        sessionTimeout: '60',
        twoFactor: false,
        ipWhitelist: ''
    })

    const handleSave = () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-1 tracking-tight">
                        System Settings
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        Configure platform behaviour, AI parameters, and security policies.
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold transition-all shadow-lg active:scale-95 flex items-center gap-2"
                >
                    {saved ? '✅ Saved!' : '💾 Save All'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Nav */}
                <div className="lg:col-span-1">
                    <nav className="space-y-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-2 shadow-sm">
                        {SECTIONS.map(s => (
                            <button
                                key={s.id}
                                onClick={() => setActiveSection(s.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeSection === s.id
                                        ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <span>{s.icon}</span>
                                {s.title}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Settings Panel */}
                <div className="lg:col-span-3 space-y-6">

                    {/* GENERAL */}
                    {activeSection === 'general' && (
                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                                <h2 className="font-bold text-slate-900 dark:text-white">General Settings</h2>
                                <p className="text-xs text-slate-500 mt-1">Platform-wide appearance and behaviour.</p>
                            </div>
                            <div className="p-8 space-y-8">
                                {/* Theme */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-bold text-slate-900 dark:text-white text-sm">Interface Theme</div>
                                        <div className="text-xs text-slate-500 mt-0.5">Switch between light and dark mode for the admin panel.</div>
                                    </div>
                                    <button
                                        onClick={toggleTheme}
                                        className={`relative w-14 h-8 rounded-full p-1 transition-all duration-300 ${theme === 'dark' ? 'bg-brand-500' : 'bg-slate-200'}`}
                                    >
                                        <div className={`w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform duration-300 flex items-center justify-center text-xs ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`}>
                                            {theme === 'dark' ? '🌙' : '☀️'}
                                        </div>
                                    </button>
                                </div>

                                <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                                    <div className="font-bold text-slate-900 dark:text-white text-sm mb-4">Platform Name</div>
                                    <input
                                        defaultValue="DeenFlow"
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white font-medium"
                                    />
                                </div>

                                <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                                    <div className="font-bold text-slate-900 dark:text-white text-sm mb-4">Support Email</div>
                                    <input
                                        defaultValue="admin@deenflow.com"
                                        type="email"
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white font-medium"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* AI CONFIGURATION */}
                    {activeSection === 'ai' && (
                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                                <h2 className="font-bold text-slate-900 dark:text-white">AI Configuration</h2>
                                <p className="text-xs text-slate-500 mt-1">Control how the AI guidance engine behaves.</p>
                            </div>
                            <div className="p-8 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">AI Model</label>
                                        <select
                                            value={aiSettings.model}
                                            onChange={e => setAiSettings({ ...aiSettings, model: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white font-medium"
                                        >
                                            <option value="gpt-4o">GPT-4o (Recommended)</option>
                                            <option value="gpt-4-turbo">GPT-4 Turbo</option>
                                            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Max Tokens</label>
                                        <input
                                            type="number"
                                            value={aiSettings.maxTokens}
                                            onChange={e => setAiSettings({ ...aiSettings, maxTokens: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                                        Temperature: {aiSettings.temperature}
                                    </label>
                                    <input
                                        type="range" min="0" max="1" step="0.1"
                                        value={aiSettings.temperature}
                                        onChange={e => setAiSettings({ ...aiSettings, temperature: parseFloat(e.target.value) })}
                                        className="w-full accent-brand-600"
                                    />
                                    <div className="flex justify-between text-xs text-slate-400">
                                        <span>Precise (0)</span>
                                        <span>Creative (1)</span>
                                    </div>
                                </div>

                                {[
                                    { key: 'requireScholarReview', label: 'Require Scholar Review for Sensitive Topics', desc: 'Flag responses about fiqh rulings for manual review.' },
                                    { key: 'enableContentFilter', label: 'Enable Content Filter', desc: 'Block inappropriate or off-topic questions automatically.' }
                                ].map(({ key, label, desc }) => (
                                    <div key={key} className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-6">
                                        <div>
                                            <div className="font-bold text-slate-900 dark:text-white text-sm">{label}</div>
                                            <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
                                        </div>
                                        <button
                                            onClick={() => setAiSettings({ ...aiSettings, [key]: !aiSettings[key] })}
                                            className={`relative w-14 h-8 rounded-full p-1 transition-all duration-300 ${aiSettings[key] ? 'bg-brand-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                                        >
                                            <div className={`w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${aiSettings[key] ? 'translate-x-6' : 'translate-x-0'}`} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SECURITY */}
                    {activeSection === 'security' && (
                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                                <h2 className="font-bold text-slate-900 dark:text-white">Security Settings</h2>
                                <p className="text-xs text-slate-500 mt-1">Manage session, 2FA, and access control.</p>
                            </div>
                            <div className="p-8 space-y-8">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Session Timeout (minutes)</label>
                                    <select
                                        value={secSettings.sessionTimeout}
                                        onChange={e => setSecSettings({ ...secSettings, sessionTimeout: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white font-medium"
                                    >
                                        <option value="30">30 minutes</option>
                                        <option value="60">60 minutes</option>
                                        <option value="120">2 hours</option>
                                        <option value="480">8 hours</option>
                                    </select>
                                </div>

                                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-6">
                                    <div>
                                        <div className="font-bold text-slate-900 dark:text-white text-sm">Two-Factor Authentication</div>
                                        <div className="text-xs text-slate-500 mt-0.5">Add an extra layer of security to your admin account.</div>
                                    </div>
                                    <button
                                        onClick={() => setSecSettings({ ...secSettings, twoFactor: !secSettings.twoFactor })}
                                        className={`relative w-14 h-8 rounded-full p-1 transition-all duration-300 ${secSettings.twoFactor ? 'bg-brand-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                                    >
                                        <div className={`w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${secSettings.twoFactor ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </button>
                                </div>

                                <div className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-1.5">
                                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">IP Whitelist (comma-separated)</label>
                                    <input
                                        value={secSettings.ipWhitelist}
                                        onChange={e => setSecSettings({ ...secSettings, ipWhitelist: e.target.value })}
                                        placeholder="e.g. 192.168.1.1, 10.0.0.0/24"
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white font-medium"
                                    />
                                    <p className="text-xs text-slate-400">Leave blank to allow all IPs.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* NOTIFICATIONS */}
                    {activeSection === 'notifications' && (
                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                                <h2 className="font-bold text-slate-900 dark:text-white">Notification Preferences</h2>
                                <p className="text-xs text-slate-500 mt-1">Choose when and how you receive alerts.</p>
                            </div>
                            <div className="p-8 space-y-6">
                                {[
                                    { key: 'emailOnFlag', label: 'Email on Flagged AI Response', desc: 'Get notified when an AI response is flagged for review.' },
                                    { key: 'emailOnNewUser', label: 'Email on New User Registration', desc: 'Receive an email whenever a new member joins.' },
                                    { key: 'emailDailyDigest', label: 'Daily Activity Digest', desc: 'A daily summary of platform activity sent to your inbox.' },
                                    { key: 'browserNotifications', label: 'Browser Push Notifications', desc: 'Real-time alerts in the browser while you are logged in.' }
                                ].map(({ key, label, desc }, i) => (
                                    <div key={key} className={`flex items-center justify-between ${i > 0 ? 'border-t border-slate-100 dark:border-slate-800 pt-6' : ''}`}>
                                        <div>
                                            <div className="font-bold text-slate-900 dark:text-white text-sm">{label}</div>
                                            <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
                                        </div>
                                        <button
                                            onClick={() => setNotifSettings({ ...notifSettings, [key]: !notifSettings[key] })}
                                            className={`relative w-14 h-8 rounded-full p-1 transition-all duration-300 flex-shrink-0 ml-6 ${notifSettings[key] ? 'bg-brand-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                                        >
                                            <div className={`w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${notifSettings[key] ? 'translate-x-6' : 'translate-x-0'}`} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
