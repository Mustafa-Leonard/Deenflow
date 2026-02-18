import React, { memo, useState } from 'react'
import api from '../../api'

const AyahCard = memo(({ ayah, isPlaying, onPlay, isBookmarked, onBookmark }) => {
    const [showReflection, setShowReflection] = useState(false)
    const [reflection, setReflection] = useState('')
    const [isSaving, setIsSaving] = useState(false)

    const handleSaveReflection = async () => {
        setIsSaving(true)
        try {
            await api.post('/quran/reflections/', { ayah: ayah.id, text: reflection })
            setShowReflection(false)
            alert("Reflection saved.")
        } catch (e) {
            console.error(e)
            alert("Failed to save reflection.")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div
            id={`ayah-${ayah.ayah_number}`}
            className={`p-6 border-b border-slate-100 dark:border-slate-800 transition-all duration-300 ${isPlaying ? 'bg-brand-50/50 dark:bg-brand-900/10 ring-1 ring-brand-200 dark:ring-brand-800/50' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
        >
            <div className="flex items-start justify-between mb-6 gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400 font-mono">
                        {ayah.ayah_number}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowReflection(!showReflection)}
                        className={`p-2 rounded-lg transition-all ${showReflection ? 'text-brand-600 bg-brand-50' : 'text-slate-400 hover:bg-slate-100'}`}
                        title="Reflect"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => onBookmark(ayah.id)}
                        className={`p-2 rounded-lg transition-all ${isBookmarked ? 'text-brand-600 bg-brand-50' : 'text-slate-400 hover:bg-slate-100'}`}
                        title="Bookmark"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isBookmarked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => onPlay(ayah)}
                        className={`p-2 rounded-lg transition-all ${isPlaying ? 'text-white bg-brand-600 shadow-lg' : 'text-slate-400 hover:bg-slate-100'}`}
                        title="Listen"
                    >
                        {isPlaying ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                <div
                    className="text-right font-arabic text-4xl leading-[2] text-slate-900 dark:text-white"
                    dir="rtl"
                >
                    {ayah.text_arabic}
                </div>

                {ayah.translations && ayah.translations.map(t => (
                    <div key={t.id} className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed font-inter">
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 block mb-1">
                            {t.source_name}
                        </span>
                        {t.text}
                    </div>
                ))}
            </div>

            {showReflection && (
                <div className="mt-8 animate-in slide-in-from-top-4 duration-300">
                    <textarea
                        value={reflection}
                        onChange={(e) => setReflection(e.target.value)}
                        placeholder="Write your reflection on this ayah..."
                        className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all dark:text-white"
                        rows={3}
                    ></textarea>
                    <div className="flex justify-end mt-3 gap-2">
                        <button
                            onClick={() => setShowReflection(false)}
                            className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveReflection}
                            disabled={isSaving || !reflection.trim()}
                            className="px-4 py-2 bg-brand-600 text-white rounded-lg text-xs font-bold shadow-lg shadow-brand-500/20 hover:bg-brand-700 disabled:opacity-50 transition-all"
                        >
                            {isSaving ? 'Saving...' : 'Save Reflection'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
})

export default AyahCard
