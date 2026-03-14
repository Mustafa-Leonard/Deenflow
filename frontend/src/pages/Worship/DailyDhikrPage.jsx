import React, { useState, useEffect } from 'react';
import api from '../../api';

export default function DailyDhikrPage() {
    const [dhikrs, setDhikrs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [counts, setCounts] = useState({});
    const [activeTab, setActiveTab] = useState('Morning');

    const tabs = ['Morning', 'Evening', 'After Salah', 'Istighfar', 'Tasbih'];

    const [favorites, setFavorites] = useState(new Set());

    useEffect(() => {
        fetchDhikr();
        fetchFavorites();
    }, [activeTab]);

    const fetchFavorites = async () => {
        try {
            const res = await api.get('/worship/favorites/');
            setFavorites(new Set(res.data.filter(f => f.item_type === 'dhikr').map(f => f.item_id)));
        } catch (err) {
            console.error(err);
        }
    };

    const fetchDhikr = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/worship/dhikr/?category=${activeTab}`);
            setDhikrs(res.data);
            const initialCounts = { ...counts };
            res.data.forEach(d => {
                if (initialCounts[d.id] === undefined) initialCounts[d.id] = 0;
            });
            setCounts(initialCounts);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = async (id) => {
        try {
            await api.post('/worship/favorites/toggle/', { item_type: 'dhikr', item_id: id });
            setFavorites(prev => {
                const next = new Set(prev);
                if (next.has(id)) next.delete(id);
                else next.add(id);
                return next;
            });
        } catch (err) {
            console.error(err);
        }
    };

    const incrementCount = async (id, limit) => {
        setCounts(prev => ({
            ...prev,
            [id]: Math.min((prev[id] || 0) + 1, limit)
        }));

        // Log to backend
        try {
            await api.post('/worship/dhikr/log/', { dhikr_id: id, count: 1 });
        } catch (err) {
            console.error('Failed to log dhikr:', err);
        }
    };

    const resetCount = (id) => {
        setCounts(prev => ({
            ...prev,
            [id]: 0
        }));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 p-4 pb-20">
            <header className="text-center space-y-4">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Daily Dhikr</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Keep your tongue moist with the remembrance of Allah</p>

                <div className="flex flex-wrap justify-center gap-2 pt-4">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2.5 rounded-2xl font-bold transition-all ${activeTab === tab
                                ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/20'
                                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-brand-200'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </header>

            {loading ? (
                <div className="p-12 text-center text-slate-500 font-medium">Loading {activeTab} Dhikr...</div>
            ) : dhikrs.length === 0 ? (
                <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                    <p className="text-slate-500 font-medium">No dhikr items found for "{activeTab}".</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {dhikrs.map((dhikr) => (
                        <div key={dhikr.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow group">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <button
                                            onClick={() => toggleFavorite(dhikr.id)}
                                            className={`p-2 rounded-xl transition-all border ${favorites.has(dhikr.id)
                                                ? 'bg-red-50 border-red-100 text-red-500'
                                                : 'bg-slate-50 border-slate-100 text-slate-300 hover:text-red-400'
                                                }`}
                                        >
                                            <svg className="w-5 h-5" fill={favorites.has(dhikr.id) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                        </button>
                                        <div className="text-right flex-1">
                                            <p className="text-3xl md:text-4xl font-arabic text-slate-900 dark:text-white leading-loose" dir="rtl">{dhikr.arabic_text}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-slate-500 dark:text-slate-400 italic font-medium leading-relaxed">{dhikr.transliteration}</p>
                                        <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{dhikr.translation}</p>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                        <span>Source: {dhikr.source_reference || 'Authentic'}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl min-w-[180px] border border-slate-100 dark:border-slate-800">
                                    <div className="relative w-28 h-28 flex items-center justify-center">
                                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                                            <circle
                                                cx="56" cy="56" r="48"
                                                className="fill-none stroke-slate-200 dark:stroke-slate-700 stroke-[8]"
                                            />
                                            <circle
                                                cx="56" cy="56" r="48"
                                                className="fill-none stroke-brand-600 stroke-[8] transition-all duration-300"
                                                style={{
                                                    strokeDasharray: '301.6',
                                                    strokeDashoffset: 301.6 - (301.6 * (counts[dhikr.id] || 0)) / dhikr.repeat_default
                                                }}
                                            />
                                        </svg>
                                        <div className="flex flex-col items-center">
                                            <span className="text-3xl font-bold text-slate-900 dark:text-white">
                                                {counts[dhikr.id] || 0}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">of {dhikr.repeat_default}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 w-full">
                                        <button
                                            onClick={() => incrementCount(dhikr.id, dhikr.repeat_default)}
                                            className="flex-1 py-3 bg-brand-600 text-white rounded-2xl font-bold transition-all hover:bg-brand-700 active:scale-95 shadow-lg shadow-brand-900/10"
                                        >
                                            Tap
                                        </button>
                                        <button
                                            onClick={() => resetCount(dhikr.id)}
                                            className="p-3 bg-white dark:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-2xl border border-slate-200 dark:border-slate-600 hover:border-brand-300 transition-all"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
