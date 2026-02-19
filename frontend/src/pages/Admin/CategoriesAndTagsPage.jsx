import React, { useState, useEffect } from 'react'
import api from '../../api'

const mockCategories = [
    {
        id: 1, name: 'Fiqh (Jurisprudence)', slug: 'fiqh', description: 'Islamic legal rulings and jurisprudence', contentCount: 234, children: [
            { id: 11, name: 'Salah (Prayer)', slug: 'salah', contentCount: 82 },
            { id: 12, name: 'Zakah', slug: 'zakah', contentCount: 45 },
            { id: 13, name: 'Sawm (Fasting)', slug: 'sawm', contentCount: 38 },
            { id: 14, name: 'Hajj', slug: 'hajj', contentCount: 29 },
            { id: 15, name: 'Mu\'amalat (Transactions)', slug: 'muamalat', contentCount: 40 },
        ]
    },
    {
        id: 2, name: 'Aqeedah (Theology)', slug: 'aqeedah', description: 'Islamic creed and theological matters', contentCount: 156, children: [
            { id: 21, name: 'Tawheed', slug: 'tawheed', contentCount: 67 },
            { id: 22, name: 'Qadr (Divine Decree)', slug: 'qadr', contentCount: 34 },
            { id: 23, name: 'Prophets & Messengers', slug: 'prophets', contentCount: 55 },
        ]
    },
    {
        id: 3, name: 'Tafsir (Exegesis)', slug: 'tafsir', description: 'Quran interpretation and commentary', contentCount: 189, children: [
            { id: 31, name: 'Thematic Tafsir', slug: 'thematic-tafsir', contentCount: 89 },
            { id: 32, name: 'Verse-by-Verse', slug: 'verse-by-verse', contentCount: 100 },
        ]
    },
    {
        id: 4, name: 'Hadith', slug: 'hadith', description: 'Prophetic narrations and their sciences', contentCount: 312, children: [
            { id: 41, name: 'Hadith Science (Mustalah)', slug: 'mustalah', contentCount: 78 },
            { id: 42, name: 'Hadith Collections', slug: 'collections', contentCount: 234 },
        ]
    },
    { id: 5, name: 'Seerah', slug: 'seerah', description: 'Biography of Prophet Muhammad ﷺ', contentCount: 98, children: [] },
    {
        id: 6, name: 'Akhlaq (Ethics)', slug: 'akhlaq', description: 'Islamic morals and character', contentCount: 145, children: [
            { id: 61, name: 'Personal Ethics', slug: 'personal-ethics', contentCount: 87 },
            { id: 62, name: 'Social Ethics', slug: 'social-ethics', contentCount: 58 },
        ]
    },
    { id: 7, name: 'Islamic Finance', slug: 'islamic-finance', description: 'Halal financial practices and rulings', contentCount: 76, children: [] },
]

const mockTags = [
    { id: 1, name: 'Ramadan', color: '#10B981', usageCount: 156 },
    { id: 2, name: 'Halal-Haram', color: '#F59E0B', usageCount: 234 },
    { id: 3, name: 'Marriage', color: '#EC4899', usageCount: 98 },
    { id: 4, name: 'Dua (Supplication)', color: '#8B5CF6', usageCount: 187 },
    { id: 5, name: 'Zakat', color: '#06B6D4', usageCount: 67 },
    { id: 6, name: 'Salah', color: '#3B82F6', usageCount: 203 },
    { id: 7, name: 'Quran', color: '#14B8A6', usageCount: 312 },
    { id: 8, name: 'Hadith', color: '#F97316', usageCount: 245 },
    { id: 9, name: 'Fasting', color: '#6366F1', usageCount: 89 },
    { id: 10, name: 'Jihad', color: '#EF4444', usageCount: 34 },
    { id: 11, name: 'Tawheed', color: '#84CC16', usageCount: 78 },
    { id: 12, name: 'Death & Afterlife', color: '#64748B', usageCount: 56 },
    { id: 13, name: 'Family', color: '#EC4899', usageCount: 123 },
    { id: 14, name: 'Youth', color: '#0EA5E9', usageCount: 45 },
    { id: 15, name: 'New Muslim', color: '#22C55E', usageCount: 39 },
]

export default function CategoriesAndTagsPage() {
    const [categories, setCategories] = useState(mockCategories)
    const [tags, setTags] = useState(mockTags)
    const [activeView, setActiveView] = useState('categories')
    const [showAddCategory, setShowAddCategory] = useState(false)
    const [showAddTag, setShowAddTag] = useState(false)
    const [expandedCategories, setExpandedCategories] = useState(new Set([1, 2]))
    const [editingCategory, setEditingCategory] = useState(null)

    const [newCategory, setNewCategory] = useState({ name: '', slug: '', description: '', parentId: null })
    const [newTag, setNewTag] = useState({ name: '', color: '#3B82F6' })

    useEffect(() => {
        api.get('/auth/admin/categories/').then(res => { if (res.data?.length) setCategories(res.data) }).catch(() => { })
        api.get('/auth/admin/tags/').then(res => { if (res.data?.length) setTags(res.data) }).catch(() => { })
    }, [])

    const toggleExpand = (id) => {
        setExpandedCategories(prev => {
            const next = new Set(prev)
            next.has(id) ? next.delete(id) : next.add(id)
            return next
        })
    }

    const handleAddCategory = () => {
        const cat = {
            id: Date.now(),
            name: newCategory.name,
            slug: newCategory.slug || newCategory.name.toLowerCase().replace(/\s+/g, '-'),
            description: newCategory.description,
            contentCount: 0,
            children: [],
        }
        if (newCategory.parentId) {
            setCategories(prev => prev.map(c =>
                c.id === newCategory.parentId ? { ...c, children: [...c.children, { ...cat }] } : c
            ))
        } else {
            setCategories(prev => [...prev, cat])
        }
        api.post('/auth/admin/categories/', newCategory).catch(() => { })
        setShowAddCategory(false)
        setNewCategory({ name: '', slug: '', description: '', parentId: null })
    }

    const handleAddTag = () => {
        if (!newTag.name.trim()) return
        setTags(prev => [...prev, { id: Date.now(), ...newTag, usageCount: 0 }])
        api.post('/auth/admin/tags/', newTag).catch(() => { })
        setShowAddTag(false)
        setNewTag({ name: '', color: '#3B82F6' })
    }

    const deleteTag = (id) => {
        setTags(prev => prev.filter(t => t.id !== id))
    }

    const deleteCategory = (id) => {
        setCategories(prev => prev.filter(c => c.id !== id).map(c => ({
            ...c, children: c.children?.filter(ch => ch.id !== id) || []
        })))
    }

    const tagColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316', '#14B8A6', '#64748B']

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white text-lg shadow-lg">🏷️</span>
                        Categories & Tags
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Organize Islamic content with categories and tags for better discovery
                    </p>
                </div>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 rounded-2xl p-2 border border-slate-200 dark:border-slate-800 shadow-sm w-fit">
                <button
                    onClick={() => setActiveView('categories')}
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${activeView === 'categories'
                            ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-lg'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                >
                    📁 Categories ({categories.length})
                </button>
                <button
                    onClick={() => setActiveView('tags')}
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${activeView === 'tags'
                            ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-lg'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                >
                    🏷️ Tags ({tags.length})
                </button>
            </div>

            {/* Categories View */}
            {activeView === 'categories' && (
                <div className="space-y-4">
                    <div className="flex justify-end">
                        <button
                            onClick={() => setShowAddCategory(true)}
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white text-sm font-semibold shadow-lg hover:shadow-brand-500/40 transition-all"
                        >
                            + Add Category
                        </button>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {categories.map(category => (
                                <div key={category.id}>
                                    <div
                                        className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
                                        onClick={() => category.children?.length > 0 && toggleExpand(category.id)}
                                    >
                                        <button className={`w-6 h-6 flex items-center justify-center text-slate-400 transition-transform duration-200 ${expandedCategories.has(category.id) ? 'rotate-90' : ''
                                            }`}>
                                            {category.children?.length > 0 ? '▶' : ''}
                                        </button>
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400/20 to-cyan-400/20 dark:from-teal-500/20 dark:to-cyan-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold text-sm">
                                            {category.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-semibold text-slate-900 dark:text-white">{category.name}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400">{category.description}</div>
                                        </div>
                                        <div className="text-right mr-4">
                                            <div className="text-sm font-semibold text-slate-900 dark:text-white">{category.contentCount}</div>
                                            <div className="text-[10px] text-slate-400 uppercase">items</div>
                                        </div>
                                        <div className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                                            /{category.slug}
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); deleteCategory(category.id) }}
                                            className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    {/* Children */}
                                    {expandedCategories.has(category.id) && category.children?.map(child => (
                                        <div
                                            key={child.id}
                                            className="flex items-center gap-4 px-6 py-3 pl-20 bg-slate-50/50 dark:bg-slate-800/20 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-colors"
                                        >
                                            <div className="w-2 h-2 rounded-full bg-teal-400" />
                                            <div className="flex-1">
                                                <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{child.name}</div>
                                            </div>
                                            <div className="text-xs text-slate-500">{child.contentCount} items</div>
                                            <div className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                                                /{child.slug}
                                            </div>
                                            <button
                                                onClick={() => deleteCategory(child.id)}
                                                className="text-slate-400 hover:text-red-500 transition-colors p-1 text-xs"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Tags View */}
            {activeView === 'tags' && (
                <div className="space-y-4">
                    <div className="flex justify-end">
                        <button
                            onClick={() => setShowAddTag(true)}
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white text-sm font-semibold shadow-lg hover:shadow-brand-500/40 transition-all"
                        >
                            + Add Tag
                        </button>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                        <div className="flex flex-wrap gap-3">
                            {tags.sort((a, b) => b.usageCount - a.usageCount).map(tag => (
                                <div
                                    key={tag.id}
                                    className="group flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-md transition-all duration-200"
                                >
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color }} />
                                    <span className="text-sm font-medium text-slate-900 dark:text-white">{tag.name}</span>
                                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-xs text-slate-500 dark:text-slate-400">
                                        {tag.usageCount}
                                    </span>
                                    <button
                                        onClick={() => deleteTag(tag.id)}
                                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all text-xs ml-1"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Add Category Modal */}
            {showAddCategory && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[200]" onClick={() => setShowAddCategory(false)}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-800" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add Category</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Category Name</label>
                                <input
                                    type="text"
                                    value={newCategory.name}
                                    onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }))}
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                                    placeholder="e.g. Islamic History"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Slug</label>
                                <input
                                    type="text"
                                    value={newCategory.slug}
                                    onChange={(e) => setNewCategory(prev => ({ ...prev, slug: e.target.value }))}
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                                    placeholder="auto-generated"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Parent Category (optional)</label>
                                <select
                                    value={newCategory.parentId || ''}
                                    onChange={(e) => setNewCategory(prev => ({ ...prev, parentId: e.target.value ? parseInt(e.target.value) : null }))}
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                                >
                                    <option value="">None (Top Level)</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
                                <textarea
                                    value={newCategory.description}
                                    onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                                    rows={2}
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white resize-y focus:ring-2 focus:ring-brand-500"
                                    placeholder="Brief description..."
                                />
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                            <button onClick={() => setShowAddCategory(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Cancel</button>
                            <button onClick={handleAddCategory} disabled={!newCategory.name} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white text-sm font-semibold shadow-lg disabled:opacity-50 transition-all">Add Category</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Tag Modal */}
            {showAddTag && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[200]" onClick={() => setShowAddTag(false)}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm border border-slate-200 dark:border-slate-800" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add Tag</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Tag Name</label>
                                <input
                                    type="text"
                                    value={newTag.name}
                                    onChange={(e) => setNewTag(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                                    placeholder="e.g. Hajj Tips"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Color</label>
                                <div className="flex flex-wrap gap-2">
                                    {tagColors.map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setNewTag(prev => ({ ...prev, color }))}
                                            className={`w-8 h-8 rounded-full transition-all ${newTag.color === color ? 'ring-2 ring-offset-2 ring-brand-500 scale-110' : 'hover:scale-105'}`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                            <button onClick={() => setShowAddTag(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Cancel</button>
                            <button onClick={handleAddTag} disabled={!newTag.name} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white text-sm font-semibold shadow-lg disabled:opacity-50 transition-all">Add Tag</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
