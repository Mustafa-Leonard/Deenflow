import React from 'react'
import { Link } from 'react-router-dom'

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            {/* Header */}
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
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Terms of Service</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-12">Last updated: February 19, 2026</p>

                <div className="prose dark:prose-invert max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            By accessing or using DeenFlow ("the Platform"), you agree to be bound by these Terms of Service.
                            If you do not agree with any part of these terms, you must not use the Platform. DeenFlow is an
                            AI-powered Islamic guidance platform designed to provide educational content based on the Quran and Sunnah.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">2. Nature of Content</h2>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            All content provided by DeenFlow is for <strong>educational purposes only</strong>. The AI-generated
                            answers and scholarly content on this platform are not a substitute for consulting with qualified
                            Islamic scholars. Users should verify important rulings with trusted local scholars before acting
                            upon any information provided by the Platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">3. User Responsibilities</h2>
                        <ul className="text-slate-600 dark:text-slate-400 space-y-2 list-disc list-inside">
                            <li>Provide accurate registration information</li>
                            <li>Maintain the security of your account credentials</li>
                            <li>Use the platform respectfully and in accordance with Islamic ethics</li>
                            <li>Not engage in hate speech, takfir, or sectarian attacks</li>
                            <li>Report any inaccurate or harmful content you encounter</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">4. Intellectual Property</h2>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            The DeenFlow platform, including its design, AI models, and curated content, is the intellectual
                            property of DeenFlow. Quranic text and Hadith references remain in the public domain. User-generated
                            content is owned by the respective users, with a license granted to DeenFlow for display purposes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">5. Limitation of Liability</h2>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            DeenFlow is provided "as is" without any warranties. We are not liable for any decisions made based
                            on content provided by the platform. Users are encouraged to cross-reference with authenticated
                            Islamic sources and consult qualified scholars for important matters.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">6. Contact</h2>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            For questions about these terms, contact us at{' '}
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
