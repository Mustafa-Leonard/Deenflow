import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import api from '../../api'
import { 
  Search, 
  BookOpen, 
  Sparkles, 
  History, 
  ChevronRight, 
  Library, 
  Hash,
  Compass,
  LayoutGrid,
  Zap,
  Clock
} from 'lucide-react'

export default function QuranHome() {
    const navigate = useNavigate()
    const location = useLocation()
    const [surahs, setSurahs] = useState([])
    const [juzList, setJuzList] = useState(Array.from({ length: 30 }, (_, i) => i + 1))

    // Initialize activeTab from search params
    const getInitialTab = () => {
        const params = new URLSearchParams(location.search)
        const tab = params.get('tab')
        if (tab === 'juz') return 'juz'
        return 'surahs'
    }

    const [activeTab, setActiveTab] = useState(getInitialTab())
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [recentProgress, setRecentProgress] = useState(null)

    // Sync activeTab with search params if they change
    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const tab = params.get('tab')
        if (tab === 'juz' || tab === 'surahs') {
            setActiveTab(tab)
        }
    }, [location.search])

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [sResp, pResp] = await Promise.all([
                api.get('/quran/surahs/').catch(() => ({ data: [] })),
                api.get('/quran/progress/').catch(() => ({ data: [] }))
            ])

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

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <div className="w-10 h-10 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin mb-4"></div>
                <div className="text-slate-500 font-medium text-sm">Opening the Holy Book...</div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
            {/* Hero Section */}
            <div className="relative p-12 overflow-hidden rounded-[3rem] text-white shadow-2xl mosque-hero-bg group">
                <div className="absolute inset-0 bg-brand-900/60 backdrop-blur-[2px] transition-all group-hover:bg-brand-900/50"></div>
                
                {/* Decorative Layers */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none transition-transform group-hover:scale-110"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-500/10 rounded-full -ml-20 -mb-20 blur-3xl pointer-events-none"></div>

                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-12">
                    <div className="text-center lg:text-left flex-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[10px] font-bold tracking-[0.2em] uppercase mb-6">
                            <Compass className="w-3 h-3 text-brand-300" />
                            <span>Divine Guidance</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight leading-tight">
                            The Glorious <span className="text-brand-300">Qur'an</span>
                        </h1>
                        <p className="text-brand-100 text-lg md:text-xl max-w-xl leading-relaxed italic font-serif">
                            "And We have certainly made the Qur'an easy for remembrance, so is there any who will remember?"
                        </p>
                    </div>

                    {recentProgress ? (
                        <div className="w-full lg:w-96 deen-card bg-white/10 backdrop-blur-xl border-white/20 p-8 shadow-2xl relative overflow-hidden group/card hover:bg-white/15 transition-all">
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 text-brand-300 text-[10px] font-bold uppercase tracking-widest mb-4">
                                    <Clock className="w-3 h-3" />
                                    <span>Continue Journey</span>
                                </div>
                                <div className="text-3xl font-display font-bold text-white mb-2">{recentProgress.surah_name}</div>
                                <div className="flex items-center gap-2 text-white/60 text-sm mb-8">
                                    <Hash className="w-4 h-4" />
                                    <span>Ayah {recentProgress.ayah_number}</span>
                                </div>
                                <button
                                    onClick={() => navigate(`/app/quran/surah/${recentProgress.surah}`)}
                                    className="w-full py-4 bg-white text-brand-900 rounded-2xl font-bold text-sm shadow-xl hover:bg-brand-50 transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    Resume Reading
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover/card:opacity-10 transition-opacity">
                                <BookOpen className="w-24 h-24 text-white" />
                            </div>
                        </div>
                    ) : (
                        <div className="w-full lg:w-96 deen-card bg-white/10 backdrop-blur-xl border-white/20 p-8 text-center">
                            <BookOpen className="w-12 h-12 text-brand-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">Start Your Journey</h3>
                            <p className="text-brand-100 text-sm mb-6">Explore the divine words through Surahs or Juz segments.</p>
                            <button 
                              onClick={() => navigate('/app/quran/surah/1')}
                              className="w-full py-4 bg-white text-brand-900 rounded-2xl font-bold shadow-xl hover:bg-brand-50 transition-all"
                            >
                              Begin with Al-Fatihah
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col lg:flex-row gap-8 items-center justify-between px-2">
                <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm w-full lg:w-auto">
                    <button
                        onClick={() => setActiveTab('surahs')}
                        className={`flex-1 lg:flex-none px-8 py-3 transition-all rounded-xl text-sm font-bold flex items-center justify-center gap-2 ${activeTab === 'surahs' ? 'bg-white dark:bg-slate-800 shadow-elevated text-brand-600' : 'text-slate-500 hover:text-brand-600'}`}
                    >
                        <Library className="w-4 h-4" />
                        Surahs
                    </button>
                    <button
                        onClick={() => setActiveTab('juz')}
                        className={`flex-1 lg:flex-none px-8 py-3 transition-all rounded-xl text-sm font-bold flex items-center justify-center gap-2 ${activeTab === 'juz' ? 'bg-white dark:bg-slate-800 shadow-elevated text-brand-600' : 'text-slate-500 hover:text-brand-600'}`}
                    >
                        <LayoutGrid className="w-4 h-4" />
                        Juz Segments
                    </button>
                </div>

                <div className="relative w-full lg:w-[400px]">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder={`Search ${activeTab === 'surahs' ? 'surah name or number' : 'juz part'}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full py-4 pl-12 pr-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm shadow-sm focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all dark:text-white"
                    />
                </div>
            </div>

            {/* List Components */}
            {activeTab === 'surahs' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredSurahs.map(s => (
                        <div
                            key={s.id}
                            onClick={() => navigate(`/app/quran/surah/${s.number}`)}
                            className="deen-card p-6 flex items-center gap-6 cursor-pointer hover:border-brand-300 hover:shadow-elevated transition-all duration-300 relative group"
                        >
                            <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-center font-display font-bold text-slate-400 group-hover:bg-brand-600 group-hover:text-white group-hover:border-brand-600 transition-all duration-300 flex-shrink-0 text-xl overflow-hidden relative">
                                {s.number}
                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity islamic-accent"></div>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors uppercase truncate">
                                      {s.name_english}
                                    </h4>
                                    <div className="text-2xl font-arabic text-brand-600 opacity-60 group-hover:opacity-100 transition-opacity pr-2">
                                      {s.name_arabic}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <span>{s.revelation_type}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                                    <span>{s.ayah_count} Ayahs</span>
                                </div>
                            </div>
                            
                            <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-brand-500 transition-all opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0" />
                        </div>
                    ))}
                    
                    {filteredSurahs.length === 0 && (
                        <div className="col-span-full py-32 text-center rounded-[3rem] bg-slate-50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-800">
                            <Search className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No Surahs Matching "{searchTerm}"</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {juzList.filter(j => j.toString().includes(searchTerm)).map(j => (
                        <div
                            key={j}
                            onClick={() => navigate(`/app/quran/juz/${j}`)}
                            className="deen-card p-8 text-center cursor-pointer hover:border-brand-500 hover:-translate-y-2 transition-all relative overflow-hidden group"
                        >
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-brand-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                            <div className="text-[10px] font-bold text-slate-400 mb-4 uppercase tracking-[0.2em]">Part</div>
                            <div className="text-5xl font-display font-bold text-brand-600 group-hover:scale-110 transition-transform duration-500">{j}</div>
                            <div className="mt-4 text-[10px] font-bold text-brand-500/0 group-hover:text-brand-500 transition-colors">READ NOW</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
