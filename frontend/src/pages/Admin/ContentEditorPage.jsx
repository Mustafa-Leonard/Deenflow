import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../api'

const categories = [
    'Fiqh (Jurisprudence)', 'Aqeedah (Theology)', 'Tafsir (Exegesis)',
    'Hadith', 'Seerah', 'Akhlaq (Ethics)', 'Islamic Finance',
    'Family Law', 'Dua & Adhkar', 'Islamic History',
]

const availableTags = [
    'Ramadan', 'Halal-Haram', 'Marriage', 'Dua', 'Zakat', 'Salah',
    'Quran', 'Hadith', 'Fasting', 'Tawheed', 'Family', 'Youth', 'New Muslim',
]

export default function ContentEditorPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const isEditing = !!id

    const [content, setContent] = useState({
        title: '',
        slug: '',
        category: '',
        tags: [],
        body: '',
        sources: [{ id: 1, reference: '', type: 'quran' }],
        status: 'draft',
        summary: '',
    })
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [activeTab, setActiveTab] = useState('editor')

    useEffect(() => {
        if (isEditing) {
            api.get(`/auth/admin/content/${id}/`)
                .then(res => setContent(res.data))
                .catch(() => { })
        }
    }, [id])

    const handleSave = async (submitForReview = false) => {
        setSaving(true)
        const payload = { ...content, status: submitForReview ? 'review' : 'draft' }
        try {
            if (isEditing) {
                await api.put(`/auth/admin/content/${id}/`, payload)
            } else {
                await api.post('/auth/admin/content/', payload)
            }
        } catch { /* local state only */ }
        setSaving(false)
        setSaved(true)
        if (submitForReview) setContent(prev => ({ ...prev, status: 'review' }))
        setTimeout(() => setSaved(false), 3000)
    }

    const updateTitle = (title) => {
        setContent(prev => ({
            ...prev,
            title,
            slug: title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
        }))
    }

    const toggleTag = (tag) => {
        setContent(prev => ({
            ...prev,
            tags: prev.tags.includes(tag)
                ? prev.tags.filter(t => t !== tag)
                : [...prev.tags, tag],
        }))
    }

    const addSource = () => {
        setContent(prev => ({
            ...prev,
            sources: [...prev.sources, { id: Date.now(), reference: '', type: 'quran' }],
        }))
    }

    const updateSource = (sourceId, field, value) => {
        setContent(prev => ({
            ...prev,
            sources: prev.sources.map(s => s.id === sourceId ? { ...s, [field]: value } : s),
        }))
    }

    const removeSource = (sourceId) => {
        setContent(prev => ({
            ...prev,
            sources: prev.sources.filter(s => s.id !== sourceId),
        }))
    }

    const statusColors = {
        draft: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
        review: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        published: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/content')}
                        className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        ←
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            {isEditing ? 'Edit Content' : 'Create New Content'}
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[content.status]}`}>
                                {content.status}
                            </span>
                            {content.slug && (
                                <span className="text-xs text-slate-400">/{content.slug}</span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleSave(false)}
                        disabled={saving}
                        className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${saved ? 'bg-green-100 text-green-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                    >
                        {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Draft'}
                    </button>
                    <button
                        onClick={() => handleSave(true)}
                        disabled={saving || !content.title || !content.body}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white text-sm font-semibold shadow-lg hover:shadow-brand-500/40 disabled:opacity-50 transition-all"
                    >
                        Submit for Review
                    </button>
                </div>
            </div>

            {/* Editor Tabs */}
            <div className="flex gap-2 bg-white dark:bg-slate-900 rounded-2xl p-2 border border-slate-200 dark:border-slate-800 shadow-sm w-fit">
                {[
                    { id: 'editor', label: '✏️ Editor', },
                    { id: 'sources', label: '📚 Sources' },
                    { id: 'meta', label: '⚙️ Metadata' },
                    { id: 'preview', label: '👁️ Preview' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                                ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-md'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Main Editor Area */}
                <div className="col-span-8">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        {activeTab === 'editor' && (
                            <div className="p-6 space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Title</label>
                                    <input
                                        type="text"
                                        value={content.title}
                                        onChange={(e) => updateTitle(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-lg font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 transition-all"
                                        placeholder="Enter content title..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Summary</label>
                                    <textarea
                                        value={content.summary}
                                        onChange={(e) => setContent(prev => ({ ...prev, summary: e.target.value }))}
                                        rows={2}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 resize-y transition-all"
                                        placeholder="Brief summary of the content..."
                                    />
                                </div>

                                {/* Toolbar */}
                                <div className="flex items-center gap-1 p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                                    {['B', 'I', 'U', '|', 'H1', 'H2', 'H3', '|', '📋', '🔗', '📖', '|', '🕌'].map((btn, i) => (
                                        btn === '|' ? (
                                            <div key={i} className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1" />
                                        ) : (
                                            <button
                                                key={i}
                                                className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all"
                                                title={btn === '📖' ? 'Insert Quran Reference' : btn === '🕌' ? 'Insert Arabic Text' : btn}
                                            >
                                                {btn}
                                            </button>
                                        )
                                    ))}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Content Body</label>
                                    <textarea
                                        value={content.body}
                                        onChange={(e) => setContent(prev => ({ ...prev, body: e.target.value }))}
                                        rows={20}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white font-mono leading-relaxed focus:ring-2 focus:ring-brand-500 resize-y transition-all"
                                        placeholder="Write your Islamic content here...

Supports Markdown formatting:
# Heading 1
## Heading 2
**Bold** and *Italic* text
- Bullet points
> Blockquotes for Quran verses

Arabic text: بسم الله الرحمن الرحيم"
                                    />
                                    <div className="flex justify-between mt-2 text-xs text-slate-400">
                                        <span>{content.body.length} characters · ~{content.body.split(/\s+/).filter(Boolean).length} words</span>
                                        <span>Markdown supported</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'sources' && (
                            <div className="p-6 space-y-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">References & Sources</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            Add authentic Islamic sources to support your content
                                        </p>
                                    </div>
                                    <button
                                        onClick={addSource}
                                        className="px-4 py-2 rounded-xl bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 text-sm font-medium hover:bg-brand-100 transition-colors"
                                    >
                                        + Add Source
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {content.sources.map((source, index) => (
                                        <div key={source.id} className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                                            <span className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">
                                                {index + 1}
                                            </span>
                                            <div className="flex-1 space-y-2">
                                                <select
                                                    value={source.type}
                                                    onChange={(e) => updateSource(source.id, 'type', e.target.value)}
                                                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm text-slate-900 dark:text-white"
                                                >
                                                    <option value="quran">Quran</option>
                                                    <option value="hadith">Hadith</option>
                                                    <option value="scholarly">Scholarly Work</option>
                                                    <option value="fatwa">Fatwa</option>
                                                    <option value="tafsir">Tafsir</option>
                                                    <option value="other">Other</option>
                                                </select>
                                                <input
                                                    type="text"
                                                    value={source.reference}
                                                    onChange={(e) => updateSource(source.id, 'reference', e.target.value)}
                                                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                                                    placeholder={
                                                        source.type === 'quran' ? 'e.g. Surah Al-Baqarah 2:255' :
                                                            source.type === 'hadith' ? 'e.g. Sahih Bukhari, Hadith 1' :
                                                                'Reference details...'
                                                    }
                                                />
                                            </div>
                                            <button
                                                onClick={() => removeSource(source.id)}
                                                className="text-slate-400 hover:text-red-500 transition-colors mt-1"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'meta' && (
                            <div className="p-6 space-y-5">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Content Metadata</h3>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">URL Slug</label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-slate-400">/content/</span>
                                        <input
                                            type="text"
                                            value={content.slug}
                                            onChange={(e) => setContent(prev => ({ ...prev, slug: e.target.value }))}
                                            className="flex-1 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">SEO Description</label>
                                    <textarea
                                        rows={2}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white resize-y focus:ring-2 focus:ring-brand-500"
                                        placeholder="SEO meta description (155 characters recommended)..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Featured Image URL</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === 'preview' && (
                            <div className="p-8">
                                {content.title ? (
                                    <article className="prose dark:prose-invert max-w-none">
                                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{content.title}</h1>
                                        {content.summary && (
                                            <p className="text-lg text-slate-600 dark:text-slate-400 italic border-l-4 border-brand-500 pl-4 mb-6">{content.summary}</p>
                                        )}
                                        <div className="flex items-center gap-2 mb-6">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[content.status]}`}>{content.status}</span>
                                            {content.category && <span className="px-2.5 py-1 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 text-xs font-medium">{content.category}</span>}
                                        </div>
                                        <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed">
                                            {content.body || 'No content yet...'}
                                        </div>
                                        {content.sources.filter(s => s.reference).length > 0 && (
                                            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">📚 References</h3>
                                                <ol className="list-decimal list-inside space-y-1">
                                                    {content.sources.filter(s => s.reference).map(s => (
                                                        <li key={s.id} className="text-sm text-slate-600 dark:text-slate-400">
                                                            <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 mr-1">{s.type}</span>
                                                            {s.reference}
                                                        </li>
                                                    ))}
                                                </ol>
                                            </div>
                                        )}
                                    </article>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="text-5xl mb-4">📝</div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Start writing to see the preview</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="col-span-4 space-y-5">
                    {/* Category */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Category</label>
                        <select
                            value={content.category}
                            onChange={(e) => setContent(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                        >
                            <option value="">Select category...</option>
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>

                    {/* Tags */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Tags</label>
                        <div className="flex flex-wrap gap-2">
                            {availableTags.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => toggleTag(tag)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${content.tags.includes(tag)
                                            ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 shadow-sm'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                        }`}
                                >
                                    {content.tags.includes(tag) ? '✓ ' : ''}{tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Publishing Info */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
                        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Publishing Info</h4>
                        <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                            <div className="flex justify-between">
                                <span>Status</span>
                                <span className={`px-2 py-0.5 rounded-full font-medium ${statusColors[content.status]}`}>{content.status}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Word Count</span>
                                <span className="font-medium text-slate-700 dark:text-slate-300">{content.body.split(/\s+/).filter(Boolean).length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Sources</span>
                                <span className="font-medium text-slate-700 dark:text-slate-300">{content.sources.filter(s => s.reference).length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tags</span>
                                <span className="font-medium text-slate-700 dark:text-slate-300">{content.tags.length}</span>
                            </div>
                        </div>
                    </div>

                    {/* Content Checklist */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
                        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Content Checklist</h4>
                        <div className="space-y-2">
                            {[
                                { label: 'Title added', check: !!content.title },
                                { label: 'Content body written', check: content.body.length > 50 },
                                { label: 'Category selected', check: !!content.category },
                                { label: 'At least one source', check: content.sources.some(s => s.reference) },
                                { label: 'Tags added', check: content.tags.length > 0 },
                                { label: 'Summary provided', check: !!content.summary },
                            ].map(item => (
                                <div key={item.label} className="flex items-center gap-2">
                                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${item.check ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                                        }`}>
                                        {item.check ? '✓' : '○'}
                                    </span>
                                    <span className={`text-xs ${item.check ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'}`}>
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
