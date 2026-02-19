import React, { useState, useEffect } from 'react'
import api from '../../api'

const ROLES = [
    { value: 'super_admin', label: 'Super Admin', color: 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300' },
    { value: 'content_admin', label: 'Content Admin', color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
    { value: 'fiqh_reviewer', label: 'Fiqh Reviewer', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
    { value: 'moderator', label: 'Moderator', color: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
    { value: 'member', label: 'Member', color: 'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
]

const MADHHABS = [
    { value: 'hanafi', label: 'Hanafi' },
    { value: 'shafii', label: "Shafi'i" },
    { value: 'maliki', label: 'Maliki' },
    { value: 'hanbali', label: 'Hanbali' },
]

export default function UsersListPage() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingUser, setEditingUser] = useState(null)
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        role: 'member',
        madhhab: 'hanafi',
        password: ''
    })
    const [actionLoading, setActionLoading] = useState(false)

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const res = await api.get('/auth/admin/users/')
            setUsers(res.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (user) => {
        if (user.role === 'super_admin' && users.filter(u => u.role === 'super_admin').length <= 1) {
            alert("Cannot delete the last Super Admin.")
            return
        }
        if (!window.confirm(`Permanently delete account for ${user.full_name || user.username}?`)) return
        try {
            await api.delete(`/auth/admin/users/${user.id}/`)
            setUsers(users.filter(u => u.id !== user.id))
        } catch (err) {
            alert(err.response?.data?.detail || "Failed to delete user")
        }
    }

    const openModal = (user = null) => {
        if (user) {
            setEditingUser(user)
            setFormData({
                full_name: user.full_name || '',
                email: user.email,
                role: user.role,
                madhhab: user.madhhab || 'hanafi',
                password: ''
            })
        } else {
            setEditingUser(null)
            setFormData({
                full_name: '',
                email: '',
                role: 'member',
                madhhab: 'hanafi',
                password: ''
            })
        }
        setIsModalOpen(true)
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setActionLoading(true)
        try {
            if (editingUser) {
                const res = await api.patch(`/auth/admin/users/${editingUser.id}/`, formData)
                setUsers(users.map(u => u.id === editingUser.id ? res.data : u))
            } else {
                const res = await api.post('/auth/admin/users/', formData)
                setUsers([res.data, ...users])
            }
            setIsModalOpen(false)
        } catch (err) {
            alert(JSON.stringify(err.response?.data) || "Failed to save user")
        } finally {
            setActionLoading(false)
        }
    }

    const filteredUsers = users.filter(u => {
        const matchesSearch = (u.full_name || u.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
        if (!matchesSearch) return false

        if (filter === 'admin') return u.is_admin
        if (filter === 'member') return !u.is_admin
        return true
    })

    const getRoleBadge = (roleValue) => {
        const role = ROLES.find(r => r.value === roleValue) || ROLES[4]
        return (
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border border-current opacity-80 uppercase tracking-wider ${role.color}`}>
                {role.label}
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                        User Base
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">
                        Efficiently manage community members, scholars, and moderators.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:ring-2 focus:ring-brand-500 outline-none w-72 transition-all"
                        />
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                    </div>

                    <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === 'all' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                            All ({users.length})
                        </button>
                        <button onClick={() => setFilter('admin')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === 'admin' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                            Staff ({users.filter(u => u.is_admin).length})
                        </button>
                    </div>

                    <button
                        onClick={() => openModal()}
                        className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-sm shadow-xl shadow-brand-600/20 active:scale-95 transition-all flex items-center gap-2"
                    >
                        <span>+</span> Create User
                    </button>
                </div>
            </div>

            {/* User List Table */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Profile</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Role & School</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Access</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-8 py-6" colSpan="4"><div className="h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl w-full"></div></td>
                                    </tr>
                                ))
                            ) : filteredUsers.length > 0 ? (
                                filteredUsers.map((u) => (
                                    <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all duration-300 group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm transition-transform group-hover:scale-105 duration-300 ${u.is_admin ? 'bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                                                    {(u.full_name || u.username).charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors capitalize">
                                                        {u.full_name || u.username}
                                                    </div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium opacity-80">
                                                        {u.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-1.5">
                                                {getRoleBadge(u.role)}
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                                                    School: <span className="text-slate-600 dark:text-slate-400">{MADHHABS.find(m => m.value === u.madhhab)?.label || 'Hanafi'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${u.is_active !== false ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                                                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tighter">
                                                    {u.is_active !== false ? 'Active' : 'Suspended'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                <button onClick={() => openModal(u)} className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-xl transition-all" title="Edit">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                </button>
                                                <button onClick={() => handleDelete(u)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all" title="Delete">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-8 py-32 text-center">
                                        <div className="text-6xl mb-6 grayscale opacity-20">👥</div>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No matches found</h3>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal - CRU Operations */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white dark:bg-slate-900 w-full max-w-xl rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-slate-800 p-8 animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white">
                                {editingUser ? 'Update Profile' : 'New Community Member'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">✕</button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                                    <input type="text" required value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 outline-none text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 transition-all placeholder:text-slate-400" placeholder="e.g. Ahmad Abdullah" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                                    <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 outline-none text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 transition-all placeholder:text-slate-400" placeholder="email@example.com" />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">System Role</label>
                                    <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 outline-none text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 transition-all">
                                        {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Madhhab</label>
                                    <select value={formData.madhhab} onChange={(e) => setFormData({ ...formData, madhhab: e.target.value })} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 outline-none text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 transition-all">
                                        {MADHHABS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                                    </select>
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                                        {editingUser ? 'Reset Password (Leave blank to keep current)' : 'Account Password'}
                                    </label>
                                    <input type="password" required={!editingUser} minLength={8} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 outline-none text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 transition-all placeholder:text-slate-400" placeholder="••••••••" />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 px-6 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">Cancel</button>
                                <button type="submit" disabled={actionLoading} className="flex-[2] py-4 px-6 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-xl shadow-brand-600/30 disabled:opacity-50 transition-all active:scale-95">
                                    {actionLoading ? 'Processing...' : (editingUser ? 'Update Account' : 'Create & Send Invite')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
