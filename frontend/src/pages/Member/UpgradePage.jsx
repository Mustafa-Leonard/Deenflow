import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api'
import { 
  Zap, 
  Check, 
  Lock, 
  ShieldCheck, 
  Star, 
  Sparkles, 
  Infinity, 
  GraduationCap, 
  Users, 
  BarChart, 
  MessageSquare,
  Gift,
  ArrowRight
} from 'lucide-react'

export default function UpgradePage() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [phone, setPhone] = useState('')
    const [showMpesa, setShowMpesa] = useState(false)
    const [selectedTier, setSelectedTier] = useState(null)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    React.useEffect(() => {
        if (import.meta.env.VITE_PAYMENTS_ENABLED !== 'true') {
            navigate('/app/dashboard')
        }
    }, [navigate])

    const tiers = [
        {
            id: 'free',
            name: 'Seeker',
            price: '0',
            description: 'Essential spiritual tools to begin your journey of growth.',
            features: [
                { text: '5 AI Questions monthly', icon: <MessageSquare className="w-4 h-4" /> },
                { text: 'Basic Prayer Tracking', icon: <Star className="w-4 h-4" /> },
                { text: 'Introduction Courses', icon: <GraduationCap className="w-4 h-4" /> },
                { text: 'Daily Quranic Ayah', icon: <Sparkles className="w-4 h-4" /> }
            ],
            buttonText: 'Current Plan',
            current: true
        },
        {
            id: 'premium',
            name: 'Growth',
            price: '9.99',
            description: 'Unlock full access to deep Islamic knowledge and AI insights.',
            features: [
                { text: 'Unlimited AI Guidance', icon: <Infinity className="w-4 h-4" /> },
                { text: 'Advanced Analytics', icon: <BarChart className="w-4 h-4" /> },
                { text: 'Standard Academy Access', icon: <GraduationCap className="w-4 h-4" /> },
                { text: '10% Scholar Discount', icon: <Gift className="w-4 h-4" /> },
                { text: 'Growth Communities', icon: <Users className="w-4 h-4" /> }
            ],
            buttonText: 'Upgrade to Growth',
            popular: true
        },
        {
            id: 'pro',
            name: 'Legacy',
            price: '24.99',
            description: 'Elite mentorship and personalized scholar access for mastery.',
            features: [
                { text: 'Everything in Growth', icon: <Zap className="w-4 h-4" /> },
                { text: 'Scholar Priority Access', icon: <ShieldCheck className="w-4 h-4" /> },
                { text: '1 Monthly Consultation', icon: <Users className="w-4 h-4" /> },
                { text: 'Masterclass Series', icon: <Star className="w-4 h-4" /> },
                { text: 'Personal Concierge', icon: <Sparkles className="w-4 h-4" /> }
            ],
            buttonText: 'Unlock Legacy'
        }
    ]

const handleUpgrade = async (tierId) => {
        if (tierId === 'free') return
        setError('')
        setSuccess('')
        setSelectedTier(tierId)
        setShowMpesa(true)
    }

    const handleMpesaPay = async () => {
        if (!selectedTier || !phone) {
            setError('Please enter your M-Pesa phone number.')
            return
        }
        setLoading(true)
        setError('')
        setSuccess('')
        try {
            const res = await api.post('/billing/my-subscription/mpesa_pay/', {
                tier: selectedTier,
                phone
            })

            setShowMpesa(false)
            setSuccess(`M-Pesa prompt sent to ${phone}. Confirm the payment on your phone (KSh ${res.data.amount}).`)

            const saved = localStorage.getItem('user')
            if (saved) {
                const userObj = JSON.parse(saved)
                userObj.subscription = res.data.tier
                localStorage.setItem('user', JSON.stringify(userObj))
            }
        } catch (error) {
            console.error('M-Pesa payment failed:', error)
            setError(error.response?.data?.error || 'M-Pesa payment failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-7xl mx-auto py-12 px-6 sm:px-8 lg:px-12 pb-24 animate-in fade-in duration-700">
            {/* Header section */}
            <div className="text-center mb-24 max-w-3xl mx-auto">
                <div className="flex justify-center mb-6">
                   <div className="w-16 h-1 bg-brand-600 rounded-full"></div>
                </div>
                <h1 className="text-4xl md:text-6xl font-display font-bold text-slate-900 dark:text-white mb-8 tracking-tight leading-tight">
                    Elevate Your <span className="text-brand-600">Spiritual Journey</span>
                </h1>
                <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed font-serif italic">
                    "Whosoever desires the reward of this world, with Allah is the reward of this world and the Hereafter."
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 lg:gap-8 items-stretch">
                {tiers.map((tier) => (
                    <div
                        key={tier.id}
                        className={`deen-card group flex flex-col p-10 relative overflow-hidden transition-all duration-500 h-full ${
                            tier.popular 
                                ? 'bg-brand-900 text-white border-0 shadow-2xl shadow-brand-900/40 md:scale-105 z-10' 
                                : 'hover:border-brand-500'
                        }`}
                    >
                        {/* Premium Pattern Overlay */}
                        {tier.popular && (
                          <div className="absolute inset-0 opacity-10 islamic-accent pointer-events-none"></div>
                        )}
                        
                        {tier.popular && (
                            <div className="absolute top-0 right-0 p-4">
                               <div className="bg-amber-400 text-brand-950 text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 translate-y-[-10px] sm:translate-y-0">
                                  <Star className="w-3 h-3 fill-current" />
                                  Highly Appreciated
                               </div>
                            </div>
                        )}

                        <div className="mb-10 relative z-10">
                            <h3 className={`text-2xl font-display font-bold mb-4 ${tier.popular ? 'text-brand-300' : 'text-slate-900 dark:text-white'}`}>
                                {tier.name}
                            </h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-display font-bold tabular-nums">${tier.price}</span>
                                <span className={`text-xs font-bold uppercase tracking-widest ${tier.popular ? 'text-brand-400' : 'text-slate-400'}`}>/ Month</span>
                            </div>
                            <p className={`mt-6 text-sm font-medium leading-relaxed opacity-80 ${tier.popular ? 'text-brand-100' : 'text-slate-500 dark:text-slate-400 font-serif italic'}`}>
                                {tier.description}
                            </p>
                        </div>

                        <div className={`h-px w-full mb-10 ${tier.popular ? 'bg-white/10' : 'bg-slate-100 dark:bg-slate-800'}`}></div>

                        <ul className="space-y-6 mb-12 flex-1 relative z-10">
                            {tier.features.map((feature, i) => (
                                <li key={i} className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${tier.popular ? 'bg-white/10 text-brand-400' : 'bg-brand-50 dark:bg-brand-900/20 text-brand-600'}`}>
                                        {feature.icon}
                                    </div>
                                    <span className={`text-sm font-bold ${tier.popular ? 'text-brand-50' : 'text-slate-600 dark:text-slate-300'}`}>
                                        {feature.text}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <button
                            disabled={loading || tier.current}
                            onClick={() => handleUpgrade(tier.id)}
                            className={`w-full py-5 rounded-[2rem] font-bold transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-xl relative z-10 ${
                                tier.current
                                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default opacity-50 shadow-none'
                                    : tier.popular
                                        ? 'bg-white text-brand-900 hover:bg-brand-50'
                                        : 'bg-brand-600 text-white hover:bg-brand-700 shadow-brand-600/20'
                            }`}
                        >
                            {tier.current ? 'Current Plan' : (
                              <>
                                <span>{tier.buttonText}</span>
                                <ArrowRight className="w-4 h-4" />
                              </>
                            )}
                        </button>
                    </div>
                ))}
            </div>

            {/* Bottom info section */}
            <div className="mt-32 max-w-4xl mx-auto space-y-12">
                <div className="flex flex-col md:flex-row items-center justify-center gap-12 py-10 border-t border-slate-100 dark:border-slate-800">
                  <TrustItem icon={<ShieldCheck className="w-6 h-6" />} text="Bank-grade Encryption" />
                  <TrustItem icon={<Lock className="w-6 h-6" />} text="Secure Stripe Checkout" />
                  <TrustItem icon={<Infinity className="w-6 h-6" />} text="Cancel Anytime Safely" />
                </div>
                
                <div className="flex justify-center gap-12 grayscale opacity-40 hover:opacity-100 hover:grayscale-0 transition-all duration-700">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-6" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                </div>
                
<p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] font-display">
                    Ensuring Halaal Transactions Globally
                </p>

                {/* M-Pesa payment method note */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-8">
                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                        <span className="text-2xl">📱</span>
                        <div>
                            <div className="text-sm font-bold text-slate-900 dark:text-white">M-Pesa (Lipa na M-Pesa)</div>
                            <div className="text-xs text-slate-500">Pay securely via Safaricom M-Pesa STK Push</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error / Success toasts */}
            {error && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-4 rounded-2xl shadow-2xl text-sm font-bold max-w-md text-center">
                    {error}
                </div>
            )}
            {success && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-brand-600 text-white px-6 py-4 rounded-2xl shadow-2xl text-sm font-bold max-w-md text-center">
                    {success}
                </div>
            )}

            {/* M-Pesa Payment Modal */}
            {showMpesa && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMpesa(false)} />
                    <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 w-full max-w-md">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="text-2xl">📱</span> Pay with M-Pesa
                            </h3>
                            <button onClick={() => setShowMpesa(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-2xl leading-none">&times;</button>
                        </div>

                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                            Enter your M-Pesa phone number. We'll send an STK push prompt to your phone to complete the payment.
                        </p>

                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                            M-Pesa Phone Number
                        </label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            placeholder="0712 345 678"
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 text-lg font-bold text-slate-900 dark:text-white transition-all"
                        />

                        <button
                            onClick={handleMpesaPay}
                            disabled={loading}
                            className="w-full mt-6 bg-brand-600 hover:bg-brand-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-brand-600/30 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                                    Sending prompt...
                                </>
                            ) : (
                                'Send M-Pesa Prompt'
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

function TrustItem({ icon, text }) {
  return (
    <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest">
      <div className="text-brand-600 opacity-60">
        {icon}
      </div>
      {text}
    </div>
  )
}
