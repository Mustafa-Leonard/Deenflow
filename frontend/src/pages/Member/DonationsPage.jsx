import React, { useState, useEffect } from 'react'
import api from '../../api'
import { 
  Heart, 
  Wallet, 
  Plus, 
  Target, 
  TrendingUp, 
  Globe, 
  ShieldCheck, 
  ArrowRight, 
  History,
  Sparkles,
  Zap,
  Leaf
} from 'lucide-react'

export default function DonationsPage() {
    const [campaigns, setCampaigns] = useState([])
    const [wallet, setWallet] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (import.meta.env.VITE_PAYMENTS_ENABLED !== 'true') {
            window.location.href = '/app/dashboard'
        }
    }, [])
    
    const [donationAmount, setDonationAmount] = useState('')
    const [selectedCampaign, setSelectedCampaign] = useState(null)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [cRes, wRes] = await Promise.all([
                api.get('/donations/campaigns/'),
                api.get('/donations/wallet/')
            ])
            setCampaigns(cRes.data)
            setWallet(wRes.data[0] || { balance: 0 })
        } catch (error) {
            console.error('Failed to fetch donations data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDonation = async () => {
        if (!selectedCampaign || !donationAmount) return
        try {
            await api.post('/donations/my-donations/', {
                campaign: selectedCampaign.id,
                amount: parseFloat(donationAmount)
            })
            setDonationAmount('')
            setSelectedCampaign(null)
            fetchData()
            // Success notification here in a real app
        } catch (error) {
            console.error('Donation failed:', error)
            alert(error.response?.data?.error || 'Donation failed. Check your wallet balance.')
        }
    }

    const handleDeposit = async () => {
        const amount = prompt('Enter amount to deposit into your Zakat/Sadaqah wallet ($):')
        if (!amount || isNaN(amount)) return
        try {
            await api.post('/donations/wallet/deposit/', { amount: parseFloat(amount) })
            fetchData()
        } catch (error) {
            alert('Deposit failed')
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <div className="w-10 h-10 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin mb-4"></div>
                <div className="text-slate-500 font-medium text-sm">Connecting to impact network...</div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-24 animate-in fade-in duration-700">
            {/* Header / Wallet Section */}
            <div className="relative overflow-hidden rounded-[3rem] p-12 text-white shadow-2xl mosque-hero-bg group">
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px]"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-2 text-brand-400 font-bold text-[10px] uppercase tracking-[0.3em] mb-6">
                            <Leaf className="w-4 h-4" />
                            Charitable Excellence
                        </div>
                        <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6 leading-tight">
                          Social <span className="text-brand-400">Impact</span>
                        </h1>
                        <p className="text-brand-100/70 text-lg md:text-xl font-medium leading-relaxed max-w-xl italic font-serif">
                          "The example of those who spend their wealth in the way of Allah is like a seed [of grain] which grows seven spikes..."
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] w-full sm:w-64 text-center sm:text-left shadow-2xl relative group/wallet overflow-hidden">
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-brand-500 scale-x-0 group-hover/wallet:scale-x-100 transition-transform origin-left"></div>
                            <div className="text-[10px] uppercase font-bold text-brand-300 tracking-[0.2em] mb-3 flex items-center justify-center sm:justify-start gap-2">
                              <Wallet className="w-3.5 h-3.5" />
                              Wallet Balance
                            </div>
                            <div className="text-4xl font-display font-bold tabular-nums">
                              ${Number(wallet?.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                        </div>
                        <button
                            onClick={handleDeposit}
                            className="bg-brand-500 hover:bg-brand-400 text-brand-950 px-10 py-5 rounded-[2rem] font-bold transition-all shadow-2xl shadow-brand-500/30 active:scale-95 text-sm flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Add Funds
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
                {/* Active Campaigns */}
                <div className="xl:col-span-3 space-y-8">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-brand-50 dark:bg-brand-950/40 flex items-center justify-center text-brand-600">
                                <Globe className="w-5 h-5" />
                            </div>
                            <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Active Causes</h2>
                        </div>
                        <div className="hidden sm:flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                           <button className="px-4 py-1.5 bg-white dark:bg-slate-800 rounded-lg text-[10px] font-bold text-brand-600 shadow-sm uppercase tracking-widest">Global</button>
                           <button className="px-4 py-1.5 rounded-lg text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600">Local</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {campaigns.map(campaign => (
                            <div
                                key={campaign.id}
                                onClick={() => setSelectedCampaign(campaign)}
                                className={`deen-card group p-0 overflow-hidden flex flex-col transition-all duration-500 cursor-pointer relative ${selectedCampaign?.id === campaign.id ? 'border-brand-500 shadow-elevated ring-1 ring-brand-500/20' : 'hover:border-brand-300'}`}
                            >
                                <div className="h-48 relative overflow-hidden">
                                     {campaign.thumbnail ? (
                                        <img src={campaign.thumbnail} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                     ) : (
                                        <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-4xl group-hover:bg-brand-50 transition-colors">
                                          <Heart className="w-12 h-12 text-brand-200 group-hover:text-brand-400 transition-colors" />
                                        </div>
                                     )}
                                     <div className="absolute top-4 right-4 animate-in fade-in duration-500">
                                        {selectedCampaign?.id === campaign.id && (
                                            <div className="bg-brand-600 text-white p-2 rounded-full shadow-2xl">
                                                <Zap className="w-4 h-4 fill-current" />
                                            </div>
                                        )}
                                     </div>
                                </div>

                                <div className="p-8 flex flex-col flex-1">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-brand-600 transition-colors">
                                      {campaign.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed line-clamp-2 font-medium">
                                      {campaign.description}
                                    </p>

                                    <div className="space-y-3 mb-8 mt-auto">
                                        <div className="flex justify-between items-end">
                                            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Global Progress</div>
                                            <div className="text-sm font-bold text-brand-600 tabular-nums">
                                              {((campaign.current_amount / campaign.target_amount) * 100).toFixed(0)}%
                                            </div>
                                        </div>
                                        <div className="w-full h-2 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-100 dark:border-slate-800/50">
                                            <div
                                                className="h-full bg-brand-600 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(72,192,143,0.3)]"
                                                style={{ width: `${(campaign.current_amount / campaign.target_amount * 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-between items-center pt-6 border-t border-slate-50 dark:border-slate-800/50">
                                        <div>
                                            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest block mb-0.5">Target Goal</span>
                                            <span className="text-base font-bold text-slate-900 dark:text-white tabular-nums">${campaign.target_amount.toLocaleString()}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[9px] font-bold text-brand-300 uppercase tracking-widest block mb-0.5">Still Needed</span>
                                            <span className="text-base font-bold text-brand-600 tabular-nums">${(campaign.target_amount - campaign.current_amount).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Donation Form Sidebar */}
                <div className="xl:col-span-1">
                    <div className="sticky top-24 space-y-8">
                        <div className="deen-card p-10 overflow-hidden relative group">
                            <div className="absolute inset-x-0 top-0 h-2 bg-brand-500 shadow-[0_0_15px_rgba(72,192,143,0.5)]"></div>
                            
                            <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                              <Heart className="w-6 h-6 text-brand-600" />
                              Contribute
                            </h3>

                            {!selectedCampaign ? (
                                <div className="p-12 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2.5rem] bg-slate-50/50 dark:bg-slate-900/50 animate-pulse">
                                    <div className="text-4xl mb-6 grayscale opacity-40">🌍</div>
                                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                                      Select a cause to proceed with your donation
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <div className="p-6 bg-brand-50 dark:bg-brand-950/20 rounded-3xl border border-brand-100 dark:border-brand-950/50 relative overflow-hidden group/card shadow-sm">
                                        <div className="absolute right-[-10px] top-[-10px] opacity-5 group-hover/card:scale-110 transition-transform">
                                          <Heart className="w-20 h-20 text-brand-900" />
                                        </div>
                                        <div className="relative z-10 font-bold">
                                            <div className="text-[10px] uppercase text-brand-600 tracking-widest mb-1.5">Impact Destination</div>
                                            <div className="text-slate-900 dark:text-white leading-tight">{selectedCampaign.title}</div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-[0.2em] ml-2">Amount (USD)</label>
                                        <div className="relative">
                                          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-brand-600 leading-none">$</div>
                                          <input
                                              type="number"
                                              value={donationAmount}
                                              onChange={e => setDonationAmount(e.target.value)}
                                              placeholder="0.00"
                                              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 pl-12 rounded-3xl outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 font-display font-bold text-3xl tabular-nums shadow-sm transition-all"
                                          />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3">
                                        {[10, 50, 100].map(amt => (
                                            <button
                                                key={amt}
                                                onClick={() => setDonationAmount(amt.toString())}
                                                className="py-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 hover:border-brand-500 hover:text-brand-600 rounded-2xl text-sm font-bold transition-all shadow-sm active:scale-95"
                                            >
                                                ${amt}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={handleDonation}
                                        disabled={!donationAmount || parseFloat(donationAmount) <= 0}
                                        className="w-full btn-primary py-6 rounded-3xl flex items-center justify-center gap-3 shadow-2xl shadow-brand-600/30 active:scale-[0.98] disabled:opacity-30 disabled:shadow-none"
                                    >
                                        <span>Confirm Donation</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </button>

                                    <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex gap-4">
                                      <ShieldCheck className="w-5 h-5 text-brand-600 flex-shrink-0" />
                                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-loose">
                                          100% Transparency • No Processing Fees • Tax Deductible Receipts Available
                                      </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Automatic Zakat CTA */}
                        <div className="deen-card p-8 bg-emerald-900 text-white overflow-hidden relative group shadow-2xl">
                            <div className="absolute inset-0 bg-brand-500/5 islamic-accent pointer-events-none opacity-50"></div>
                            <div className="relative z-10 flex gap-5">
                                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 flex-shrink-0">
                                   <Leaf className="w-6 h-6 text-brand-300" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-lg leading-tight mb-2">Automated Zakat</h4>
                                    <p className="text-xs text-brand-200/80 leading-relaxed font-medium">
                                        Activate "Impact Harvest" in settings to automate your monthly Sadaqah obligations from your savings.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
