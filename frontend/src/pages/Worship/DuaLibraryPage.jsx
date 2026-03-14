import React, { useState, useEffect } from 'react';
import api from '../../api';

export default function DuaLibraryPage() {
    const [duas, setDuas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchDuas();
    }, []);

    const fetchDuas = async () => {
        try {
            const res = await api.get('/worship/duas/');
            setDuas(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredDuas = duas.filter(d =>
        d.title.toLowerCase().includes(search.toLowerCase()) ||
        d.category.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center text-slate-500">Loading Duas...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 p-4">
            <header className="text-center space-y-4">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dua Library</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Find your heart's expression to your Lord</p>
                <div className="relative max-w-lg mx-auto group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search for a dua..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-900 dark:text-white transition-all shadow-sm"
                    />
                </div>
            </header>

            <div className="grid gap-6">
                {filteredDuas.map((dua) => (
                    <div key={dua.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                        <div className="p-1 bg-gradient-to-r from-blue-500 to-brand-600 opacity-60 group-hover:opacity-100 transition-opacity"></div>
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between items-start gap-4">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{dua.title}</h3>
                                    <span className="px-3 py-1 bg-brand-50 dark:bg-brand-900/20 text-xs font-bold text-brand-600 dark:text-brand-400 rounded-full tracking-wider uppercase">
                                        {dua.category}
                                    </span>
                                </div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{dua.source}</span>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl space-y-4">
                                <p className="text-3xl font-arabic text-slate-900 dark:text-white leading-loose text-right" dir="rtl">{dua.arabic_text}</p>
                                <div className="space-y-2 border-t border-slate-200 dark:border-slate-700 pt-4">
                                    <p className="text-slate-500 dark:text-slate-400 italic font-medium">{dua.transliteration}</p>
                                    <p className="text-slate-700 dark:text-slate-300 font-medium">{dua.translation}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
