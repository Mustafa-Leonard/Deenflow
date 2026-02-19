import React, { useState, useEffect } from 'react'
import api from '../../api'

export default function AuditLogPage() {
    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchLogs()
    }, [])

    const fetchLogs = async () => {
        setLoading(true)
        try {
            const res = await api.get('/audit/logs/')
            setLogs(res.data.results || res.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Audit Trail</h1>
                    <p className="text-slate-500 font-medium">Full historical log of all administrative actions and system modifications.</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Timestamp</th>
                                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Administrator</th>
                                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Action</th>
                                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Entity</th>
                                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {loading ? (
                                <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-400 animate-pulse font-medium">Retrieving system ledger...</td></tr>
                            ) : logs.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-medium">Ledger is empty. No administrative actions recorded.</td></tr>
                            ) : (
                                logs.map(log => (
                                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-slate-900 dark:text-white font-mono">{new Date(log.timestamp).toLocaleDateString()}</div>
                                            <div className="text-[10px] text-slate-400 font-bold tracking-tighter uppercase">{new Date(log.timestamp).toLocaleTimeString()}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center font-bold text-slate-600 text-xs shadow-sm">
                                                    {log.admin_name?.charAt(0) || 'U'}
                                                </div>
                                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{log.admin_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ring-1 ring-inset ${log.action === 'create' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                                                    log.action === 'approve' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' :
                                                        log.action === 'delete' ? 'bg-red-50 text-red-700 ring-red-600/20' :
                                                            'bg-slate-50 text-slate-600 ring-slate-600/20'
                                                }`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-slate-900 dark:text-white uppercase tracking-tighter opacity-80">{log.entity_type}</div>
                                            <div className="text-[10px] text-slate-400 font-bold">Ref: #{log.entity_id}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => console.log(log.new_data)}
                                                className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold rounded uppercase tracking-wider transition-all"
                                            >
                                                Inspect Payload
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
