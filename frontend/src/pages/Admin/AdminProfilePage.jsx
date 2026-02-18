import React, { useContext, useState, useEffect } from 'react'
import AuthContext from '../../contexts/AuthContext'
import { ThemeContext } from '../../contexts/ThemeContext'
import api from '../../api'

export default function AdminProfilePage() {
    const { user, updateProfile } = useContext(AuthContext)
    const { theme, toggleTheme } = useContext(ThemeContext)
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(false)
    const [formData, setFormData] = useState({ full_name: '', email: '' })
    const [passwordData, setPasswordData] = useState({ current: '', newPass: '', confirm: '' })
    const [pwError, setPwError] = useState('')
    const [pwSuccess, setPwSuccess] = useState(false)

    useEffect(() => {
        if (user) {
            setFormData({ full_name: user.full_name || '', email: user.email || '' })
        }
    }, [user])

    const handleSave = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await updateProfile(formData)
            setIsEditing(false)
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handlePasswordChange = async (e) => {
        e.preventDefault()
        setPwError('')
        if (passwordData.newPass !== passwordData.confirm) {
            setPwError('New passwords do not match.')
            return
        }
        if (passwordData.newPass.length < 8) {
            setPwError('Password must be at least 8 characters.')
            return
        }
        try {
            await api.post('/auth/change-password/', {
                current_password: passwordData.current,
                new_password: passwordData.newPass
            })
            setPwSuccess(true)
            setPasswordData({ current: '', newPass: '', confirm: '' })
            setTimeout(() => setPwSuccess(false), 3000)
        } catch (err) {
            setPwError(err.response?.data?.detail || 'Failed to change password.')
        }
    }

    const initials = user?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        || user?.username?.charAt(0).toUpperCase()
        || 'A'

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-1 tracking-tight">
                    My Profile
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                    Manage your administrator account details.
                </p>
            </div>

            {saved && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-2xl text-sm font-medium flex items-center gap-2">
                    ✅ Profile updated successfully.
                </div>
            )}

            {/* Profile Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-brand-50/50 to-transparent dark:from-brand-900/10">
                    <div className="flex items-center gap-6">
                        {/* Avatar */}
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-brand-500/30 flex-shrink-0">
                            {initials}
                        </div>
                        <div className="flex-1">
                            <div className="text-xl font-bold text-slate-900 dark:text-white">
                                {user?.full_name || user?.username}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{user?.email}</div>
                            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 rounded-full text-xs font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                                Super Administrator
                            </div>
                        </div>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
                        >
                            {isEditing ? 'Cancel' : '✏️ Edit'}
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSave} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Full Name</label>
                            <input
                                value={formData.full_name}
                                onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                disabled={!isEditing}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white font-medium disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Email Address</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                disabled={!isEditing}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white font-medium disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Username</label>
                            <input
                                value={user?.username || ''}
                                disabled
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-xl text-slate-500 dark:text-slate-400 font-medium opacity-60 cursor-not-allowed"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Role</label>
                            <input
                                value="Super Administrator"
                                disabled
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-xl text-slate-500 dark:text-slate-400 font-medium opacity-60 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    {isEditing && (
                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-brand-600/20 active:scale-95 disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </form>
            </div>

            {/* Change Password */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="font-bold text-slate-900 dark:text-white">Change Password</h2>
                    <p className="text-xs text-slate-500 mt-1">Use a strong password of at least 8 characters.</p>
                </div>
                <form onSubmit={handlePasswordChange} className="p-8 space-y-5">
                    {pwError && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium">
                            {pwError}
                        </div>
                    )}
                    {pwSuccess && (
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-xl text-sm font-medium">
                            ✅ Password changed successfully.
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {[
                            { label: 'Current Password', key: 'current' },
                            { label: 'New Password', key: 'newPass' },
                            { label: 'Confirm New Password', key: 'confirm' }
                        ].map(({ label, key }) => (
                            <div key={key} className="space-y-1.5">
                                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">{label}</label>
                                <input
                                    type="password"
                                    value={passwordData[key]}
                                    onChange={e => setPasswordData({ ...passwordData, [key]: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white font-medium transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        ))}
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-3 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white rounded-xl font-bold transition-all active:scale-95 shadow-sm"
                    >
                        Update Password
                    </button>
                </form>
            </div>

            {/* Appearance */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-bold text-slate-900 dark:text-white">Interface Theme</h2>
                        <p className="text-xs text-slate-500 mt-1">Switch between light and dark mode.</p>
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
            </div>
        </div>
    )
}
