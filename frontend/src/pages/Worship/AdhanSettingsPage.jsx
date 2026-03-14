import React, { useState, useEffect } from 'react';
import api from '../../api';

export default function AdhanSettingsPage() {
    const [alarms, setAlarms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAlarms();
    }, []);

    const fetchAlarms = async () => {
        try {
            const res = await api.get('/worship/alarms/');
            setAlarms(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleAlarm = async (prayerName) => {
        try {
            const res = await api.post('/worship/alarms/toggle/', { prayer_name: prayerName });
            setAlarms(prev => {
                const index = prev.findIndex(a => a.prayer_name === prayerName);
                if (index !== -1) {
                    const newAlarms = [...prev];
                    newAlarms[index] = { ...newAlarms[index], enabled: res.data.enabled };
                    return newAlarms;
                }
                return [...prev, { prayer_name: prayerName, enabled: res.data.enabled, offset_minutes: 0, tone: 'default' }];
            });
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading Alarms...</div>;

    const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

    return (
        <div className="max-w-4xl mx-auto space-y-8 p-4">
            <header className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Adhan Settings</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Customize your prayer notifications</p>
            </header>

            <div className="grid gap-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {prayers.map((name) => {
                        const alarm = alarms.find(a => a.prayer_name === name);
                        const isEnabled = alarm ? alarm.enabled : false;

                        return (
                            <div key={name} className="py-6 flex items-center justify-between gap-6 transition-all group">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{name}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                        {isEnabled ? 'Notification enabled' : 'Notification disabled'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-6">
                                    <button
                                        onClick={() => toggleAlarm(name)}
                                        className={`w-14 h-8 rounded-full relative transition-all duration-300 ${isEnabled ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                                    >
                                        <div className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-sm transition-transform duration-300 ${isEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
