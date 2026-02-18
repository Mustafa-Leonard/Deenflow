import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../api'
import AyahCard from '../../components/Quran/AyahCard'
import AudioPlayerBar from '../../components/Quran/AudioPlayerBar'

export default function JuzPage() {
    const { number } = useParams()
    const navigate = useNavigate()
    const [ayahs, setAyahs] = useState([])
    const [loading, setLoading] = useState(true)
    const [bookmarks, setBookmarks] = useState([])
    const [activeAyah, setActiveAyah] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [reciter, setReciter] = useState(null)

    useEffect(() => {
        fetchData()
    }, [number])

    const fetchData = async () => {
        setLoading(true)
        try {
            console.log(`Fetching Juz ${number} data...`)
            const [aResp, rResp, bResp] = await Promise.all([
                api.get(`/quran/juz/${number}/`).catch(err => { console.error("Juz fetch failed", err); return { data: { ayahs: [] } }; }),
                api.get('/quran/recitations/').catch(err => { console.error("Recitations failed", err); return { data: [] }; }),
                api.get('/quran/bookmarks/').catch(err => { console.error("Bookmarks failed", err); return { data: [] }; })
            ])

            if (aResp.data && aResp.data.ayahs) {
                setAyahs(aResp.data.ayahs)
            } else {
                console.warn("No ayahs found in Juz response")
                setAyahs([])
            }

            setReciter(rResp.data?.[0] || null)
            setBookmarks(Array.isArray(bResp.data) ? bResp.data.map(b => b.ayah) : [])
        } catch (e) {
            console.error("Critical fetch error in JuzPage:", e)
        } finally {
            setLoading(false)
        }
    }

    const handlePlayAyah = (ayah) => {
        setActiveAyah(ayah)
        setIsPlaying(true)
        document.getElementById(`ayah-${ayah.ayah_number}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }

    const toggleBookmark = async (id) => {
        try {
            if (!bookmarks.includes(id)) {
                await api.post('/quran/bookmarks/', { ayah: id })
                setBookmarks([...bookmarks, id])
            }
        } catch (e) {
            console.error(e)
        }
    }

    if (loading) return <div className="p-20 text-center animate-pulse">Loading Part {number}...</div>

    return (
        <div className="pb-32 animate-in fade-in duration-700">
            {/* Header */}
            <div className="mb-12 relative overflow-hidden rounded-[3rem] p-12 text-center bg-gradient-to-br from-indigo-900 via-indigo-800 to-brand-900 text-white shadow-2xl">
                <div className="relative z-10">
                    <div className="text-[10px] uppercase tracking-[0.4em] font-bold text-brand-400 mb-4">Qur'an Part</div>
                    <h1 className="text-5xl font-display font-bold mb-4 tracking-tight">
                        Juz <span className="text-brand-400">{number}</span>
                    </h1>
                    <p className="text-brand-100/80 text-lg">Reading through established divisions of the Holy Book.</p>
                </div>
            </div>

            {/* Navigation for Juz */}
            <div className="max-w-4xl mx-auto flex items-center justify-between mb-8 px-4">
                <button
                    onClick={() => navigate(`/app/quran/juz/${Math.max(1, parseInt(number) - 1)}`)}
                    className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand-600 transition-all"
                    disabled={parseInt(number) === 1}
                >
                    ← Previous Juz
                </button>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Part {number} of 30</div>
                <button
                    onClick={() => navigate(`/app/quran/juz/${Math.min(30, parseInt(number) + 1)}`)}
                    className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand-600 transition-all"
                    disabled={parseInt(number) === 30}
                >
                    Next Juz →
                </button>
            </div>

            <div className="max-w-4xl mx-auto space-y-2 bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-soft border border-slate-100 dark:border-slate-800">
                {ayahs.length > 0 ? ayahs.map(ayah => (
                    <AyahCard
                        key={ayah.id}
                        ayah={ayah}
                        isPlaying={activeAyah?.id === ayah.id}
                        onPlay={handlePlayAyah}
                        isBookmarked={bookmarks.includes(ayah.id)}
                        onBookmark={toggleBookmark}
                    />
                )) : (
                    <div className="p-20 text-center text-slate-400">
                        No ayahs found for this Juz in the local database.
                        <br />Please sync more surahs in the Admin panel.
                    </div>
                )}
            </div>

            {reciter && activeAyah && (
                <AudioPlayerBar
                    activeAyah={activeAyah}
                    reciter={reciter}
                    onNext={() => {
                        const idx = ayahs.findIndex(a => a.id === activeAyah?.id)
                        if (idx < ayahs.length - 1) handlePlayAyah(ayahs[idx + 1])
                        else setIsPlaying(false)
                    }}
                    onPrev={() => {
                        const idx = ayahs.findIndex(a => a.id === activeAyah?.id)
                        if (idx > 0) handlePlayAyah(ayahs[idx - 1])
                    }}
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                />
            )}
        </div>
    )
}
