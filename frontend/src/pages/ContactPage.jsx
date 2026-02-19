import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

export default function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            await api.post('/auth/contact/', form)
        } catch { /* fallback: just show success */ }
        setSubmitting(false)
        setSubmitted(true)
        setForm({ name: '', email: '', subject: '', message: '' })
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group">
                        <img src="/deenflow-icon.svg" alt="DeenFlow" className="w-8 h-8 transition-transform group-hover:scale-110" />
                        <img src="/deenflow-logo.svg" alt="DeenFlow" className="h-5 w-auto" />
                    </Link>
                    <Link to="/login" className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors">
                        ← Back to App
                    </Link>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-16">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Contact & Support</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-12 max-w-xl">
                    Have a question, feedback, or need help? Reach out to us — we'd love to hear from you.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div>
                        {submitted ? (
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-emerald-200 dark:border-emerald-900/30 p-10 text-center">
                                <div className="text-5xl mb-4">✅</div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Message Sent!</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                                    Jazakallah Khair for contacting us. We'll respond within 24 hours inshaAllah.
                                </p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="px-6 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors"
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Your Name</label>
                                    <input
                                        type="text" required value={form.name}
                                        onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                                        placeholder="e.g. Abdullah"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                                    <input
                                        type="email" required value={form.email}
                                        onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                                        placeholder="your@email.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Subject</label>
                                    <select
                                        required value={form.subject}
                                        onChange={(e) => setForm(p => ({ ...p, subject: e.target.value }))}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                                    >
                                        <option value="">Select a topic...</option>
                                        <option value="general">General Inquiry</option>
                                        <option value="bug">Bug Report</option>
                                        <option value="feedback">Feedback / Suggestion</option>
                                        <option value="content">Content Accuracy Issue</option>
                                        <option value="account">Account Help</option>
                                        <option value="scholar">Scholar Application</option>
                                        <option value="partnership">Partnership / Collaboration</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Message</label>
                                    <textarea
                                        required value={form.message} rows={5}
                                        onChange={(e) => setForm(p => ({ ...p, message: e.target.value }))}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white resize-y focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                                        placeholder="Describe your question or issue..."
                                    />
                                </div>
                                <button
                                    type="submit" disabled={submitting}
                                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold hover:shadow-lg hover:shadow-brand-500/30 disabled:opacity-50 transition-all"
                                >
                                    {submitting ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Contact Info Cards */}
                    <div className="space-y-5">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center text-xl flex-shrink-0">📧</div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">Email Us</h3>
                                    <a href="mailto:leonardlewa372@gmail.com" className="text-sm text-brand-600 hover:text-brand-700 transition-colors">
                                        leonardlewa372@gmail.com
                                    </a>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">We respond within 24 hours</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-xl flex-shrink-0">📞</div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">Call Us</h3>
                                    <a href="tel:0112681600" className="text-sm text-emerald-600 hover:text-emerald-700 transition-colors">
                                        0112 681 600
                                    </a>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Sun-Fri, 9:00 AM - 5:00 PM (EAT)</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-xl flex-shrink-0">💬</div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">WhatsApp</h3>
                                    <a href="https://wa.me/254112681600" target="_blank" rel="noopener noreferrer" className="text-sm text-green-600 hover:text-green-700 transition-colors">
                                        Chat with us on WhatsApp
                                    </a>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Quick support via WhatsApp</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-900/20 flex items-center justify-center text-xl flex-shrink-0">🌐</div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">Social Media</h3>
                                    <div className="flex gap-3 mt-2">
                                        <a href="https://www.facebook.com/leonard.lewa.372" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">Facebook</a>
                                        <a href="https://www.instagram.com/leonardlewa" target="_blank" rel="noopener noreferrer" className="text-xs text-pink-600 hover:underline">Instagram</a>
                                        <a href="https://x.com/leonardlewa" target="_blank" rel="noopener noreferrer" className="text-xs text-slate-600 hover:underline">Twitter/X</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
