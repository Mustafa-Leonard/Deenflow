import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../../api'

const specializations = [
    'Fiqh (Islamic Jurisprudence)',
    'Aqeedah (Theology)',
    'Tafsir (Quran Exegesis)',
    'Hadith Sciences',
    'Usul al-Fiqh (Principles of Jurisprudence)',
    'Seerah (Prophetic Biography)',
    'Arabic Language',
    'Islamic Finance',
    'Family Law (Ahwal Shakhsiyyah)',
    'Comparative Fiqh',
]

const madhabs = ['Hanafi', 'Maliki', 'Shafi\'i', 'Hanbali', 'Not Specified']

const mockScholars = [
    { id: 1, name: 'Sheikh Ahmad Al-Farisi', email: 'ahmad@deenflow.com', specializations: ['Fiqh (Islamic Jurisprudence)', 'Islamic Finance'], madhab: 'Hanafi', status: 'active', reviewsCompleted: 142, reviewsPending: 5, joinedAt: '2024-08-15', lastActive: '2026-02-18', rating: 4.9 },
    { id: 2, name: 'Dr. Fatima Zahra', email: 'fatima@deenflow.com', specializations: ['Hadith Sciences', 'Tafsir (Quran Exegesis)'], madhab: 'Maliki', status: 'active', reviewsCompleted: 98, reviewsPending: 3, joinedAt: '2024-09-20', lastActive: '2026-02-19', rating: 4.8 },
    { id: 3, name: 'Ustadh Ibrahim Yusuf', email: 'ibrahim@deenflow.com', specializations: ['Aqeedah (Theology)', 'Seerah (Prophetic Biography)'], madhab: 'Shafi\'i', status: 'active', reviewsCompleted: 76, reviewsPending: 8, joinedAt: '2024-11-05', lastActive: '2026-02-17', rating: 4.7 },
    { id: 4, name: 'Mufti Khalid Rahman', email: 'khalid@deenflow.com', specializations: ['Fiqh (Islamic Jurisprudence)', 'Family Law (Ahwal Shakhsiyyah)'], madhab: 'Hanafi', status: 'inactive', reviewsCompleted: 210, reviewsPending: 0, joinedAt: '2024-06-10', lastActive: '2026-01-15', rating: 5.0 },
]

export default function ScholarsManagementPage() {
    const [scholars, setScholars] = useState(mockScholars)
    const [showAddModal, setShowAddModal] = useState(false)
    const [showAssignModal, setShowAssignModal] = useState(false)
    const [selectedScholar, setSelectedScholar] = useState(null)
    const [search, setSearch] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [sortBy, setSortBy] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams()

    const [newScholar, setNewScholar] = useState({
        name: '', email: '', specializations: [], madhab: 'Not Specified', bio: ''
    })

    useEffect(() => {
        api.get('/auth/admin/scholars/')
            .then(res => { if (res.data?.length) setScholars(res.data) })
            .catch(() => { })
    }, [])

    // respond to `?tab=` query param
    useEffect(() => {
        const tab = searchParams.get('tab') || 'total'
        if (tab === 'active') {
            setFilterStatus('active')
            setSortBy(null)
        } else if (tab === 'pending_reviews') {
            setFilterStatus('all')
            setSortBy('pending')
        } else if (tab === 'total_reviews') {
            setFilterStatus('all')
            setSortBy('reviews')
        } else {
            setFilterStatus('all')
            setSortBy(null)
        }
    }, [searchParams])

    let filteredScholars = scholars.filter(s => {
        const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.email.toLowerCase().includes(search.toLowerCase())
        const matchStatus = filterStatus === 'all' || s.status === filterStatus
        return matchSearch && matchStatus
    })

    if (sortBy === 'pending') {
        filteredScholars = filteredScholars.filter(s => s.reviewsPending > 0)
    }

    if (sortBy === 'reviews') {
        filteredScholars = filteredScholars.slice().sort((a, b) => b.reviewsCompleted - a.reviewsCompleted)
    }

    const handleAddScholar = () => {
        const scholar = {
            id: Math.max(...scholars.map(s => s.id)) + 1,
            ...newScholar,
            status: 'active',
            reviewsCompleted: 0,
            reviewsPending: 0,
            joinedAt: new Date().toISOString().split('T')[0],
            lastActive: new Date().toISOString().split('T')[0],
            rating: 0,
        }
        api.post('/auth/admin/scholars/', newScholar).catch(() => { })
        setScholars(prev => [...prev, scholar])
        setShowAddModal(false)
        setNewScholar({ name: '', email: '', specializations: [], madhab: 'Not Specified', bio: '' })
    }

    const toggleSpecialization = (spec) => {
        setNewScholar(prev => ({
            ...prev,
            specializations: prev.specializations.includes(spec)
                ? prev.specializations.filter(s => s !== spec)
                : [...prev.specializations, spec]
        }))
    }

    const toggleScholarStatus = (id) => {
        setScholars(prev => prev.map(s =>
            s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s
        ))
    }

    const statusColors = {
        active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        inactive: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-lg shadow-lg">👳</span>
                        Scholars & Reviewers
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Manage qualified Islamic scholars who review and validate AI-generated content
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white text-sm font-semibold shadow-lg hover:shadow-brand-500/40 hover:translate-y-[-1px] transition-all duration-300"
                >
                    + Add Scholar
                </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { key: 'total', label: 'Total Scholars', value: scholars.length, icon: '👳', color: 'from-amber-500 to-orange-600' },
                    { key: 'active', label: 'Active Now', value: scholars.filter(s => s.status === 'active').length, icon: '🟢', color: 'from-green-500 to-emerald-600' },
                    { key: 'total_reviews', label: 'Total Reviews', value: scholars.reduce((acc, s) => acc + s.reviewsCompleted, 0), icon: '✅', color: 'from-blue-500 to-indigo-600' },
                    { key: 'pending_reviews', label: 'Pending Reviews', value: scholars.reduce((acc, s) => acc + s.reviewsPending, 0), icon: '⏳', color: 'from-purple-500 to-violet-600' },
                ].map(stat => (
                    <div key={stat.key}
                        onClick={() => setSearchParams({ tab: stat.key })}
                        role="button"
                        tabIndex={0}
                        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm cursor-pointer hover:shadow-lg transition-all"
                        onKeyDown={(e) => { if (e.key === 'Enter') setSearchParams({ tab: stat.key }) }}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
                            </div>
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-xl shadow-lg`}>
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search scholars by name or email..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                    />
                </div>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            {/* Scholars Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                            <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Scholar</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Specializations</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Madhab</th>
                            <th className="text-center px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Reviews</th>
                            <th className="text-center px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Rating</th>
                            <th className="text-center px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                            <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredScholars.map(scholar => (
                            <tr key={scholar.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                            {scholar.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-slate-900 dark:text-white">{scholar.name}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400">{scholar.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1.5">
                                        {scholar.specializations.map(spec => (
                                            <span key={spec} className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-medium">
                                                {spec.split(' (')[0]}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{scholar.madhab}</td>
                                <td className="px-6 py-4 text-center">
                                    <div className="text-sm font-semibold text-slate-900 dark:text-white">{scholar.reviewsCompleted}</div>
                                    {scholar.reviewsPending > 0 && (
                                        <div className="text-xs text-amber-600 dark:text-amber-400">{scholar.reviewsPending} pending</div>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                        <span className="text-amber-500">★</span>
                                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{scholar.rating > 0 ? scholar.rating.toFixed(1) : '—'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[scholar.status]}`}>
                                        {scholar.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => { setSelectedScholar(scholar); setShowAssignModal(true) }}
                                            className="px-3 py-1.5 rounded-lg bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 text-xs font-medium hover:bg-brand-100 dark:hover:bg-brand-900/30 transition-colors"
                                        >
                                            Assign Task
                                        </button>
                                        <button
                                            onClick={() => toggleScholarStatus(scholar.id)}
                                            className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            {scholar.status === 'active' ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredScholars.length === 0 && (
                    <div className="p-12 text-center">
                        <div className="text-4xl mb-3">👳</div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">No scholars found matching your criteria</p>
                    </div>
                )}
            </div>

            {/* Add Scholar Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[200]" onClick={() => setShowAddModal(false)}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add New Scholar</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                Register a new qualified Islamic scholar for content review
                            </p>
                        </div>
                        <div className="p-6 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                                    <input
                                        type="text"
                                        value={newScholar.name}
                                        onChange={(e) => setNewScholar(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                                        placeholder="e.g. Sheikh Ahmad Al-Farisi"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
                                    <input
                                        type="email"
                                        value={newScholar.email}
                                        onChange={(e) => setNewScholar(prev => ({ ...prev, email: e.target.value }))}
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                                        placeholder="scholar@email.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Madhab (School of Thought)</label>
                                <select
                                    value={newScholar.madhab}
                                    onChange={(e) => setNewScholar(prev => ({ ...prev, madhab: e.target.value }))}
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                                >
                                    {madhabs.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Specializations</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {specializations.map(spec => (
                                        <label
                                            key={spec}
                                            className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all text-sm ${newScholar.specializations.includes(spec)
                                                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400'
                                                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={newScholar.specializations.includes(spec)}
                                                onChange={() => toggleSpecialization(spec)}
                                                className="rounded text-brand-600 focus:ring-brand-500"
                                            />
                                            {spec}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Bio / Qualifications</label>
                                <textarea
                                    value={newScholar.bio}
                                    onChange={(e) => setNewScholar(prev => ({ ...prev, bio: e.target.value }))}
                                    rows={3}
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white resize-y focus:ring-2 focus:ring-brand-500"
                                    placeholder="Brief biography and academic qualifications..."
                                />
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                            <button onClick={() => setShowAddModal(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                Cancel
                            </button>
                            <button
                                onClick={handleAddScholar}
                                disabled={!newScholar.name || !newScholar.email}
                                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white text-sm font-semibold shadow-lg hover:shadow-brand-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Add Scholar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Assign Task Modal */}
            {showAssignModal && selectedScholar && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[200]" onClick={() => setShowAssignModal(false)}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-800" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Assign Review Task</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                Assign a content review task to <strong>{selectedScholar.name}</strong>
                            </p>
                        </div>
                        <AssignTaskForm
                            scholar={selectedScholar}
                            onClose={() => setShowAssignModal(false)}
                            onAssigned={(payload) => {
                                // optimistic update: increment pending reviews for the scholar
                                setScholars(prev => prev.map(s => s.id === selectedScholar.id ? { ...s, reviewsPending: (s.reviewsPending || 0) + 1 } : s))
                                setShowAssignModal(false)
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}


function AssignTaskForm({ scholar, onClose, onAssigned }) {
    const [taskType, setTaskType] = useState('AI Answer Review')
    const [priority, setPriority] = useState('Normal')
    const [note, setNote] = useState('')
    const [loading, setLoading] = useState(false)

    const handleAssign = async () => {
        setLoading(true)
            try {
            await api.post(`/auth/admin/scholars/${scholar.id}/assign-task/`, {
                task_type: taskType,
                priority: priority,
                note: note,
            })
            onAssigned && onAssigned({ scholar: scholar.id, task_type: taskType, priority, notes: note })
        } catch (e) {
            // show server error if available
            const msg = e?.response?.data || e?.message || 'Failed to assign task.'
            try { alert(typeof msg === 'string' ? msg : JSON.stringify(msg)) } catch { alert('Failed to assign task.') }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <div className="p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Task Type</label>
                    <select value={taskType} onChange={(e) => setTaskType(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white">
                        <option>AI Answer Review</option>
                        <option>Fiqh Ruling Verification</option>
                        <option>Content Article Review</option>
                        <option>Flagged Response Resolution</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Priority</label>
                    <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white">
                        <option>Normal</option>
                        <option>High</option>
                        <option>Urgent</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Note</label>
                    <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white resize-y focus:ring-2 focus:ring-brand-500" placeholder="Additional context for the scholar..." />
                </div>
            </div>
            <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Cancel</button>
                <button disabled={loading} onClick={handleAssign} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white text-sm font-semibold shadow-lg hover:shadow-brand-500/40 transition-all">{loading ? 'Assigning...' : 'Assign Task'}</button>
            </div>
        </div>
    )
}
