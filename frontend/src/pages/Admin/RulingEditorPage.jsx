import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../api'

export default function RulingEditorPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const isEdit = Boolean(id)
    const [loading, setLoading] = useState(isEdit)
    const [formData, setFormData] = useState({
        title: '',
        topic: '',
        description: '',
        ruling_text: '',
        scholar_name: '',
        verification_status: 'draft',
        tags: [],
        evidence_quran: [],
        evidence_hadith: []
    })

    useEffect(() => {
        if (isEdit) fetchRuling()
    }, [id])

    const fetchRuling = async () => {
        try {
            const res = await api.get(`/fiqh/rulings/${id}/`)
            setFormData(res.data)
        } catch (err) {
            alert('Failed to load ruling')
            navigate('/admin/fiqh')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (isEdit) await api.put(`/fiqh/rulings/${id}/`, formData)
            else await api.post('/fiqh/rulings/', formData)
            navigate('/admin/fiqh')
        } catch (err) {
            alert('Save failed')
        }
    }

    if (loading) return <div className="p-12 text-center text-slate-400">Loading editor...</div>

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
                <div>
                    <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">
                        {isEdit ? 'Edit Ruling' : 'New Ruling'}
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Ensure all evidence and scholarly references are accurate.
                    </p>
                </div>
                <button onClick={() => navigate('/admin/fiqh')} className="text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium">Cancel</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Ruling Title</label>
                        <input
                            required
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-5 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-brand-500/50"
                            placeholder="e.g. Loan Interest and Riba Principles"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Target Topic</label>
                        <select
                            required
                            value={formData.topic}
                            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                            className="w-full px-5 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none"
                        >
                            <option value="">Select Topic</option>
                            <option value="finance">Finance</option>
                            <option value="family">Family</option>
                            <option value="halal">Halal / Haram</option>
                            <option value="worship">Worship</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Short Summary</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows="2"
                        className="w-full px-5 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none"
                        placeholder="Brief overview of the ruling (internal only)"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-brand-600">The Practical Ruling (Fatwa Text)</label>
                    <textarea
                        required
                        value={formData.ruling_text}
                        onChange={(e) => setFormData({ ...formData, ruling_text: e.target.value })}
                        rows="6"
                        className="w-full px-5 py-4 bg-white dark:bg-slate-950 border-2 border-brand-500/20 dark:border-brand-500/10 rounded-3xl outline-none focus:border-brand-500/50 shadow-sm"
                        placeholder="Detailed ruling text as it should be used for answering user questions..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Scholar / Source Name</label>
                        <input
                            required
                            type="text"
                            value={formData.scholar_name}
                            onChange={(e) => setFormData({ ...formData, scholar_name: e.target.value })}
                            className="w-full px-5 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Verification Status</label>
                        <select
                            value={formData.verification_status}
                            onChange={(e) => setFormData({ ...formData, verification_status: e.target.value })}
                            className="w-full px-5 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none"
                        >
                            <option value="draft">Draft</option>
                            <option value="verified">Verified (Approved for AI context)</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                    <button
                        type="submit"
                        className="w-full py-4 bg-brand-600 text-white font-bold rounded-2xl shadow-xl shadow-brand-500/30 hover:bg-brand-700 transition-all transform active:scale-[0.98]"
                    >
                        {isEdit ? 'Update Fiqh Ruling' : 'Publish to Fiqh Library'}
                    </button>
                </div>
            </form>
        </div>
    )
}
