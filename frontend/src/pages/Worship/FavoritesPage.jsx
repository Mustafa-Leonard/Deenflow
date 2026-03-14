import React, { useState, useEffect } from 'react';
import api from '../../api';

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const res = await api.get('/worship/favorites/');
            setFavorites(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = async (type, id) => {
        try {
            await api.post('/worship/favorites/toggle/', { item_type: type, item_id: id });
            setFavorites(prev => prev.filter(f => f.item_id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading your treasures...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 p-4 pb-20">
            <header className="text-center space-y-4">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Spiritual Favorites</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Your curated collection of remembrance and supplication</p>
                <div className="w-16 h-1 bg-brand-500 mx-auto rounded-full mt-4"></div>
            </header>

            {favorites.length === 0 ? (
                <div className="p-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                    <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-5xl text-slate-300">
                        🔖
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Your sanctuary is empty</h3>
                        <p className="text-slate-500 max-w-sm mx-auto font-medium">Browse the Dhikr and Dua libraries to save items you wish to return to frequently.</p>
                    </div>
                </div>
            ) : (
                <div className="grid gap-6">
                    {favorites.map((fav) => (
                        <div key={fav.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm group hover:shadow-md transition-all relative overflow-hidden">
                            <div className="flex flex-col gap-6">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${fav.item_type === 'dhikr' ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/20' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20'
                                            }`}>
                                            {fav.item_type}
                                        </span>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white pt-2">{fav.title}</h3>
                                    </div>
                                    <button
                                        onClick={() => toggleFavorite(fav.item_type, fav.item_id)}
                                        className="p-3 bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-brand-400 rounded-2xl hover:bg-brand-100 transition-all border border-brand-100 dark:border-slate-700"
                                    >
                                        <span className="text-xl text-red-500">❤️</span>
                                    </button>
                                </div>

                                <div className="bg-slate-50/50 dark:bg-slate-800/20 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <p className="text-2xl md:text-3xl font-arabic text-slate-900 dark:text-white leading-loose text-right" dir="rtl">{fav.arabic_text}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
