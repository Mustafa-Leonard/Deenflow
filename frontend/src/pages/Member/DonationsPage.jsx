import React, { useState, useEffect } from 'react'
import api from '../../api'
import Card from '../../components/Card'

export default function DonationsPage() {
    const [campaigns, setCampaigns] = useState([])
    const [wallet, setWallet] = useState(null)
    const [loading, setLoading] = useState(true)

    React.useEffect(() => {
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
            alert('JazakAllah Khair! Donation successful.')
            setDonationAmount('')
            setSelectedCampaign(null)
            fetchData()
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

    if (loading) return <div className="p-20 text-center animate-pulse text-slate-500">Connecting to impact network...</div>

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom duration-700">
            {/* Header / Wallet Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl font-display font-bold tracking-tight mb-2">Social <span className="text-brand-400">Impact</span></h1>
                    <p className="text-slate-400 font-medium text-lg">Automate your Zakat and Sadaqah with DeenFlow.</p>
                </div>

                <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
                    <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-md w-full sm:w-auto text-center sm:text-left">
                        <div className="text-[10px] uppercase font-bold text-brand-300 tracking-[0.2em] mb-1">Wallet Balance</div>
                        <div className="text-3xl font-display font-bold">${Number(wallet?.balance || 0).toFixed(2)}</div>
                    </div>
                    <button
                        onClick={handleDeposit}
                        className="bg-brand-500 hover:bg-brand-400 text-slate-900 px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-brand-500/20 active:scale-95 text-sm"
                    >
                        Add Funds
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                {/* Active Campaigns */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="flex items-center justify-between px-4">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Active Campaigns</h2>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{campaigns.length} Opportunities</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {campaigns.map(campaign => (
                            <div
                                key={campaign.id}
                                onClick={() => setSelectedCampaign(campaign)}
                                className={`group p-6 bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 transition-all cursor-pointer ${selectedCampaign?.id === campaign.id ? 'border-brand-600 shadow-2xl' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 shadow-soft'}`}
                            >
                                <div className="w-full h-40 bg-slate-100 dark:bg-slate-800 rounded-[2rem] mb-6 overflow-hidden flex items-center justify-center text-3xl">
                                    {campaign.thumbnail ? <img src={campaign.thumbnail} alt="" className="w-full h-full object-cover" /> : '🌍'}
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-brand-600 transition-colors">{campaign.title}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed font-medium">{campaign.description}</p>

                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                                        <span className="text-slate-400">Progress</span>
                                        <span className="text-brand-600">{(campaign.current_amount / campaign.target_amount * 100).toFixed(0)}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-brand-600 transition-all duration-1000"
                                            style={{ width: `${(campaign.current_amount / campaign.target_amount * 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target</div>
                                        <div className="text-sm font-bold text-slate-900 dark:text-white">${campaign.target_amount.toLocaleString()}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Raised</div>
                                        <div className="text-sm font-bold text-brand-600">${campaign.current_amount.toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Donation Form */}
                <div className="space-y-6">
                    <Card className="p-8 sticky top-24 border-0 shadow-soft rounded-[2.5rem]">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Make a Donation</h3>

                        {!selectedCampaign ? (
                            <div className="p-10 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl">
                                <div className="text-4xl mb-4 grayscale opacity-50">👆</div>
                                <p className="text-sm text-slate-500 font-medium">Select a campaign to contribute.</p>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-in fade-in slide-in-from-top-4">
                                <div className="p-4 bg-brand-50 dark:bg-brand-900/20 rounded-2xl border border-brand-100 dark:border-brand-800/50">
                                    <div className="text-[10px] uppercase font-bold text-brand-600 tracking-widest mb-1">Contributing To</div>
                                    <div className="text-sm font-bold text-slate-900 dark:text-white">{selectedCampaign.title}</div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest ml-2">Amount (USD)</label>
                                    <input
                                        type="number"
                                        value={donationAmount}
                                        onChange={e => setDonationAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-500 font-bold text-lg"
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    {[10, 50, 100].map(amt => (
                                        <button
                                            key={amt}
                                            onClick={() => setDonationAmount(amt.toString())}
                                            className="py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-xs font-bold transition-all"
                                        >
                                            ${amt}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={handleDonation}
                                    className="w-full bg-slate-950 dark:bg-brand-600 hover:bg-slate-800 dark:hover:bg-brand-700 text-white py-4 rounded-2xl font-bold transition-all shadow-xl active:scale-[0.98]"
                                >
                                    Confirm Donation
                                </button>

                                <p className="text-[10px] text-center text-slate-500 font-medium px-4">
                                    Secure transaction processed by DeenFlow Impact Engine. 100% of funds go to the campaign partner.
                                </p>
                            </div>
                        )}
                    </Card>

                    <Card className="p-8 border-0 shadow-soft rounded-[2.5rem] bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30">
                        <div className="flex gap-4">
                            <div className="text-2xl pt-1">💡</div>
                            <div>
                                <h4 className="font-bold text-emerald-900 dark:text-emerald-400 text-sm">Automatic Zakat</h4>
                                <p className="text-xs text-emerald-700 dark:text-emerald-500 mt-1 leading-relaxed">
                                    Enable "Harvest Mode" in settings to automatically contribute a percentage of your monthly savings to chosen causes.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
