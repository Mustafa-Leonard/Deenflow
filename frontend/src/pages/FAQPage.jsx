import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const faqs = [
    {
        category: 'General',
        items: [
            {
                q: 'What is DeenFlow?',
                a: 'DeenFlow is an AI-powered Islamic knowledge platform that provides authentic guidance based on the Quran and Sunnah. Our system combines cutting-edge artificial intelligence with verified Islamic scholarship to help Muslims find answers to their questions about faith, worship, and daily life.'
            },
            {
                q: 'Is DeenFlow a substitute for a real scholar?',
                a: 'No. DeenFlow is designed as an educational tool to help you explore Islamic knowledge. For important personal rulings (fatwas), marriage, divorce, inheritance, or complex fiqh matters, please consult a qualified local scholar. Our AI provides general guidance only.'
            },
            {
                q: 'Which madhab does DeenFlow follow?',
                a: 'DeenFlow is not limited to any single madhab. Our AI presents answers with references from multiple scholarly traditions (Hanafi, Maliki, Shafi\'i, Hanbali) so you can see the diversity of scholarly opinion. You can set your preferred madhab in your profile settings.'
            },
        ]
    },
    {
        category: 'AI & Accuracy',
        items: [
            {
                q: 'How accurate is the AI?',
                a: 'Our AI is trained on authenticated Islamic sources and every response goes through scholarly review. However, AI can make mistakes, which is why we have a flagging system and scholar review process. If you notice any inaccuracy, please report it immediately.'
            },
            {
                q: 'Can I flag an incorrect answer?',
                a: 'Absolutely! Every AI response has a flag button. When you flag content, it goes directly to our moderation team and qualified scholars for review. This helps us continuously improve the accuracy of our platform.'
            },
            {
                q: 'What sources does the AI use?',
                a: 'DeenFlow\'s AI references the Holy Quran, the six canonical Hadith collections (Sahih Bukhari, Sahih Muslim, Sunan Abu Dawood, Jami at-Tirmidhi, Sunan an-Nasa\'i, Sunan Ibn Majah), classical Tafsir works, and established fiqh texts from recognized scholars.'
            },
        ]
    },
    {
        category: 'Account & Privacy',
        items: [
            {
                q: 'Is my data safe?',
                a: 'Yes. We use industry-standard encryption, secure JWT authentication, and never share your personal data with third parties. Your questions and interactions are kept confidential. See our Privacy Policy for full details.'
            },
            {
                q: 'Can I delete my account?',
                a: 'Yes. You can request account deletion at any time through your Profile settings or by contacting us. All your data will be permanently removed within 30 days of the request.'
            },
            {
                q: 'How do I change my madhab preference?',
                a: 'Go to Settings > Preferences in your member dashboard. You can update your preferred madhab, language, and notification settings at any time.'
            },
        ]
    },
    {
        category: 'Features',
        items: [
            {
                q: 'How does the Quran reader work?',
                a: 'Our Quran reader provides the full Arabic text with multiple translations, transliterations, and audio recitations from renowned Qaris. You can browse by Surah or Juz, bookmark your favorite verses, and track your reading progress.'
            },
            {
                q: 'What is the Deen Planner?',
                a: 'The Deen Planner is a personal tracking tool that helps you maintain consistency in your worship (ibadah). Track your daily prayers, Quran reading, dhikr, fasting, and other acts of worship with visual progress reports.'
            },
            {
                q: 'Can I save answers for later?',
                a: 'Yes! You can bookmark any AI response or Quran verse using the save button. Access all your saved items from the "Saved Items" section in your sidebar.'
            },
        ]
    },
]

export default function FAQPage() {
    const [openItems, setOpenItems] = useState(new Set())

    const toggleItem = (key) => {
        setOpenItems(prev => {
            const next = new Set(prev)
            next.has(key) ? next.delete(key) : next.add(key)
            return next
        })
    }

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
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Frequently Asked Questions</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-12 max-w-xl">
                    Find answers to the most common questions about DeenFlow.
                </p>

                <div className="space-y-10">
                    {faqs.map((section) => (
                        <div key={section.category}>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="w-5 h-0.5 bg-brand-500 rounded-full" />
                                {section.category}
                            </h2>
                            <div className="space-y-2">
                                {section.items.map((item, idx) => {
                                    const key = `${section.category}-${idx}`
                                    const isOpen = openItems.has(key)
                                    return (
                                        <div key={key} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-300 shadow-sm">
                                            <button
                                                onClick={() => toggleItem(key)}
                                                className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                                            >
                                                <span className="text-sm font-semibold text-slate-900 dark:text-white">{item.q}</span>
                                                <span className={`text-slate-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
                                                    ▼
                                                </span>
                                            </button>
                                            {isOpen && (
                                                <div className="px-5 pb-4 border-t border-slate-100 dark:border-slate-800 pt-3">
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.a}</p>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-900/20 dark:to-brand-800/10 rounded-2xl p-8 text-center border border-brand-200 dark:border-brand-800/30">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Still have questions?</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-5">
                        Can't find what you're looking for? Reach out to us directly.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <Link
                            to="/contact"
                            className="px-6 py-3 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 shadow-lg hover:shadow-brand-600/30 transition-all"
                        >
                            Contact Support
                        </Link>
                        <a
                            href="https://wa.me/254112681600"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 shadow-lg hover:shadow-green-600/30 transition-all"
                        >
                            WhatsApp Us
                        </a>
                    </div>
                </div>
            </main>
        </div>
    )
}
