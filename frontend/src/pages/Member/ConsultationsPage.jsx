import React, { useState, useEffect } from 'react'
import api from '../../api'
import Card from '../../components/Card'

export default function ConsultationsPage() {
    const [scholars, setScholars] = useState([])
    const [sessions, setSessions] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedScholar, setSelectedScholar] = useState(null)
    const [showBooking, setShowBooking] = useState(false)
    const [bookingData, setBookingData] = useState({
        scheduled_at: '',
        topic: '',
        notes: ''
    })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [sRes, sessRes] = await Promise.all([
                api.get('/consultation/scholars/'),
                api.get('/consultation/sessions/')
            ])
            setScholars(sRes.data)
            setSessions(sessRes.data)
        } catch (error) {
            console.error('Failed to fetch consultation data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleBookSession = async () => {
        try {
            await api.post('/consultation/sessions/', {
                scholar: selectedScholar.id,
                ...bookingData
            })
            alert('Consultation request sent successfully!')
            setShowBooking(false)
            setBookingData({ scheduled_at: '', topic: '', notes: '' })
            fetchData()
        } catch (error) {
            alert('Failed to book session. Please check your data.')
        }
    }

    if (loading) return <div className="p-20 text-center animate-pulse text-slate-500">Connecting to scholars network...</div>

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
                        Scholar <span className="text-brand-600">Consultation</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">
                        Direct access to verified traditional knowledge and fatwa guidance.
                    </p>
                </div>

                <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
                    <button className="px-6 py-2 bg-white dark:bg-slate-900 rounded-xl text-xs font-bold shadow-sm">Browse Scholars</button>
                    <button className="px-6 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">My Sessions</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Scholars List */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {scholars.map(scholar => (
                            <div
                                key={scholar.id}
                                className="group bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 hover:border-brand-300 dark:hover:border-brand-900 transition-all shadow-soft hover:shadow-2xl"
                            >
                                <div className="flex items-start gap-6 mb-6">
                                    <div className="w-20 h-20 rounded-[1.5rem] bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0 border-2 border-white dark:border-slate-800 shadow-md">
                                        {scholar.profile_picture ? <img src={scholar.profile_picture} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl font-bold bg-brand-50 text-brand-600 font-display">{scholar.full_name.charAt(0)}</div>}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">{scholar.full_name}</h3>
                                            {scholar.is_verified && <span className="text-blue-500 text-xs">Verified ✓</span>}
                                        </div>
                                        <div className="flex flex-wrap gap-1 mb-2">
                                            {scholar.specializations.map(s => (
                                                <span key={s.id} className="text-[9px] font-bold uppercase tracking-wider bg-slate-50 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-md border border-slate-100 dark:border-slate-700">{s.name}</span>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="text-yellow-500 text-xs">⭐</span>
                                            <span className="text-xs font-bold text-slate-900 dark:text-white">{scholar.rating.toFixed(1)}</span>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium line-clamp-2 leading-relaxed h-10">
                                    {scholar.bio}
                                </p>

                                <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800">
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Rate</span>
                                        <span className="text-lg font-bold text-brand-600">${scholar.hourly_rate}/hr</span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setSelectedScholar(scholar)
                                            setShowBooking(true)
                                        }}
                                        className="bg-slate-950 dark:bg-brand-600 hover:bg-slate-800 dark:hover:bg-brand-700 text-white px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-lg active:scale-95"
                                    >
                                        Book Session
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar - Quick Stats / Active Sessions */}
                <div className="space-y-8">
                    <Card className="p-8 border-0 shadow-soft rounded-[2.5rem] bg-indigo-900 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                        <h3 className="text-xl font-bold mb-6 relative z-10">Active Sessions</h3>
                        <div className="space-y-4 relative z-10">
                            {sessions.filter(s => s.status === 'confirmed').length > 0 ? (
                                sessions.filter(s => s.status === 'confirmed').map(session => (
                                    <div key={session.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="font-bold text-sm">Session with {session.scholar_name}</div>
                                            <span className="text-[9px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Confirmed</span>
                                        </div>
                                        <div className="text-xs text-slate-300 font-medium">{new Date(session.scheduled_at).toLocaleString()}</div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-indigo-200">No upcoming sessions scheduled.</p>
                            )}
                        </div>
                    </Card>

                    <Card className="p-8 border-0 shadow-soft rounded-[2.5rem]">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Advisory Board</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                            Our scholars represent multiple madhahib including Hanafi, Shafi'i, Maliki, and Hanbali, ensuring you receive guidance aligned with your practice.
                        </p>
                    </Card>
                </div>
            </div>

            {/* Booking Modal */}
            {showBooking && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setShowBooking(false)}></div>
                    <Card className="w-full max-w-xl p-10 bg-white dark:bg-slate-900 border-0 shadow-2xl rounded-[3rem] relative z-20 animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Request Consultation</h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">Booking with {selectedScholar.full_name}</p>
                            </div>
                            <button onClick={() => setShowBooking(false)} className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-xl font-light">×</button>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest ml-2">Topic of Discussion</label>
                                <input
                                    type="text"
                                    value={bookingData.topic}
                                    onChange={e => setBookingData({ ...bookingData, topic: e.target.value })}
                                    placeholder="e.g., Zakat on crypto-assets"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest ml-2">Scheduled Date & Time</label>
                                    <input
                                        type="datetime-local"
                                        value={bookingData.scheduled_at}
                                        onChange={e => setBookingData({ ...bookingData, scheduled_at: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest ml-2">Duration</label>
                                    <div className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl font-bold">30 Minutes</div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest ml-2">Additional Notes (Private)</label>
                                <textarea
                                    rows="3"
                                    value={bookingData.notes}
                                    onChange={e => setBookingData({ ...bookingData, notes: e.target.value })}
                                    placeholder="Provide context for the scholar..."
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-500 font-medium resize-none"
                                ></textarea>
                            </div>

                            <div className="pt-4">
                                <button
                                    onClick={handleBookSession}
                                    className="w-full bg-brand-600 hover:bg-brand-700 text-white py-5 rounded-2xl font-bold transition-all shadow-xl shadow-brand-600/20 active:scale-[0.98]"
                                >
                                    Confirm & Pay ${selectedScholar.hourly_rate / 2}
                                </button>
                                <p className="text-[10px] text-center text-slate-500 font-medium mt-4">
                                    The scholar will review your request and confirm. Payment is held in escrow until completion.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    )
}
