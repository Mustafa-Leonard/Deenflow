import React, { memo, useState } from 'react'
import api from '../../api'
import { 
  Bookmark, 
  PenLine, 
  Play, 
  Pause, 
  Save, 
  X,
  Sparkles,
  Share2
} from 'lucide-react'

const AyahCard = memo(({ ayah, isPlaying, onPlay, isBookmarked, onBookmark }) => {
    const [showReflection, setShowReflection] = useState(false)
    const [reflection, setReflection] = useState('')
    const [isSaving, setIsSaving] = useState(false)

    const handleSaveReflection = async () => {
        setIsSaving(true)
        try {
            await api.post('/quran/reflections/', { ayah: ayah.id, text: reflection })
            setShowReflection(false)
            setReflection('')
            // Show a nice notification in a real app
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
            className={`deen-card group transition-all duration-500 overflow-hidden ${isPlaying ? 'border-brand-500 shadow-elevated bg-brand-50/10' : 'hover:border-slate-200'}`}
        >
            {/* Play Indicator / Highlight */}
            {isPlaying && (
                <div className="absolute top-0 left-0 w-1 h-full bg-brand-500 animate-pulse"></div>
            )}

            <div className="p-6 md:p-8">
                {/* Ayah Actions & Number */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-sm transition-all duration-300 ${isPlaying ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-600'}`}>
                            {ayah.ayah_number}
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <AyahActionButton 
                            onClick={() => onPlay(ayah)}
                            active={isPlaying}
                            icon={isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 translate-x-0.5" />}
                            tooltip="Listen"
                            brandPrimary={isPlaying}
                        />
                        <AyahActionButton 
                            onClick={() => setShowReflection(!showReflection)}
                            active={showReflection}
                            icon={<PenLine className="w-4 h-4" />}
                            tooltip="Reflect"
                        />
                        <AyahActionButton 
                            onClick={() => onBookmark(ayah.id)}
                            active={isBookmarked}
                            icon={<Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />}
                            tooltip="Bookmark"
                        />
                         <AyahActionButton 
                            onClick={() => {}} 
                            icon={<Share2 className="w-4 h-4" />}
                            tooltip="Share"
                        />
                    </div>
                </div>

                {/* Text Content */}
                <div className="space-y-8">
                    <div
                        className="text-right font-arabic text-3xl md:text-5xl leading-[2] text-slate-900 dark:text-white transition-all group-hover:text-brand-900 dark:group-hover:text-brand-50"
                        dir="rtl"
                    >
                        {ayah.text_arabic}
                    </div>

                    <div className="space-y-6 pt-4">
                      {ayah.translations && ayah.translations.map(t => (
                          <div key={t.id} className="relative pl-6">
                              <div className="absolute left-0 top-0 w-0.5 h-full bg-slate-100 dark:bg-slate-800 group-hover:bg-brand-100 dark:group-hover:bg-brand-900/30 transition-colors"></div>
                              <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-slate-400 mb-1.5 opacity-60">
                                  {t.source_name}
                              </div>
                              <div className="text-slate-700 dark:text-slate-300 text-lg md:text-xl leading-relaxed font-serif">
                                  {t.text}
                              </div>
                          </div>
                      ))}
                    </div>
                </div>

                {/* Reflection UI */}
                {showReflection && (
                    <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-brand-600 uppercase tracking-widest mb-4">
                          <Sparkles className="w-3 h-3" />
                          <span>Spiritual Reflection</span>
                        </div>
                        <div className="relative">
                          <textarea
                              value={reflection}
                              onChange={(e) => setReflection(e.target.value)}
                              placeholder="Write your heart's reflection on this ayah..."
                              className="w-full p-6 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] text-base focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all dark:text-white min-h-[140px] resize-none placeholder:text-slate-300"
                          />
                        </div>
                        <div className="flex justify-end mt-4 gap-3">
                            <button
                                onClick={() => setShowReflection(false)}
                                className="px-6 py-2 text-xs font-bold text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all uppercase tracking-widest"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveReflection}
                                disabled={isSaving || !reflection.trim()}
                                className="px-8 py-3 bg-brand-600 text-white rounded-2xl text-xs font-bold shadow-xl shadow-brand-500/30 hover:bg-brand-700 disabled:opacity-50 transition-all flex items-center gap-2 active:scale-95"
                            >
                                {isSaving ? (
                                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : <Save className="w-4 h-4" />}
                                <span>Save Reflection</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
})

function AyahActionButton({ onClick, active, icon, tooltip, brandPrimary }) {
  return (
    <button
      onClick={onClick}
      className={`p-2.5 rounded-xl transition-all duration-300 relative group/btn ${
        brandPrimary 
          ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20' 
          : active 
            ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/20' 
            : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-brand-600'
      }`}
      title={tooltip}
    >
      {icon}
      
      {/* Tiny Status Indicator */}
      {active && !brandPrimary && (
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-brand-500 rounded-full border-2 border-white dark:border-slate-900"></span>
      )}
    </button>
  )
}

AyahCard.displayName = 'AyahCard'
export default AyahCard
