import React, { useState, useEffect, useRef } from 'react';
import api from '../../api';

export default function QuranPlayerPage() {
    const [reciters, setReciters] = useState([]);
    const [selectedReciter, setSelectedReciter] = useState(null);
    const [surah, setSurah] = useState(1);
    const [ayah, setAyah] = useState(1);
    const [audioUrl, setAudioUrl] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [loading, setLoading] = useState(true);
    const audioRef = useRef(null);

    useEffect(() => {
        fetchReciters();
    }, []);

    const fetchReciters = async () => {
        try {
            const res = await api.get('/worship/quran/reciters/');
            setReciters(res.data);
            if (res.data.length > 0) setSelectedReciter(res.data[0]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAudio = async () => {
        if (!selectedReciter) return;
        try {
            const res = await api.get(`/worship/quran/audio/?surah=${surah}&ayah=${ayah}&reciter=${selectedReciter.id}`);
            setAudioUrl(res.data.audio_url);
            setIsPlaying(true);
        } catch (err) {
            console.error(err);
        }
    };

    const togglePlay = () => {
        if (!audioUrl) {
            fetchAudio();
            return;
        }
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading Quran Player...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 p-4">
            <header className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Quran Audio</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Listen to the Divine message in beautiful voices</p>
            </header>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Select Reciter</label>
                        <div className="grid grid-cols-1 gap-3">
                            {reciters.map((r) => (
                                <button
                                    key={r.id}
                                    onClick={() => setSelectedReciter(r)}
                                    className={`p-4 rounded-2xl border transition-all text-left group ${selectedReciter?.id === r.id ? 'border-brand-600 bg-brand-50 dark:bg-brand-900/10' : 'border-slate-200 dark:border-slate-800 hover:border-brand-200 dark:hover:border-brand-900/30'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-transform group-hover:scale-110 ${selectedReciter?.id === r.id ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                            🎙️
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 dark:text-white">{r.name}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{r.style}</div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Selection</label>
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400">Surah Number</label>
                                    <input
                                        type="number"
                                        min="1" max="114"
                                        value={surah} onChange={(e) => setSurah(e.target.value)}
                                        className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400">Ayah Number</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={ayah} onChange={(e) => setAyah(e.target.value)}
                                        className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white font-bold"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col items-center justify-center pt-8 space-y-6">
                                <button
                                    onClick={togglePlay}
                                    className="w-24 h-24 bg-brand-600 text-white rounded-full flex items-center justify-center text-4xl shadow-xl shadow-brand-900/30 hover:bg-brand-700 transition-all hover:scale-105 active:scale-95"
                                >
                                    {isPlaying ? (
                                        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-12 h-12 ml-2" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7L8 5z" />
                                        </svg>
                                    )}
                                </button>
                                <div className="text-sm font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
                                    Now Playing: Surah {surah}, Ayah {ayah}
                                </div>
                                {audioUrl && (
                                    <audio
                                        ref={audioRef}
                                        src={audioUrl}
                                        autoPlay
                                        onEnded={() => setIsPlaying(false)}
                                        className="hidden"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
