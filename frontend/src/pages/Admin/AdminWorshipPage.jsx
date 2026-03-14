import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api'

const SECTIONS = [
    { id: 'dhikr', label: 'Dhikr Items', icon: '📿', endpoint: '/worship/dhikr/', color: 'from-emerald-500 to-teal-600' },
    { id: 'duas', label: 'Dua Library', icon: '🙌', endpoint: '/worship/duas/', color: 'from-blue-500 to-cyan-600' },
    { id: 'asmaul-husna', label: 'Names of Allah', icon: '✨', endpoint: '/worship/asmaul-husna/', color: 'from-amber-500 to-yellow-600' },
    { id: 'categories', label: 'Worship Categories', icon: '📁', endpoint: '/worship/categories/', color: 'from-purple-500 to-violet-600' },
]

export default function AdminWorshipPage() {
    const navigate = useNavigate()
    const [activeSection, setActiveSection] = useState(SECTIONS[0])
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({})
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)
    const [categories, setCategories] = useState([])

    useEffect(() => {
        fetchItems()
        api.get('/worship/categories/').then(r => setCategories(r.data)).catch(() => { })
    }, [activeSection])

    const fetchItems = async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await api.get(activeSection.endpoint)
            const data = Array.isArray(res.data) ? res.data : (res.data.results || [])
            setItems(data)
        } catch (e) {
            setError('Failed to load data.')
        } finally {
            setLoading(false)
        }
    }

    const getItemLabel = (item) => {
        return item.transliteration || item.title || item.name || item.translation?.slice(0, 60) || String(item.id)
    }

    const filtered = items.filter(item =>
        Object.values(item).some(v => typeof v === 'string' && v.toLowerCase().includes(search.toLowerCase()))
    )

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            // Map category to category_id if needed
            const payload = { ...form }
            if (payload.category && !payload.category_id) {
                payload.category_id = payload.category
            }

            if (form.id) {
                await api.put(`${activeSection.endpoint}${form.id}/`, payload)
            } else {
                await api.post(activeSection.endpoint, payload)
            }
            setShowForm(false)
            setForm({})
            fetchItems()
        } catch (e) {
            alert('Save failed: ' + (e.response?.data ? JSON.stringify(e.response.data) : e.message))
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this item?')) return
        try {
            await api.delete(`${activeSection.endpoint}${id}/`)
            fetchItems()
        } catch { alert('Delete failed') }
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white text-xl shadow-lg">🕌</span>
                        Worship Content Management
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage dhikr, duas, Names of Allah, and worship categories</p>
                </div>
                <button
                    onClick={() => { setShowForm(true); setForm({}) }}
                    className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-brand-600/30 flex items-center gap-2 active:scale-95 text-sm"
                >
                    <span className="text-lg">+</span> Add New
                </button>
            </div>

            {/* Section Tabs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {SECTIONS.map(section => (
                    <button
                        key={section.id}
                        onClick={() => { setActiveSection(section); setSearch('') }}
                        className={`p-4 rounded-2xl border text-left transition-all ${activeSection.id === section.id
                            ? `bg-gradient-to-br ${section.color} text-white border-transparent shadow-lg`
                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-brand-300 hover:shadow-md'
                            }`}
                    >
                        <div className="text-2xl mb-2">{section.icon}</div>
                        <div className="font-bold text-sm">{section.label}</div>
                    </button>
                ))}
            </div>

            {/* Search + Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
                    <div className="relative flex-1">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder={`Search ${activeSection.label}...`}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                        />
                    </div>
                    <span className="text-sm text-slate-400">{filtered.length} items</span>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-16 text-center">
                            <div className="w-8 h-8 border-4 border-slate-200 dark:border-slate-700 border-t-brand-600 rounded-full animate-spin mx-auto mb-3"></div>
                            <p className="text-slate-400 text-sm">Loading {activeSection.label}...</p>
                        </div>
                    ) : error ? (
                        <div className="p-12 text-center text-red-500">{error}</div>
                    ) : filtered.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="text-4xl mb-3 opacity-40">{activeSection.icon}</div>
                            <p className="text-slate-400 text-sm">No {activeSection.label} found</p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Name / Label</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Arabic</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {filtered.map(item => (
                                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="font-semibold text-slate-900 dark:text-white text-sm">{getItemLabel(item)}</div>
                                                {item.is_quranic && (
                                                    <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded-full uppercase tracking-tighter">Quranic</span>
                                                )}
                                            </div>
                                            {(item.translation || item.meaning) && (
                                                <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">{item.translation || item.meaning}</div>
                                            )}
                                            {item.category && (
                                                <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded w-fit">{item.category}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-arabic text-slate-700 dark:text-slate-300 text-base" dir="rtl">
                                                {item.arabic_text || item.name_arabic || '-'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => {
                                                        // Ensure category_id is set for the form
                                                        const editForm = { ...item };
                                                        if (!editForm.category_id && item.category) {
                                                            // Find category ID by name if needed, but backend should provide it
                                                        }
                                                        setForm(editForm);
                                                        setShowForm(true);
                                                    }}
                                                    className="px-3 py-1.5 text-xs font-medium bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-lg hover:bg-brand-100 transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="px-3 py-1.5 text-xs font-medium bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[200] p-4" onClick={() => setShowForm(false)}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-800" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                {form.id ? 'Edit' : 'Add'} {activeSection.label.slice(0, -1)}
                            </h2>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            {/* Dynamic fields based on section */}
                            {activeSection.id === 'dhikr' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                                        <select value={form.category_id || form.category || ''} onChange={e => setForm({ ...form, category_id: e.target.value })} required className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20">
                                            <option value="">Select category</option>
                                            {categories.filter(c => c.type === 'dhikr').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Arabic Text</label>
                                        <textarea value={form.arabic_text || ''} onChange={e => setForm({ ...form, arabic_text: e.target.value })} required rows={3} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 resize-y" dir="rtl" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Transliteration</label>
                                        <input value={form.transliteration || ''} onChange={e => setForm({ ...form, transliteration: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Translation</label>
                                        <textarea value={form.translation || ''} onChange={e => setForm({ ...form, translation: e.target.value })} rows={2} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 resize-y" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Default Repeat Count</label>
                                        <input type="number" min="1" value={form.repeat_default || 1} onChange={e => setForm({ ...form, repeat_default: parseInt(e.target.value) })} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20" />
                                    </div>
                                </>
                            )}
                            {activeSection.id === 'duas' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                                        <input value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} required className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                                        <select value={form.category_id || form.category || ''} onChange={e => setForm({ ...form, category_id: e.target.value })} required className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20">
                                            <option value="">Select category</option>
                                            {categories.filter(c => c.type === 'dua').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Arabic Text</label>
                                        <textarea value={form.arabic_text || ''} onChange={e => setForm({ ...form, arabic_text: e.target.value })} rows={3} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 resize-y" dir="rtl" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Translation</label>
                                        <textarea value={form.translation || ''} onChange={e => setForm({ ...form, translation: e.target.value })} rows={2} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 resize-y" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Reference</label>
                                        <input value={form.reference || ''} onChange={e => setForm({ ...form, reference: e.target.value })} placeholder="Hadith or source reference" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20" />
                                    </div>
                                </>
                            )}
                            {activeSection.id === 'asmaul-husna' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Arabic Name</label>
                                        <input value={form.name_arabic || ''} onChange={e => setForm({ ...form, name_arabic: e.target.value })} required dir="rtl" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Transliteration</label>
                                        <input value={form.transliteration || ''} onChange={e => setForm({ ...form, transliteration: e.target.value })} required className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Meaning</label>
                                        <input value={form.meaning || ''} onChange={e => setForm({ ...form, meaning: e.target.value })} required className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Explanation</label>
                                        <textarea value={form.explanation || ''} onChange={e => setForm({ ...form, explanation: e.target.value })} rows={3} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 resize-y" />
                                    </div>
                                </>
                            )}
                            {activeSection.id === 'categories' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category Name</label>
                                        <input value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} required className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
                                        <select value={form.type || ''} onChange={e => setForm({ ...form, type: e.target.value })} required className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20">
                                            <option value="">Select type</option>
                                            <option value="dhikr">Dhikr</option>
                                            <option value="dua">Dua</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                                        <textarea value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 resize-y" />
                                    </div>
                                </>
                            )}

                            <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-medium text-sm transition-all disabled:opacity-50 active:scale-95">
                                    {saving ? 'Saving...' : form.id ? 'Save Changes' : 'Add Item'}
                                </button>
                                <button type="button" onClick={() => { setShowForm(false); setForm({}) }} className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-medium text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
