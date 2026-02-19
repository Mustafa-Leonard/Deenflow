import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api'

export default function UpgradePage() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const tiers = [
        {
            id: 'free',
            name: 'Free',
            price: '0',
            description: 'Essential guidance for every Muslim.',
            features: [
                '5 AI Questions per month',
                'Basic Prayer Tracking',
                'Introductory Courses',
                'Daily Ayah'
            ],
            buttonText: 'Current Plan',
            current: true
        },
        {
            id: 'premium',
            name: 'Premium',
            price: '9.99',
            description: 'Deepen your knowledge with unlimited access.',
            features: [
                'Unlimited AI Questions',
                'Detailed Spiritual Analytics',
                'All Standard Courses',
                '10% Scholar Discount',
                'Community Growth Groups'
            ],
            buttonText: 'Upgrade to Premium',
            popular: true
        },
        {
            id: 'pro',
            name: 'Pro',
            price: '24.99',
            description: 'Personalized spiritual coaching & mastery.',
            features: [
                'Everything in Premium',
                'Priority Scholar Review',
                '1 Free Consultation Monthly',
                'Masterclass Access',
                '24/7 Priority Support'
            ],
            buttonText: 'Go Pro'
        }
    ]

    const handleUpgrade = async (tierId) => {
        if (tierId === 'free') return

        setLoading(true)
        try {
            // In a real app, this would redirect to Stripe Checkout
            const res = await api.post('/billing/subscribe/', { tier: tierId })
            if (res.data.checkoutUrl) {
                window.location.href = res.data.checkoutUrl
            } else {
                alert('Subscription successful! (Mock mode)')
                navigate('/app/dashboard')
            }
        } catch (error) {
            console.error('Upgrade failed:', error)
            alert('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                    Elevate Your Spiritual Journey
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Choose the plan that fits your growth goals. Unlock advanced AI guidance, expert scholar access, and structured Islamic learning.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {tiers.map((tier) => (
                    <div
                        key={tier.id}
                        className={`relative rounded-3xl p-8 flex flex-col transition-all duration-300 ${tier.popular
                                ? 'bg-brand-900 text-white shadow-2xl shadow-brand-900/40 ring-4 ring-brand-500/20 scale-105 z-10'
                                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:border-brand-200 dark:hover:border-brand-800'
                            }`}
                    >
                        {tier.popular && (
                            <span className="absolute top-0 right-0 -mt-4 mr-8 px-4 py-1 bg-gradient-to-r from-amber-400 to-amber-600 text-brand-950 text-xs font-bold uppercase rounded-full shadow-lg">
                                Most Popular
                            </span>
                        )}

                        <div className="mb-8">
                            <h3 className={`text-xl font-bold mb-2 ${tier.popular ? 'text-brand-100' : 'text-slate-900 dark:text-white'}`}>
                                {tier.name}
                            </h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-display font-bold">${tier.price}</span>
                                <span className={`text-sm font-medium ${tier.popular ? 'text-brand-300' : 'text-slate-500'}`}>/month</span>
                            </div>
                            <p className={`mt-4 text-sm leading-relaxed ${tier.popular ? 'text-brand-200' : 'text-slate-500 dark:text-slate-400'}`}>
                                {tier.description}
                            </p>
                        </div>

                        <ul className="space-y-4 mb-8 flex-1">
                            {tier.features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <svg className={`w-5 h-5 flex-shrink-0 ${tier.popular ? 'text-brand-400' : 'text-emerald-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className={`text-sm font-medium ${tier.popular ? 'text-brand-100' : 'text-slate-600 dark:text-slate-300'}`}>
                                        {feature}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <button
                            disabled={loading || tier.current}
                            onClick={() => handleUpgrade(tier.id)}
                            className={`w-full py-4 rounded-2xl font-bold transition-all active:scale-95 ${tier.current
                                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default'
                                    : tier.popular
                                        ? 'bg-white text-brand-900 hover:bg-brand-50 shadow-lg'
                                        : 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg'
                                }`}
                        >
                            {tier.current ? 'Your Current Plan' : tier.buttonText}
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-20 text-center">
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Secure payments via Stripe. Cancel anytime with a single click.
                </p>
                <div className="flex justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-8" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-8" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-8" />
                </div>
            </div>
        </div>
    )
}
