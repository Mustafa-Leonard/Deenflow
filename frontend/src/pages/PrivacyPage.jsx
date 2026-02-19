import React from 'react'
import { Link } from 'react-router-dom'

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group">
                        <img src="/deenflow-icon.svg" alt="DeenFlow" className="w-8 h-8 transition-transform group-hover:scale-110" />
                        <img src="/deenflow-logo.svg" alt="DeenFlow" className="h-5 w-auto" />
                    </Link>
                    <Link to="/login" className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors">
                        ← Back to App
                    </Link>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-16">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Privacy Policy</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-12">Last updated: February 19, 2026</p>

                <div className="prose dark:prose-invert max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">1. Information We Collect</h2>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            DeenFlow collects the following information to provide and improve our services:
                        </p>
                        <ul className="text-slate-600 dark:text-slate-400 space-y-2 list-disc list-inside">
                            <li><strong>Account Information:</strong> Name, email address, and password (encrypted)</li>
                            <li><strong>Usage Data:</strong> Questions asked, pages visited, and features used</li>
                            <li><strong>Preferences:</strong> Madhab preference, language settings, and notification preferences</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">2. How We Use Your Information</h2>
                        <ul className="text-slate-600 dark:text-slate-400 space-y-2 list-disc list-inside">
                            <li>To provide personalized Islamic guidance through our AI system</li>
                            <li>To improve the accuracy and relevance of our content</li>
                            <li>To send you important updates, reminders, and educational newsletters (if opted in)</li>
                            <li>To maintain the security and integrity of our platform</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">3. Data Protection</h2>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            We implement industry-standard security measures including encryption, secure authentication
                            (JWT tokens), and regular security audits. Your questions and personal data are never shared
                            with third parties without your explicit consent.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">4. Your Rights</h2>
                        <ul className="text-slate-600 dark:text-slate-400 space-y-2 list-disc list-inside">
                            <li>Access: You can view all data we hold about you</li>
                            <li>Correction: Request corrections to your personal information</li>
                            <li>Deletion: Request deletion of your account and associated data</li>
                            <li>Export: Download your data in a portable format</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">5. Cookies</h2>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            DeenFlow uses essential cookies for authentication and preferences. We do not use
                            third-party tracking cookies or sell any user data to advertisers.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">6. Contact</h2>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            For privacy-related inquiries, reach us at{' '}
                            <a href="mailto:leonardlewa372@gmail.com" className="text-brand-600 hover:text-brand-700 underline">
                                leonardlewa372@gmail.com
                            </a>{' '}
                            or call <a href="tel:0112681600" className="text-brand-600 hover:text-brand-700 underline">0112 681 600</a>.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    )
}
