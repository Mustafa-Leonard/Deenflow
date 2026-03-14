import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../api'
import AyahCard from '../../components/Quran/AyahCard'
import AudioPlayerBar from '../../components/Quran/AudioPlayerBar'
import { 
  ChevronLeft, 
  Info, 
  Settings2, 
  Share2, 
  Bookmark,
  BookOpen,
  Layout
} from 'lucide-react'

export default function SurahPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [surah, setSurah] = useState(null)
    const [ayahs, setAyahs] = useState([])
    const [loading, setLoading] = useState(true)
    const [bookmarks, setBookmarks] = useState([])

    // Audio State
    const [activeAyah, setActiveAyah] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [reciter, setReciter] = useState(null)
    const [translations, setTranslations] = useState([])

    useEffect(() => {
        fetchMetadata()
        fetchAyahs()
        fetchBookmarks()
    }, [id])

    const fetchMetadata = async () => {
        try {
            const [sResp, tResp, rResp] = await Promise.all([
                api.get('/quran/surahs/').catch(() => ({ data: [] })),
                api.get('/quran/translations/').catch(() => ({ data: [] })),
                api.get('/quran/recitations/').catch(() => ({ data: [] }))
            ])

            const list = Array.isArray(sResp.data) ? sResp.data : []
            const currentSurah = list.find(s => s.number === parseInt(id))

            if (currentSurah) {
                setSurah(currentSurah)
            }
            
            setTranslations(Array.isArray(tResp.data) ? tResp.data : [])
            setReciter(rResp.data?.[0] || null)
        } catch (e) {
            console.error("Critical metadata fetch error in SurahPage:", e)
        }
    }

    const fetchAyahs = async () => {
        setLoading(true)
        try {
            const resp = await api.get(`/quran/surahs/${id}/ayahs/`)
            setAyahs(resp.data)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const fetchBookmarks = async () => {
        try {
            const resp = await api.get('/quran/bookmarks/')
            setBookmarks(resp.data.map(b => b.ayah))
        } catch (e) {
            console.error(e)
        }
    }

    const toggleBookmark = async (ayahId) => {
        try {
            if (bookmarks.includes(ayahId)) {
                // In a real app, delete bookmark. For now just alert or keep.
                // await api.delete(`/quran/bookmarks/${ayahId}/`)
                // setBookmarks(bookmarks.filter(b => b !== ayahId))
            } else {
                await api.post('/quran/bookmarks/', { ayah: ayahId })
                setBookmarks([...bookmarks, ayahId])
            }
        } catch (e) {
            console.error(e)
        }
    }

    const handlePlayAyah = (ayah) => {
        setActiveAyah(ayah)
        setIsPlaying(true)
        saveProgress(ayah.id)

        // Scroll to ayah
        document.getElementById(`ayah-${ayah.ayah_number}`)?.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        })
    }

    const onNext = () => {
        const currentIndex = ayahs.findIndex(a => a.id === activeAyah?.id)
        if (currentIndex < ayahs.length - 1) {
            handlePlayAyah(ayahs[currentIndex + 1])
        } else {
            setIsPlaying(false)
        }
    }

    const onPrev = () => {
        const currentIndex = ayahs.findIndex(a => a.id === activeAyah?.id)
        if (currentIndex > 0) {
            handlePlayAyah(ayahs[currentIndex - 1])
        }
    }

    const saveProgress = async (ayahId) => {
        try {
            await api.post('/quran/progress/', { surah: surah.id, ayah: ayahId })
        } catch (e) {
            console.error("Save progress error:", e)
        }
    }

    if (loading || !surah) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <div className="w-10 h-10 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin mb-4"></div>
                <div className="text-slate-500 font-medium text-sm">Opening Surah {id}...</div>
            </div>
        )
    }

    return (
        <div className="pb-32 animate-in fade-in duration-1000">
            {/* Header Navigation */}
            <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between mb-4">
                <button 
                  onClick={() => navigate('/app/quran')}
                  className="flex items-center gap-2 text-slate-500 hover:text-brand-600 font-bold text-xs uppercase tracking-widest transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  All Surahs
                </button>
                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-400">
                      <Settings2 className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-400">
                      <Share2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Surah Hero Card */}
            <div className="max-w-5xl mx-auto px-6 mb-12">
                <div className="relative overflow-hidden rounded-[3rem] p-8 md:p-16 text-center text-white shadow-2xl mosque-hero-bg group">
                    <div className="absolute inset-0 bg-brand-900/70 backdrop-blur-[2px]"></div>
                    
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-500/10 rounded-full -ml-24 -mb-24 blur-3xl pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[10px] font-bold tracking-[0.3em] uppercase mb-8">
                          <Layout className="w-3 h-3 text-brand-300" />
                          <span>Surah {surah.number}</span>
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tight">
                            {surah.name_english}
                        </h1>
                        
                        <div className="text-4xl md:text-6xl font-arabic text-brand-300 mb-10 leading-relaxed" dir="rtl">
                            {surah.name_arabic}
                        </div>
                        
                        <div className="flex flex-wrap items-center justify-center gap-8 text-xs font-bold uppercase tracking-[0.2em] text-white/60">
                            <div className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-brand-400 shadow-[0_0_8px_rgba(72,192,143,0.8)]"></span>
                                {surah.revelation_type}
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-brand-400 shadow-[0_0_8px_rgba(72,192,143,0.8)]"></span>
                                {surah.ayah_count} Verses
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bismillah */}
            {surah.number !== 1 && surah.number !== 9 && (
                <div className="max-w-4xl mx-auto text-center py-20 px-6">
                    <div className="text-5xl md:text-6xl font-arabic text-slate-800 dark:text-white leading-[1.8]" dir="rtl">
                        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                    </div>
                </div>
            )}

            {/* Ayahs List */}
            <div className="max-w-4xl mx-auto px-6 space-y-6">
                {ayahs.length === 0 ? (
                  <div className="text-center py-20 text-slate-400 italic">No verses found for this Surah.</div>
                ) : (
                  ayahs.map(ayah => (
                      <AyahCard
                          key={ayah.id}
                          ayah={ayah}
                          isPlaying={activeAyah?.id === ayah.id}
                          onPlay={handlePlayAyah}
                          isBookmarked={bookmarks.includes(ayah.id)}
                          onBookmark={toggleBookmark}
                      />
                  ))
                )}
            </div>

            {/* Mobile / Sticky Bottom Audio Player Integration */}
            {reciter && (
                <AudioPlayerBar
                    activeAyah={activeAyah}
                    reciter={reciter}
                    onNext={onNext}
                    onPrev={onPrev}
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                />
            )}
        </div>
    )
}
