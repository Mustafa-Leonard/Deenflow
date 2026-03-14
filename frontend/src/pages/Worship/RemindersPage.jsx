import React, { useState, useEffect } from 'react';
import api from '../../api';

export default function RemindersPage() {
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newReminder, setNewReminder] = useState({
        title: '',
        category_id: '',
        scheduled_time: '05:30',
        repeat_rule: 'daily'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [remRes, catRes] = await Promise.all([
                api.get('/worship/reminders/'),
                api.get('/worship/categories/')
            ]);
            setReminders(remRes.data);
            setCategories(catRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/worship/reminders/create/', newReminder);
            setReminders([...reminders, { ...res.data, ...newReminder, category: categories.find(c => c.id === newReminder.category_id)?.name }]);
            setShowModal(false);
            setNewReminder({ title: '', category_id: '', scheduled_time: '05:30', repeat_rule: 'daily' });
        } catch (err) {
            console.error(err);
            alert('Failed to create reminder. Please check your inputs.');
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Synchronizing your spiritual schedule...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 p-4 pb-20">
            <header className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Smart Reminders</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium tracking-tight">Gentle nudges for your spiritual growth and consistency</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-8 py-3.5 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 transition-all flex items-center gap-3 shadow-lg shadow-brand-900/20 active:scale-95 group"
                >
                    <span className="text-xl group-hover:rotate-90 transition-transform">➕</span>
                    <span>New Reminder</span>
                </button>
            </header>

            {reminders.length === 0 ? (
                <div className="p-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-8 shadow-sm">
                    <div className="w-24 h-24 bg-brand-50 dark:bg-brand-900/10 rounded-full flex items-center justify-center mx-auto text-5xl">
                        🔔
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Consistency is the key to success</h3>
                        <p className="text-slate-500 max-w-sm mx-auto font-medium leading-relaxed italic opacity-80">"The most beloved actions to Allah are those performed consistently, even if they are few."</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-6 py-2 bg-slate-50 dark:bg-slate-800 text-brand-600 dark:text-brand-400 rounded-xl font-bold border border-brand-100 dark:border-slate-700"
                    >
                        Set your first reminder
                    </button>
                </div>
            ) : (
                <div className="grid gap-6">
                    {reminders.map((rem) => (
                        <div key={rem.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-brand-500"></div>
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-inner">
                                    ⏰
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{rem.title || 'Spiritual Nudge'}</h3>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-bold text-brand-600 dark:text-brand-400 px-3 py-0.5 bg-brand-50 dark:bg-brand-900/20 rounded-full">{rem.category || 'General'}</span>
                                        <span className="text-sm text-slate-400 font-bold uppercase tracking-widest">{rem.scheduled_time} • {rem.repeat_rule}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <button className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 dark:hover:text-red-400 rounded-xl transition-all border border-slate-100 dark:border-slate-700">
                                    <span className="text-xl">🗑️</span>
                                </button>
                                <button className="px-5 py-2.5 bg-brand-50 dark:bg-brand-900/10 text-brand-600 dark:text-brand-400 rounded-xl font-bold border border-brand-100 dark:border-brand-900/30">Edit</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-white/20 dark:border-slate-800">
                        <div className="p-8 space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create Spiritual Nudge</h2>
                                <button onClick={() => setShowModal(false)} className="text-2xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">✕</button>
                            </div>

                            <form onSubmit={handleCreate} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Title</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Morning Adhkar"
                                        className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none transition-all dark:text-white"
                                        value={newReminder.title}
                                        onChange={e => setNewReminder({ ...newReminder, title: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Time</label>
                                        <input
                                            type="time"
                                            className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none transition-all dark:text-white"
                                            value={newReminder.scheduled_time}
                                            onChange={e => setNewReminder({ ...newReminder, scheduled_time: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Category</label>
                                        <select
                                            className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none transition-all dark:text-white"
                                            value={newReminder.category_id}
                                            onChange={e => setNewReminder({ ...newReminder, category_id: e.target.value })}
                                        >
                                            <option value="">None</option>
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Repeat Rule</label>
                                    <select
                                        className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none transition-all dark:text-white"
                                        value={newReminder.repeat_rule}
                                        onChange={e => setNewReminder({ ...newReminder, repeat_rule: e.target.value })}
                                    >
                                        <option value="daily">Every Day</option>
                                        <option value="mon-fri">Mon - Fri</option>
                                        <option value="weekend">Weekends Only</option>
                                    </select>
                                </div>

                                <button type="submit" className="w-full py-4 bg-brand-600 text-white rounded-2xl font-bold shadow-xl shadow-brand-900/20 hover:bg-brand-700 transition-all transform active:scale-[0.98]">
                                    Create Reminder
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
