import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../api'
import AyahCard from '../../components/Quran/AyahCard'
import AudioPlayerBar from '../../components/Quran/AudioPlayerBar'

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
            console.log("Fetching Surah metadata...")
            const [sResp, tResp, rResp] = await Promise.all([
                api.get('/quran/surahs/').catch(err => { console.error("Surah list fetch failed", err); return { data: [] }; }),
                api.get('/quran/translations/').catch(err => { console.error("Translations failed", err); return { data: [] }; }),
                api.get('/quran/recitations/').catch(err => { console.error("Recitations failed", err); return { data: [] }; })
            ])

            const list = Array.isArray(sResp.data) ? sResp.data : []
            const currentSurah = list.find(s => s.number === parseInt(id))

            if (currentSurah) {
                setSurah(currentSurah)
            } else {
                console.warn(`Surah ${id} not found in list`)
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
                // Delete bookmark logic if needed
                alert("Already bookmarked")
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

    if (loading || !surah) return <div className="p-20 text-center">Loading Surah...</div>

    return (
        <div className="pb-32 animate-in fade-in duration-700">
            {/* surah header */}
            <div className="mb-12 relative overflow-hidden rounded-[3rem] p-12 text-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#grad)" />
                        <defs>
                            <pattern id="pattern" width="10" height="10" patternUnits="userSpaceOnUse">
                                <circle cx="2" cy="2" r="1" fill="white" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#pattern)" />
                    </svg>
                </div>

                <div className="relative z-10">
                    <div className="text-[10px] uppercase tracking-[0.4em] font-bold text-brand-400 mb-4">
                        Surah {surah.number}
                    </div>
                    <h1 className="text-5xl font-display font-bold mb-4 tracking-tight">
                        {surah.name_english}
                    </h1>
                    <div className="text-4xl font-arabic opacity-90 mb-6" dir="rtl">
                        {surah.name_arabic}
                    </div>
                    <div className="flex items-center justify-center gap-6 text-sm text-slate-400 font-medium">
                        <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                            {surah.revelation_type}
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                            {surah.ayah_count} Ayahs
                        </span>
                    </div>
                </div>
            </div>

            {/* Bismillah */}
            {surah.number !== 1 && surah.number !== 9 && (
                <div className="text-center py-12 text-4xl font-arabic text-slate-800 dark:text-white/80" dir="rtl">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </div>
            )}

            {/* Ayahs */}
            <div className="max-w-4xl mx-auto space-y-2 bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-soft border border-slate-100 dark:border-slate-800">
                {ayahs.map(ayah => (
                    <AyahCard
                        key={ayah.id}
                        ayah={ayah}
                        isPlaying={activeAyah?.id === ayah.id}
                        onPlay={handlePlayAyah}
                        isBookmarked={bookmarks.includes(ayah.id)}
                        onBookmark={toggleBookmark}
                    />
                ))}
            </div>

            {/* Sticky Audio Player */}
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
