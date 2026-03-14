import React, { useState, useEffect, useRef, useContext } from 'react'
import api from '../../api'
import AuthContext from '../../contexts/AuthContext'
import { 
  Send, 
  MessageSquare, 
  Clock, 
  CheckCheck, 
  User, 
  Search, 
  MoreVertical, 
  Sparkles, 
  History,
  ArrowLeft,
  Video,
  Info,
  Smile,
  Paperclip
} from 'lucide-react'

export default function MessagesPage() {
    const { user } = useContext(AuthContext)
    const [threads, setThreads] = useState([])
    const [activeThread, setActiveThread] = useState(null)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const messagesEndRef = useRef(null)
    const pollRef = useRef(null)

    useEffect(() => {
        fetchThreads()
        return () => clearInterval(pollRef.current)
    }, [])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const fetchThreads = async () => {
        try {
            const res = await api.get('/messaging/threads/')
            setThreads(res.data)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const openThread = async (thread) => {
        setActiveThread(thread)
        try {
            const res = await api.get(`/messaging/threads/${thread.id}/`)
            setMessages(res.data.messages)
            // Poll for new messages every 5 seconds
            clearInterval(pollRef.current)
            pollRef.current = setInterval(async () => {
                try {
                    const r = await api.get(`/messaging/threads/${thread.id}/`)
                    setMessages(r.data.messages)
                } catch { }
            }, 5000)
        } catch (e) {
            console.error(e)
        }
        fetchThreads()
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
        } catch (e) {
            console.error(e)
        } finally {
            setSending(false)
        }
    }

    const formatTime = (dt) => {
        const d = new Date(dt)
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const filteredThreads = threads.filter(t => 
        (t.subject || '').toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="max-w-7xl mx-auto h-[calc(100vh-160px)] flex gap-6 pb-4 animate-in fade-in duration-700">
            {/* Threads Sidebar */}
            <div className={`deen-card w-full md:w-96 flex-shrink-0 p-0 overflow-hidden flex flex-col ${activeThread ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                           <MessageSquare className="w-5 h-5 text-brand-600" />
                           Messages
                        </h2>
                        <div className="p-2 bg-brand-50 dark:bg-brand-900/20 rounded-xl">
                          <Sparkles className="w-4 h-4 text-brand-600" />
                        </div>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text"
                            placeholder="Search correspondence..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all placeholder:text-slate-400"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                    {loading ? (
                        <div className="p-12 text-center">
                            <div className="w-8 h-8 border-2 border-brand-100 border-t-brand-600 rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Opening archives...</p>
                        </div>
                    ) : filteredThreads.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-200">
                                <History className="w-8 h-8" />
                            </div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white mb-2">Pristine Inbox</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                              No conversations started yet. Connect with our academic support.
                            </p>
                        </div>
                    ) : (
                        filteredThreads.map(thread => {
                            const lastMsg = thread.last_message
                            const isActive = activeThread?.id === thread.id
                            return (
                                <button
                                    key={thread.id}
                                    onClick={() => openThread(thread)}
                                    className={`w-full p-4 rounded-2xl text-left transition-all relative overflow-hidden group ${
                                        isActive 
                                            ? 'bg-brand-50 dark:bg-brand-900/20 ring-1 ring-brand-500/20' 
                                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                    }`}
                                >
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className={`w-12 h-12 rounded-[1.2rem] flex items-center justify-center font-display font-bold text-lg shadow-sm ${
                                            isActive ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-brand-50 transition-colors'
                                        }`}>
                                            {thread.subject?.charAt(0) || 'M'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h4 className={`text-sm font-bold truncate ${isActive ? 'text-brand-900 dark:text-brand-100' : 'text-slate-900 dark:text-white'}`}>
                                                    {thread.subject || 'Academic Inquiry'}
                                                </h4>
                                                <span className="text-[9px] font-bold text-slate-400 ml-2 whitespace-nowrap uppercase tracking-tighter">
                                                    {lastMsg ? formatTime(lastMsg.created_at) : 'Just now'}
                                                </span>
                                            </div>
                                            <p className={`text-xs truncate italic font-serif ${isActive ? 'text-brand-600/80 dark:text-brand-400/80' : 'text-slate-500'}`}>
                                                {lastMsg ? lastMsg.content : 'Begin conversation...'}
                                            </p>
                                        </div>
                                    </div>
                                    {isActive && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-brand-600 rounded-l-full"></div>}
                                </button>
                            )
                        })
                    )}
                </div>
            </div>

            {/* Chat Window */}
            <div className={`deen-card flex-1 p-0 overflow-hidden flex flex-col relative ${!activeThread ? 'hidden md:flex' : 'flex'}`}>
                {!activeThread ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-12 relative overflow-hidden">
                        <div className="absolute inset-0 bg-slate-50/50 dark:bg-slate-900/50 islamic-accent opacity-10"></div>
                        <div className="w-24 h-24 bg-brand-50 dark:bg-brand-900/20 rounded-[2.5rem] flex items-center justify-center mb-8 relative group shadow-inner">
                            <MessageSquare className="w-10 h-10 text-brand-600 group-hover:scale-110 transition-transform" />
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white dark:border-slate-900 animate-pulse"></div>
                        </div>
                        <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-3 leading-tight tracking-tight">Academic Correspondence</h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-sm text-sm font-medium leading-relaxed font-serif italic">
                            Select a secure channel from the left to engage with our verified scholars and administrative support teams.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Chat Header */}
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900/50 backdrop-blur-md z-10 sticky top-0">
                            <div className="flex items-center gap-4">
                                <button 
                                  onClick={() => setActiveThread(null)}
                                  className="md:hidden p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                                >
                                  <ArrowLeft className="w-5 h-5 text-slate-500" />
                                </button>
                                <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-display font-bold text-xl shadow-xl shadow-brand-600/20">
                                    {activeThread.subject?.charAt(0) || 'M'}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white leading-tight">{activeThread.subject || 'Direct Message'}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">End-to-End Encrypted</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                               <button className="p-3 text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-2xl transition-all">
                                 <Video className="w-5 h-5" />
                               </button>
                               <button className="p-3 text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-2xl transition-all">
                                 <Info className="w-5 h-5" />
                               </button>
                               <button className="p-3 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-2xl transition-all">
                                 <MoreVertical className="w-5 h-5" />
                               </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/30 dark:bg-slate-950/30 custom-scrollbar relative">
                            <div className="absolute inset-0 bg-slate-100/10 dark:bg-slate-900/10 islamic-accent opacity-5 pointer-events-none"></div>
                            
                            {messages.length === 0 ? (
                                <div className="text-center py-20">
                                    <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                      <Sparkles className="w-6 h-6 text-brand-600" />
                                    </div>
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">The conversation starts here</p>
                                </div>
                            ) : (
                                messages.map((msg, idx) => {
                                    const isMe = msg.is_me
                                    return (
                                        <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                            <div className={`max-w-[85%] md:max-w-[70%] relative group`}>
                                                <div className={`px-6 py-4 rounded-[2rem] text-sm leading-relaxed shadow-sm transition-all ${
                                                    isMe
                                                        ? 'bg-brand-600 text-white rounded-br-lg shadow-brand-600/10'
                                                        : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-lg border border-slate-100 dark:border-slate-700/50'
                                                }`}>
                                                    {msg.content}
                                                </div>
                                                <div className={`flex items-center gap-2 mt-2 px-2 text-[9px] font-bold uppercase tracking-widest text-slate-400 ${isMe ? 'flex-row-reverse' : ''}`}>
                                                    <span>{formatTime(msg.created_at)}</span>
                                                    {!isMe && <span className="text-brand-600">{msg.sender_name}</span>}
                                                    {isMe && <CheckCheck className="w-3 h-3 text-brand-500" />}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Section */}
                        <div className="p-6 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
                          <form onSubmit={sendMessage} className="relative group">
                              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                 <button type="button" className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/30 rounded-full transition-all">
                                   <Smile className="w-5 h-5" />
                                 </button>
                                 <button type="button" className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/30 rounded-full transition-all">
                                   <Paperclip className="w-5 h-5" />
                                 </button>
                              </div>
                              <input
                                  type="text"
                                  value={newMessage}
                                  onChange={e => setNewMessage(e.target.value)}
                                  placeholder="Type your message of inquiry..."
                                  className="w-full pl-28 pr-20 py-5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-medium text-sm shadow-inner placeholder:text-slate-400"
                              />
                              <button
                                  type="submit"
                                  disabled={sending || !newMessage.trim()}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 p-3.5 bg-brand-600 text-white rounded-[1.5rem] shadow-xl shadow-brand-600/20 hover:bg-brand-700 active:scale-95 transition-all disabled:opacity-30 disabled:shadow-none"
                              >
                                  {sending ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                  ) : (
                                    <Send className="w-5 h-5 fill-current" />
                                  )}
                              </button>
                          </form>
                          <p className="text-center text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mt-6">
                            Verified Scholar Channel • Academic Standards Apply
                          </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
