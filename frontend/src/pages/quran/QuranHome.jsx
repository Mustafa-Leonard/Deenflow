import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api'
import Card from '../../components/Card'

export default function QuranHome() {
    const [surahs, setSurahs] = useState([])
    const [juzList, setJuzList] = useState(Array.from({ length: 30 }, (_, i) => i + 1))
    const [activeTab, setActiveTab] = useState('surahs') // 'surahs' or 'juz'
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [recentProgress, setRecentProgress] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            console.log("Fetching Surahs and Progress...")
            const [sResp, pResp] = await Promise.all([
                api.get('/quran/surahs/').catch(err => { console.error("Surah fetch failed", err); return { data: [] }; }),
                api.get('/quran/progress/').catch(err => { console.error("Progress fetch failed", err); return { data: [] }; })
            ])

            console.log("Surahs received:", sResp.data?.length)
            setSurahs(Array.isArray(sResp.data) ? sResp.data : [])
            if (pResp.data && pResp.data.length > 0) setRecentProgress(pResp.data[0])
        } catch (e) {
            console.error("Critical fetch error in QuranHome:", e)
        } finally {
            setLoading(false)
        }
    }

    const filteredSurahs = surahs.filter(s =>
        s.name_english.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.number.toString() === searchTerm
    )

    if (loading) return <div className="p-20 text-center animate-pulse">Opening the Holy Book...</div>

    return (
        <div className="space-y-12 pb-20 animate-in fade-in duration-700">
            {/* Hero Section */}
            <div className="relative p-12 bg-gradient-to-br from-brand-700 to-indigo-800 rounded-[3rem] text-white overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-center md:text-left">
                        <h1 className="text-5xl font-display font-bold mb-4 tracking-tight">The Glorious Qur'an</h1>
                        <p className="text-brand-100 text-lg max-w-md leading-relaxed">
                            "And We have certainly made the Qur'an easy for remembrance, so is there any who will remember?"
                        </p>
                    </div>
                    {recentProgress && (
                        <Card className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-[2rem] text-white w-full md:w-auto">
                            <div className="text-[10px] uppercase font-bold tracking-widest opacity-60 mb-2">Continue Reading</div>
                            <div className="text-2xl font-bold mb-1">{recentProgress.surah_name}</div>
                            <div className="text-sm opacity-80 mb-4">Ayah {recentProgress.ayah_number}</div>
                            <button
                                onClick={() => navigate(`/app/quran/surah/${recentProgress.surah}`)}
                                className="w-full py-2 bg-white text-brand-700 rounded-xl font-bold text-sm shadow-lg hover:bg-brand-50 transition-all active:scale-95"
                            >
                                Resume Now
                            </button>
                        </Card>
                    )}
                </div>
            </div>

            {/* Selection Tabs / Search */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <button
                        onClick={() => setActiveTab('surahs')}
                        className={`px-6 py-2 transition-all rounded-xl text-sm font-bold ${activeTab === 'surahs' ? 'bg-white dark:bg-slate-800 shadow-sm text-brand-600' : 'text-slate-500 hover:text-brand-600'}`}
                    >
                        Surahs
                    </button>
                    <button
                        onClick={() => setActiveTab('juz')}
                        className={`px-6 py-2 transition-all rounded-xl text-sm font-bold ${activeTab === 'juz' ? 'bg-white dark:bg-slate-800 shadow-sm text-brand-600' : 'text-slate-500 hover:text-brand-600'}`}
                    >
                        Juz
                    </button>
                </div>

                <div className="relative w-full md:w-96">
                    <input
                        type="text"
                        placeholder={`Search ${activeTab === 'surahs' ? 'surah name or number' : 'juz number'}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-6 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all dark:text-white"
                    />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400">🔍</div>
                </div>
            </div>

            {/* Content Listing */}
            {activeTab === 'surahs' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSurahs.map(s => (
                        <Card
                            key={s.id}
                            onClick={() => navigate(`/app/quran/surah/${s.number}`)}
                            className="group p-6 cursor-pointer hover:border-brand-500 hover:shadow-xl transition-all duration-300 rounded-[2rem] border-slate-100 dark:border-slate-800"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center font-bold text-slate-400 group-hover:bg-brand-600 group-hover:text-white transition-all font-mono">
                                    {s.number}
                                </div>
                                <div className="text-2xl font-arabic text-brand-600">{s.name_arabic}</div>
                            </div>
                            <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors uppercase tracking-tight">{s.name_english}</h4>
                            <p className="text-xs text-slate-400 font-bold tracking-widest uppercase mt-1">
                                {s.revelation_type} • {s.ayah_count} Ayahs
                            </p>
                        </Card>
                    ))}
                    {filteredSurahs.length === 0 && (
                        <div className="col-span-full py-20 text-center text-slate-400 font-medium">
                            No surahs found matching "{searchTerm}"
                        </div>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {juzList.filter(j => j.toString().includes(searchTerm)).map(j => (
                        <Card
                            key={j}
                            onClick={() => navigate(`/app/quran/juz/${j}`)}
                            className="p-8 text-center cursor-pointer hover:border-brand-500 hover:scale-105 transition-all rounded-2xl"
                        >
                            <div className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-widest">Part</div>
                            <div className="text-3xl font-display font-bold text-brand-600">{j}</div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
