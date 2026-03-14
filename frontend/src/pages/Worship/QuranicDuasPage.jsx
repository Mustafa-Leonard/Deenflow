import React, { useState, useEffect } from 'react';
import api from '../../api';

export default function QuranicDuasPage() {
    const [duas, setDuas] = useState([]);
    const [loading, setLoading] = useState(true);

    const [favorites, setFavorites] = useState(new Set());

    useEffect(() => {
        fetchDuas();
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const res = await api.get('/favorites/');
            setFavorites(new Set(res.data.filter(f => f.item_type === 'dua').map(f => f.item_id)));
        } catch (err) {
            console.error(err);
        }
    };

    const fetchDuas = async () => {
        setLoading(true);
        try {
            const res = await api.get('/duas/?is_quranic=true');
            setDuas(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = async (id) => {
        try {
            await api.post('/favorites/toggle/', { item_type: 'dua', item_id: id });
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

    if (loading) return <div className="p-8 text-center text-slate-500">Retrieving Qur'anic treasures...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 p-4 pb-20">
            <header className="text-center space-y-4">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Qur'anic Duas</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Timeless prayers from the Divine Revelation</p>
                <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full mt-6"></div>
            </header>

            <div className="grid gap-8">
                {duas.map((dua) => (
                    <div key={dua.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm group hover:shadow-md transition-all">
                        <div className="relative z-10 space-y-6">
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => toggleFavorite(dua.id)}
                                        className={`p-2.5 rounded-xl border transition-all ${favorites.has(dua.id)
                                            ? 'bg-red-50 border-red-100 text-red-500'
                                            : 'bg-slate-50 border-slate-100 text-slate-300 hover:text-red-400'
                                            }`}
                                    >
                                        <svg className="w-5 h-5" fill={favorites.has(dua.id) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </button>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors uppercase tracking-tight">{dua.title}</h3>
                                        <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 rounded-full tracking-widest mt-2 block w-fit">QURAN {dua.verse_reference}</span>
                                    </div>
                                </div>
                                <span className="text-3xl opacity-20 group-hover:opacity-100 transition-opacity rotate-12 group-hover:rotate-0">📖</span>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/20 p-8 rounded-3xl space-y-4 border border-slate-100 dark:border-slate-800">
                                <p className="text-3xl md:text-5xl font-arabic text-slate-900 dark:text-white leading-loose text-right" dir="rtl">{dua.arabic_text || "Refer to Ayah " + dua.verse_reference}</p>
                                <div className="border-t border-slate-200 dark:border-slate-700 pt-6 mt-6">
                                    <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic text-lg line-clamp-4 group-hover:line-clamp-none transition-all duration-500">{dua.translation || 'The translation of the Divine words'}</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/10 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{dua.category}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
