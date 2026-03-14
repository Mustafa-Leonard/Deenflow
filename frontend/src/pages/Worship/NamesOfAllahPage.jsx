import React, { useState, useEffect } from 'react';
import api from '../../api';

export default function NamesOfAllahPage() {
    const [names, setNames] = useState([]);
    const [loading, setLoading] = useState(true);

    const [favorites, setFavorites] = useState(new Set());

    useEffect(() => {
        fetchNames();
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const res = await api.get('/worship/favorites/');
            setFavorites(new Set(res.data.filter(f => f.item_type === 'asmaul_husna').map(f => f.item_id)));
        } catch (err) {
            console.error(err);
        }
    };

    const fetchNames = async () => {
        setLoading(true);
        try {
            const res = await api.get('/worship/asmaul-husna/');
            setNames(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = async (id) => {
        try {
            await api.post('/worship/favorites/toggle/', { item_type: 'asmaul_husna', item_id: id });
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

    if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Beholding the Divine Names...</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-8 p-4 pb-20">
            <header className="text-center space-y-4">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Al-Asma-ul-Husna</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto uppercase tracking-widest text-sm py-2 px-6 bg-brand-50 dark:bg-brand-900/10 rounded-full w-fit">The 99 Beautiful Names of Allah</p>
                <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed italic">"And to Allah belong the most beautiful names, so invoke Him by them." (7:180)</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {names.map((name, index) => (
                    <div key={name.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 -mr-1 -mt-1 opacity-10 group-hover:opacity-100 transition-opacity">
                            <span className="text-4xl font-bold text-slate-100 dark:text-slate-800">{index + 1}</span>
                        </div>
                        <div className="space-y-6 relative z-10 flex flex-col items-center">
                            <div className="flex justify-between w-full items-start">
                                <button
                                    onClick={() => toggleFavorite(name.id)}
                                    className={`p-2 rounded-xl transition-all border ${favorites.has(name.id)
                                        ? 'bg-red-50 border-red-100 text-red-500'
                                        : 'bg-slate-50 border-slate-100 text-slate-300 hover:text-red-400'
                                        }`}
                                >
                                    <svg className="w-5 h-5" fill={favorites.has(name.id) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </button>
                                <div className="w-20 h-20 rounded-full bg-brand-50 dark:bg-brand-900/10 flex items-center justify-center text-3xl font-bold text-brand-600 dark:text-brand-400 border border-brand-100 dark:border-brand-800 transition-transform group-hover:scale-110 shadow-inner">
                                    {name.transliteration.charAt(0).toUpperCase()}
                                </div>
                                <div className="w-9" /> {/* Spacer */}
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-4xl font-arabic text-slate-900 dark:text-white leading-loose" dir="rtl">{name.name_arabic}</h3>
                                <div className="text-xl font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">{name.transliteration}</div>
                                <div className="text-slate-500 dark:text-slate-400 font-bold italic py-1 px-4 bg-slate-50 dark:bg-slate-800 rounded-full text-sm inline-block">{name.meaning}</div>
                            </div>
                            <div className="border-t border-slate-100 dark:border-slate-800 w-full pt-4">
                                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed text-center group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors uppercase font-bold tracking-tight px-4">{name.explanation || 'Infinite Divine Perfection'}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {names.length === 0 && (
                <div className="p-16 text-center bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500 font-medium">No initial names loaded. Seed data to behold the list.</div>
            )}
        </div>
    );
}
