import React, { useState, useEffect } from 'react';
import api from '../../api';

export default function TasbihPage() {
    const [count, setCount] = useState(0);
    const [limit, setLimit] = useState(33);
    const [title, setTitle] = useState('SubhanAllah');
    const [dhikrs, setDhikrs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInitialDhikrs();
    }, []);

    const fetchInitialDhikrs = async () => {
        try {
            const res = await api.get('/worship/dhikr/?category=Tasbih');
            setDhikrs(res.data);
            if (res.data.length > 0) {
                const first = res.data[0];
                setTitle(first.transliteration || first.translation);
                setLimit(first.repeat_default);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleIncrement = async () => {
        setCount(prev => prev + 1);
        if ((count + 1) % limit === 0) {
            // Log completion to backend
            const activeDhikr = dhikrs.find(d => (d.transliteration || d.translation) === title);
            if (activeDhikr) {
                try {
                    await api.post('/worship/dhikr/log/', { dhikr_id: activeDhikr.id, count: limit });
                } catch (err) {
                    console.error('Failed to log dhikr:', err);
                }
            }
        }
    };

    const handleReset = () => {
        setCount(0);
    };

    const handleSwitch = (dhikr) => {
        setTitle(dhikr.transliteration || dhikr.translation);
        setLimit(dhikr.repeat_default);
        setCount(0);
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading digital tasbih...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-12 p-4 pb-20 flex flex-col items-center">
            <header className="text-center space-y-4 w-full">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Digital Tasbih</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium tracking-widest uppercase">Traditional remembrance, modern experience</p>
                <div className="flex flex-wrap justify-center gap-3 pt-6">
                    {dhikrs.map(d => (
                        <button
                            key={d.id}
                            onClick={() => handleSwitch(d)}
                            className={`px-6 py-2 rounded-2xl font-bold transition-all text-sm ${title === (d.transliteration || d.translation)
                                ? 'bg-brand-600 text-white shadow-lg'
                                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                                }`}
                        >
                            {d.transliteration || d.translation}
                        </button>
                    ))}
                </div>
            </header>

            <div className="relative group w-full max-w-sm flex flex-col items-center">
                <div
                    onClick={handleIncrement}
                    className="w-80 h-80 rounded-full bg-white dark:bg-slate-900 border-8 border-brand-100 dark:border-brand-900/30 flex flex-col items-center justify-center cursor-pointer select-none transition-all hover:scale-[1.02] shadow-2xl active:scale-[0.98] group relative overflow-hidden active:shadow-inner"
                >
                    <div className="absolute inset-0 bg-brand-500/5 group-hover:bg-brand-500/10 transition-colors pointer-events-none"></div>
                    <div className="text-6xl font-bold text-slate-900 dark:text-white mb-2 relative z-10 transition-all group-hover:scale-110">{count}</div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest relative z-10">Target {limit}</div>
                    <div className="mt-8 text-sm font-bold text-brand-600 dark:text-brand-400 uppercase tracking-tight relative z-10">{title}</div>
                </div>

                <div className="flex gap-4 mt-12 w-full justify-center">
                    <button
                        onClick={handleReset}
                        className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Reset</span>
                    </button>
                </div>
            </div>

            <p className="text-center text-slate-400 text-sm font-medium italic opacity-60 px-8 py-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 max-w-lg mt-12">
                Tip: Click or tap anywhere on the circle to count. The tasbih resets after reaching your spiritual target.
            </p>
        </div>
    );
}
