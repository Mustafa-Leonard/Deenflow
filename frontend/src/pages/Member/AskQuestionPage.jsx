import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api'

export default function AskQuestionPage() {
    const navigate = useNavigate()
    const [text, setText] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!text.trim()) return

        setSubmitting(true)
        try {
            await api.post('/questions/', { text })
            alert('Question submitted for scholarly review.')
            navigate('/app/my-questions')
        } catch (err) {
            const serverMsg = err?.response?.data || err?.message || 'Failed to submit question.'
            try {
                alert(typeof serverMsg === 'string' ? serverMsg : JSON.stringify(serverMsg))
            } catch (e) {
                alert('Failed to submit question.')
            }
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto py-12 px-6">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white mb-4">
                    Seek Guidance
                </h1>
                <p className="text-slate-500 text-lg">
                    Ask a question regarding Islamic principles. Our AI will draft an answer based on verified Fiqh rulings, which will then be reviewed by a human scholar.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl">
                    <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Your Question</label>
                    <textarea
                        required
                        rows="6"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="e.g. Is it permissible to take a mortgage for a first-time home buyer in the UK?"
                        className="w-full bg-transparent text-xl text-slate-900 dark:text-white outline-none leading-relaxed resize-none"
                    />
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-5 bg-brand-600 text-white font-bold rounded-2xl shadow-2xl shadow-brand-600/30 hover:bg-brand-700 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                    {submitting ? 'Submitting...' : 'Submit to Fiqh Reviewers'}
                </button>

                <p className="text-center text-xs text-slate-400 font-medium">
                    ⚡ Guaranteed response derived ONLY from verified scholarly rulings.
                </p>
            </form>
        </div>
    )
}
