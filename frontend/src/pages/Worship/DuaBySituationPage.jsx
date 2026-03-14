import React, { useState, useEffect } from 'react';
import api from '../../api';

export default function DuaBySituationPage() {
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [duas, setDuas] = useState([]);
    const [loading, setLoading] = useState(true);

    const [favorites, setFavorites] = useState(new Set());

    useEffect(() => {
        fetchInitialData();
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

    const fetchInitialData = async () => {
        try {
            const res = await api.get('/worship/categories/?type=dua');
            setCategories(res.data);
            if (res.data.length > 0) setActiveCategory(res.data[0]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeCategory) fetchDuas();
    }, [activeCategory]);

    const fetchDuas = async () => {
        try {
            const res = await api.get(`/duas/?category=${activeCategory.name}`);
            setDuas(res.data);
        } catch (err) {
            console.error(err);
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

    if (loading) return <div className="p-8 text-center text-slate-500">Loading situations...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 p-4 pb-20">
            <header className="text-center space-y-4">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dua By Situation</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Find the right supplication for your current needs</p>

                <div className="flex flex-wrap justify-center gap-2 pt-4">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2 rounded-2xl font-bold transition-all text-sm ${activeCategory?.id === cat.id
                                ? 'bg-brand-600 text-white shadow-lg'
                                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </header>

            <div className="grid gap-6">
                {duas.map((dua) => (
                    <div key={dua.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm group hover:shadow-md transition-all">
                        <div className="space-y-6">
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
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors uppercase tracking-tight">{dua.title}</h3>
                                </div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{dua.reference || 'Authentic Source'}</span>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl space-y-4 border border-slate-100 dark:border-slate-800">
                                <p className="text-3xl md:text-4xl font-arabic text-slate-900 dark:text-white leading-loose text-right" dir="rtl">{dua.arabic_text}</p>
                                {dua.translation && (
                                    <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
                                        <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic">{dua.translation}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {duas.length === 0 && (
                    <div className="p-16 text-center bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-500 italic">
                        Explore other categories for supplications.
                    </div>
                )}
            </div>
        </div>
    );
}
