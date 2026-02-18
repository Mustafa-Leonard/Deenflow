import React, { useState, useEffect } from 'react'
import api from '../../../api'
import Card from '../../../components/Card'

export default function QuranAdminHome() {
    const [stats, setStats] = useState({ surahs: 0, ayahs: 0, version: '1.0.0' })
    const [isSyncing, setIsSyncing] = useState(false)
    const [syncLogs, setSyncLogs] = useState('')
    const [selectedSurah, setSelectedSurah] = useState(null)
    const [surahList, setSurahList] = useState([])
    const [ayahs, setAyahs] = useState([])
    const [loadingAyahs, setLoadingAyahs] = useState(false)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [sResp, statsResp] = await Promise.all([
                api.get('/quran/admin/surahs/'),
                api.get('/quran/admin/stats/')
            ])
            setSurahList(sResp.data)
            setStats({
                surahs: statsResp.data.surahs,
                ayahs: statsResp.data.ayahs,
                version: '1.0.0'
            })
        } catch (e) {
            console.error(e)
        }
    }

    const fetchSurahAyahs = async (surah) => {
        setSelectedSurah(surah)
        setLoadingAyahs(true)
        try {
            const resp = await api.get(`/quran/surahs/${surah.number}/ayahs/`)
            setAyahs(resp.data)
        } catch (e) {
            console.error(e)
        } finally {
            setLoadingAyahs(false)
        }
    }

    const handleSync = async () => {
        if (!window.confirm("This will overwrite existing Surah/Ayah metadata if changed and may take a while. Continue?")) return
        setIsSyncing(true)
        try {
            const resp = await api.post('/quran/admin/sync/')
            alert(resp.data.message)
            fetchData()
        } catch (e) {
            alert("Sync failed: " + (e.response?.data?.message || e.message))
        } finally {
            setIsSyncing(false)
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Qur'an Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Manage datasets, translations, and recitation sources.</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={handleSync}
                        disabled={isSyncing}
                        className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-400 text-white rounded-xl font-bold transition-all shadow-lg active:scale-95 flex items-center gap-2"
                    >
                        {isSyncing ? 'Syncing...' : '🔄 Force Sync All Data'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 rounded-2xl">
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Total Surahs</div>
                    <div className="text-3xl font-display font-bold text-slate-900 dark:text-white">{stats.surahs}</div>
                </Card>
                <Card className="p-6 bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 rounded-2xl">
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Total Ayahs</div>
                    <div className="text-3xl font-display font-bold text-slate-900 dark:text-white">{stats.ayahs}</div>
                </Card>
                <Card className="p-6 bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 rounded-2xl">
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Dataset Version</div>
                    <div className="text-3xl font-display font-bold text-brand-600">{stats.version}</div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Surah List Table */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-soft">
                    <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
                        <h3 className="font-bold text-slate-900 dark:text-white">Surah List</h3>
                        <span className="text-xs font-medium text-slate-400">Click a surah to view verses</span>
                    </div>
                    <div className="max-h-[600px] overflow-y-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 sticky top-0 z-10 border-b border-slate-100 dark:border-slate-800">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Number</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">English Name</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ayahs</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {surahList.map(s => (
                                    <tr
                                        key={s.id}
                                        onClick={() => fetchSurahAyahs(s)}
                                        className={`cursor-pointer transition-colors ${selectedSurah?.id === s.id ? 'bg-brand-50 dark:bg-brand-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                                    >
                                        <td className="px-6 py-4 text-sm font-medium text-slate-400">#{s.number}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-900 dark:text-white">{s.name_english}</div>
                                            <div className="text-xs text-slate-400">{s.name_arabic}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500 font-mono">{s.ayah_count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Verses Detail View */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-soft flex flex-col">
                    <div className="p-6 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                        {selectedSurah ? (
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">{selectedSurah.name_english}</h3>
                                    <p className="text-xs text-slate-500">{selectedSurah.ayah_count} Verses</p>
                                </div>
                                <div className="text-2xl font-arabic">{selectedSurah.name_arabic}</div>
                            </div>
                        ) : (
                            <h3 className="font-bold text-slate-400">Select a Surah to view details</h3>
                        )}
                    </div>
                    <div className="flex-1 overflow-y-auto max-h-[600px] p-6">
                        {loadingAyahs ? (
                            <div className="flex items-center justify-center h-full text-slate-400 animate-pulse">Loading verses...</div>
                        ) : selectedSurah ? (
                            <div className="space-y-6">
                                {ayahs.map(a => (
                                    <div key={a.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400 shadow-sm border border-slate-100 dark:border-slate-700">
                                                {a.ayah_number}
                                            </span>
                                            <p className="text-2xl font-arabic leading-loose text-right flex-1 ml-4" dir="rtl">
                                                {a.text_arabic}
                                            </p>
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic border-t border-slate-100 dark:border-slate-800 pt-3">
                                            {a.text_translation_en}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
                                <span className="text-6xl">📖</span>
                                <p className="font-medium">No Surah Selected</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
