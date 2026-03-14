import React, { useState, useEffect } from 'react';
import api from '../../api';

export default function PrayerTimesPage() {
    const [times, setTimes] = useState(null);
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState(null);

    const [showManual, setShowManual] = useState(false);
    const [manualLat, setManualLat] = useState('');
    const [manualLng, setManualLng] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const locRes = await api.get('/worship/prayer/location/');
            if (locRes.data) {
                setLocation(locRes.data);
                const timesRes = await api.get('/worship/prayer/times/');
                setTimes(timesRes.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateLocation = async (lat, lng) => {
        setLoading(true);
        try {
            const res = await api.post('/worship/prayer/location/', {
                location_lat: lat,
                location_lng: lng,
                calculation_method: location?.calculation_method || 2, // Default to ISNA
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            });
            setLocation(res.data);
            const timesRes = await api.get('/worship/prayer/times/');
            setTimes(timesRes.data);
            setShowManual(false);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    updateLocation(pos.coords.latitude, pos.coords.longitude);
                },
                (err) => {
                    console.error('Geolocation error:', err);
                    setShowManual(true);
                }
            );
        } else {
            setShowManual(true);
        }
    };

    const handleManualSubmit = (e) => {
        e.preventDefault();
        if (manualLat && manualLng) {
            updateLocation(parseFloat(manualLat), parseFloat(manualLng));
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium animate-pulse">Calculating timings...</p>
        </div>
    );

    const prayerList = times ? Object.entries(times).filter(([k]) =>
        ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].includes(k)
    ) : [];

    return (
        <div className="max-w-4xl mx-auto space-y-8 p-4">
            <header className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Prayer Times</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">{location ? `Near ${Number(location.location_lat).toFixed(2)}, ${Number(location.location_lng).toFixed(2)}` : 'Set your location to begin'}</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowManual(!showManual)}
                        className="px-4 py-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-bold border border-slate-200 dark:border-slate-700 hover:border-brand-300 transition-all"
                    >
                        {showManual ? 'Cancel' : 'Set Manually'}
                    </button>
                    <button
                        onClick={getCurrentLocation}
                        className="px-6 py-3 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 transition-all flex items-center gap-2 shadow-lg shadow-brand-900/10"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        <span>Detect Location</span>
                    </button>
                </div>
            </header>

            {showManual && (
                <div className="p-8 bg-brand-50 dark:bg-brand-900/10 rounded-3xl border border-brand-100 dark:border-brand-900/20 animate-in fade-in slide-in-from-top-4 duration-300">
                    <form onSubmit={handleManualSubmit} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 space-y-2">
                            <label className="text-xs font-bold text-brand-600 uppercase tracking-widest px-1">Latitude</label>
                            <input
                                type="number" step="any" required
                                value={manualLat} onChange={(e) => setManualLat(e.target.value)}
                                placeholder="e.g. 21.42"
                                className="w-full px-5 py-3 rounded-2xl border-2 border-white dark:border-slate-800 focus:border-brand-500 outline-none transition-all dark:bg-slate-900"
                            />
                        </div>
                        <div className="flex-1 space-y-2">
                            <label className="text-xs font-bold text-brand-600 uppercase tracking-widest px-1">Longitude</label>
                            <input
                                type="number" step="any" required
                                value={manualLng} onChange={(e) => setManualLng(e.target.value)}
                                placeholder="e.g. 39.82"
                                className="w-full px-5 py-3 rounded-2xl border-2 border-white dark:border-slate-800 focus:border-brand-500 outline-none transition-all dark:bg-slate-900"
                            />
                        </div>
                        <button type="submit" className="px-8 py-3 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 shadow-lg shadow-brand-900/10">
                            Apply
                        </button>
                    </form>
                </div>
            )}

            {!times && !showManual && (
                <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-4xl">🌍</div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Where are you?</h3>
                        <p className="text-slate-500 font-medium max-w-sm mx-auto">We need your coordinates to calculate accurate prayer times for your exact location.</p>
                    </div>
                </div>
            )}

            {times && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {prayerList.map(([name, time]) => (
                        <div key={name} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <span className="text-6xl font-bold">{name[0]}</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">{name}</h3>
                            <div className="text-4xl font-bold text-slate-900 dark:text-white transition-transform group-hover:translate-x-1">{time}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
