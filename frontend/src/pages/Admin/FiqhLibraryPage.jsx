import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../api'

export default function FiqhLibraryPage() {
    const navigate = useNavigate()
    const [rulings, setRulings] = useState([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({ topic: '', status: '', search: '' })

    useEffect(() => {
        fetchRulings()
    }, [filters])

    const fetchRulings = async () => {
        setLoading(true)
        try {
            const response = await api.get('/fiqh/rulings/', { params: filters })
            setRulings(response.data)
        } catch (error) {
            console.error('Failed to fetch rulings:', error)
        } finally {
            setLoading(false)
        }
    }

    const deleteRuling = async (id) => {
        if (!window.confirm('Are you sure you want to delete this ruling?')) return
        try {
            await api.delete(`/fiqh/rulings/${id}/`)
            fetchRulings()
        } catch (err) {
            alert('Failed to delete')
        }
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                        Fiqh Library / Rulings
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        Manage your curated base of verified Islamic rulings
                    </p>
                </div>
                <Link
                    to="/admin/fiqh/new"
                    className="flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-2xl font-bold shadow-lg shadow-brand-600/20 hover:bg-brand-700 transition-all active:scale-95 text-sm"
                >
                    <span>+ New Ruling</span>
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="text"
                        placeholder="Search by title, tags, text..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                    />
                    <select
                        value={filters.topic}
                        onChange={(e) => setFilters({ ...filters, topic: e.target.value })}
                        className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
                    >
                        <option value="">All Topics</option>
                        <option value="finance">Finance / Riba</option>
                        <option value="family">Family / Marriage</option>
                        <option value="inheritance">Inheritance</option>
                        <option value="prayer">Prayer (Salah)</option>
                    </select>
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
                    >
                        <option value="">All Statuses</option>
                        <option value="verified">Verified</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>
            </div>

            {/* Table / Cards List */}
            <div className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl">
                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Ruling</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Topic</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Scholar</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {loading ? (
                                <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-400">Loading library...</td></tr>
                            ) : rulings.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-400">No rulings found.</td></tr>
                            ) : (
                                rulings.map(r => (
                                    <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors group">
                                        <td className="px-6 py-4 min-w-[300px]">
                                            <div className="font-bold text-slate-900 dark:text-white mb-1">{r.title}</div>
                                            <div className="text-xs text-slate-500 line-clamp-1">{r.scholar_reference}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-3 py-1 bg-brand-50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-400 text-xs font-bold rounded-lg border border-brand-100 dark:border-brand-900/30">
                                                {r.topic}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400 italic">
                                            {r.scholar}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${r.verification_status === 'verified' ? 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400' :
                                                r.verification_status === 'draft' ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400' :
                                                    'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                                }`}>
                                                {r.verification_status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-3 whitespace-nowrap">
                                            <button onClick={() => navigate(`/admin/fiqh/edit/${r.id}`)} className="text-brand-600 hover:text-brand-700 font-bold text-xs uppercase">Edit</button>
                                            <button onClick={() => deleteRuling(r.id)} className="text-red-500 hover:text-red-600 font-bold text-xs uppercase">Delete</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
                    {loading ? (
                        <div className="p-12 text-center text-slate-400">Loading library...</div>
                    ) : rulings.length === 0 ? (
                        <div className="p-12 text-center text-slate-400">No rulings found.</div>
                    ) : (
                        rulings.map(r => (
                            <div key={r.id} className="p-6 space-y-4">
                                <div>
                                    <div className="font-bold text-slate-900 dark:text-white mb-1">{r.title}</div>
                                    <div className="text-xs text-slate-500 line-clamp-2">{r.scholar_reference}</div>
                                </div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="px-2 py-0.5 bg-brand-50 dark:bg-brand-900/20 text-brand-600 text-[10px] font-bold rounded uppercase">
                                        {r.topic}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${r.verification_status === 'verified' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                                        {r.verification_status}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between pt-2">
                                    <div className="text-[10px] text-slate-400 italic">By {r.scholar}</div>
                                    <div className="flex gap-4">
                                        <button onClick={() => navigate(`/admin/fiqh/edit/${r.id}`)} className="text-brand-600 font-bold text-[10px] uppercase">Edit</button>
                                        <button onClick={() => deleteRuling(r.id)} className="text-red-500 font-bold text-[10px] uppercase">Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
