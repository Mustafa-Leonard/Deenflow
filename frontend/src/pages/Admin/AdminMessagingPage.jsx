import React, { useState, useEffect, useRef } from 'react'
import api from '../../api'

export default function AdminMessagingPage() {
    const [threads, setThreads] = useState([])
    const [activeThread, setActiveThread] = useState(null)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [users, setUsers] = useState([])
    const [showNewThread, setShowNewThread] = useState(false)
    const [selectedUser, setSelectedUser] = useState('')
    const [subject, setSubject] = useState('')
    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)
    const messagesEndRef = useRef(null)
    const pollRef = useRef(null)

    useEffect(() => {
        fetchThreads()
        fetchUsers()
        return () => clearInterval(pollRef.current)
    }, [])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const fetchThreads = async () => {
        try {
            const res = await api.get('/messaging/threads/')
            setThreads(res.data)
        } catch (e) { console.error(e) }
        finally { setLoading(false) }
    }

    const fetchUsers = async () => {
        try {
            const res = await api.get('/messaging/users/')
            setUsers(res.data)
        } catch (e) { console.error(e) }
    }

    const openThread = async (thread) => {
        setActiveThread(thread)
        setShowNewThread(false)
        try {
            const res = await api.get(`/messaging/threads/${thread.id}/`)
            setMessages(res.data.messages)
            clearInterval(pollRef.current)
            pollRef.current = setInterval(async () => {
                try {
                    const r = await api.get(`/messaging/threads/${thread.id}/`)
                    setMessages(r.data.messages)
                } catch { }
            }, 5000)
        } catch (e) { console.error(e) }
        fetchThreads()
    }

    const createThread = async (e) => {
        e.preventDefault()
        try {
            const res = await api.post('/messaging/threads/', {
                subject: subject || 'Message from Admin',
                participant_id: selectedUser
            })
            fetchThreads()
            setShowNewThread(false)
            setSubject('')
            setSelectedUser('')
            openThread(res.data)
        } catch (e) { console.error(e) }
    }

    const sendMessage = async (e) => {
        e.preventDefault()
        if (!newMessage.trim() || !activeThread) return
        setSending(true)
        try {
            const res = await api.post(`/messaging/threads/${activeThread.id}/send/`, { content: newMessage.trim() })
            setMessages(prev => [...prev, res.data])
            setNewMessage('')
            fetchThreads()
        } catch (e) { console.error(e) }
        finally { setSending(false) }
    }

    const formatTime = (dt) => new Date(dt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white text-lg">💌</span>
                        Messaging Center
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Reach out to members directly or respond to their questions</p>
                </div>
                <button
                    onClick={() => { setShowNewThread(true); setActiveThread(null) }}
                    className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-medium text-sm transition-all shadow-lg shadow-brand-600/30 active:scale-95"
                >
                    + New Message
                </button>
            </div>

            <div className="h-[calc(100vh-220px)] flex gap-4">
                {/* Threads */}
                <div className="w-72 flex-shrink-0 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
                    <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Conversations</p>
                    </div>
                    <div className="flex-1 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-800">
                        {loading ? (
                            <div className="p-6 text-center text-slate-400 text-sm animate-pulse">Loading...</div>
                        ) : threads.length === 0 ? (
                            <div className="p-6 text-center text-slate-400 text-xs">No conversations yet</div>
                        ) : (
                            threads.map(thread => {
                                const isActive = activeThread?.id === thread.id
                                return (
                                    <button
                                        key={thread.id}
                                        onClick={() => openThread(thread)}
                                        className={`w-full p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${isActive ? 'bg-brand-50 dark:bg-brand-900/20 border-l-2 border-l-brand-500' : ''}`}
                                    >
                                        <div className="font-semibold text-sm text-slate-900 dark:text-white truncate">{thread.subject || 'Direct Message'}</div>
                                        <div className="text-xs text-slate-500 truncate mt-0.5">
                                            {thread.participants_details?.filter(p => p.id !== undefined).map(p => p.full_name || p.username).join(', ')}
                                        </div>
                                        {thread.last_message && (
                                            <p className="text-[10px] text-slate-400 truncate mt-0.5">{thread.last_message.content}</p>
                                        )}
                                    </button>
                                )
                            })
                        )}
                    </div>
                </div>

                {/* Chat / New Thread */}
                <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
                    {showNewThread ? (
                        <div className="p-6 space-y-4">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">New Conversation</h3>
                            <form onSubmit={createThread} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Select Member</label>
                                    <select
                                        value={selectedUser}
                                        onChange={e => setSelectedUser(e.target.value)}
                                        required
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                                    >
                                        <option value="">Select a member...</option>
                                        {users.map(u => (
                                            <option key={u.id} value={u.id}>{u.name} — {u.email}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Subject (optional)</label>
                                    <input
                                        type="text"
                                        value={subject}
                                        onChange={e => setSubject(e.target.value)}
                                        placeholder="e.g. Answer to your question about Zakat"
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button type="submit" className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-medium text-sm transition-all active:scale-95">
                                        Start Conversation
                                    </button>
                                    <button type="button" onClick={() => setShowNewThread(false)} className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-medium text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : !activeThread ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                            <div className="w-20 h-20 bg-brand-50 dark:bg-brand-900/20 rounded-full flex items-center justify-center text-3xl mb-4">💬</div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Messaging Center</h3>
                            <p className="text-slate-500 text-sm max-w-xs">Select a conversation or start a new one to reach out to members</p>
                        </div>
                    ) : (
                        <>
                            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                    {activeThread.subject?.charAt(0)?.toUpperCase() || 'M'}
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900 dark:text-white">{activeThread.subject || 'Direct Message'}</div>
                                    <div className="text-xs text-slate-500">
                                        {activeThread.participants_details?.map(p => p.full_name || p.username).join(' · ')}
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.length === 0 ? (
                                    <div className="text-center text-slate-400 text-sm py-8">No messages yet. Send the first message.</div>
                                ) : (
                                    messages.map(msg => {
                                        const isMe = msg.is_me
                                        return (
                                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <div className="max-w-xs lg:max-w-md">
                                                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${isMe
                                                        ? 'bg-brand-600 text-white rounded-br-sm'
                                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-sm'
                                                        }`}>
                                                        {msg.content}
                                                    </div>
                                                    <div className={`text-[10px] text-slate-400 mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                                                        {!isMe && <span className="font-medium mr-1">{msg.sender_name}</span>}
                                                        {formatTime(msg.created_at)}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            <form onSubmit={sendMessage} className="p-4 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={e => setNewMessage(e.target.value)}
                                    placeholder="Type your reply..."
                                    className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={sending || !newMessage.trim()}
                                    className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-medium text-sm transition-all disabled:opacity-50 active:scale-95"
                                >
                                    {sending ? '...' : 'Send'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
