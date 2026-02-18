import React, { useState, useEffect } from 'react'
import api from '../../../api'
import Card from '../../../components/Card'

export default function RecitationsAdmin() {
    const [sources, setSources] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchSources()
    }, [])

    const fetchSources = async () => {
        try {
            const resp = await api.get('/quran/admin/recitations/')
            setSources(resp.data)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const toggleStatus = async (id, currentStatus) => {
        try {
            await api.patch(`/quran/admin/recitations/${id}/`, { is_active: !currentStatus })
            fetchSources()
        } catch (e) {
            alert("Failed to update status")
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Recitation Sources</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Manage audio reciters and their stream URLs.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sources.map(s => (
                    <Card key={s.id} className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                                🎙️
                            </div>
                            <button
                                onClick={() => toggleStatus(s.id, s.is_active)}
                                className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${s.is_active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}
                            >
                                {s.is_active ? 'Active' : 'Disabled'}
                            </button>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{s.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{s.reciter}</p>
                        <div className="text-[10px] font-mono p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400 break-all mb-4">
                            {s.audio_base_url}
                        </div>
                        <div className="pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center gap-2">
                            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Type: HQ Audio Stream</div>
                        </div>
                    </Card>
                ))}

                <Card className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-brand-500 transition-all rounded-3xl">
                    <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 group-hover:text-brand-600 transition-colors shadow-sm">
                        <span className="text-2xl">+</span>
                    </div>
                    <div className="text-sm font-bold text-slate-400 group-hover:text-brand-600">Add Reciter</div>
                </Card>
            </div>
        </div>
    )
}
