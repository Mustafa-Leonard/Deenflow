import React, { useState, useEffect, useRef } from 'react'

export default function AudioPlayerBar({
    activeAyah,
    reciter,
    onNext,
    onPrev,
    isPlaying,
    setIsPlaying
}) {
    const audioRef = useRef(null)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        if (activeAyah && isPlaying) {
            const surahPadded = String(activeAyah.surah_number || activeAyah.surah).padStart(3, '0')
            const ayahPadded = String(activeAyah.ayah_number).padStart(3, '0')
            const fallbackUrl = `${reciter?.audio_base_url}/${surahPadded}${ayahPadded}.mp3`
            const url = activeAyah.audio_url || fallbackUrl

            if (audioRef.current.src !== url) {
                audioRef.current.src = url
            }
            audioRef.current.play().catch(e => console.error("Audio Play Error:", e))
        } else if (audioRef.current) {
            audioRef.current.pause()
        }
    }, [activeAyah, isPlaying, reciter])

    const handleTimeUpdate = () => {
        const p = (audioRef.current.currentTime / audioRef.current.duration) * 100
        setProgress(p || 0)
    }

    const handleEnded = () => {
        onNext()
    }

    if (!activeAyah) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 lg:left-72 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 z-[100] px-6 py-4 animate-in slide-in-from-bottom duration-500">
            <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
            />

            <div className="max-w-7xl mx-auto flex items-center gap-6">
                <div className="hidden md:flex flex-1 items-center gap-4">
                    <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-brand-500/30">
                        {activeAyah.surah_number || activeAyah.surah}:{activeAyah.ayah_number}
                    </div>
                    <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">
                            Ayah {activeAyah.ayah_number}
                        </div>
                        <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                            {reciter.reciter}
                        </div>
                    </div>
                </div>

                <div className="flex flex-[2] flex-col gap-2">
                    <div className="flex items-center justify-center gap-6">
                        <button onClick={onPrev} className="text-slate-400 hover:text-brand-600 transition-colors">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
                            </svg>
                        </button>

                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="w-12 h-12 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all"
                        >
                            {isPlaying ? (
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                            ) : (
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                            )}
                        </button>

                        <button onClick={onNext} className="text-slate-400 hover:text-brand-600 transition-colors">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
                            </svg>
                        </button>
                    </div>

                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                        <div
                            className="bg-brand-500 h-full transition-all duration-200"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                <div className="hidden lg:flex flex-1 justify-end items-center gap-4">
                    <button className="text-slate-400 hover:text-slate-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    </button>
                </div>
            </div>
        </div>
    )
}
