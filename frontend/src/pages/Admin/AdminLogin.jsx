import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../../contexts/AuthContext'

export default function AdminLogin() {
    const navigate = useNavigate()
    const { login } = useContext(AuthContext)
    const [formData, setFormData] = useState({ username: '', password: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const trimmedUsername = formData.username.trim()
            console.log('Attempting admin login for:', trimmedUsername)
            const user = await login(trimmedUsername, formData.password)

            // Check if user has admin privileges
            if (!user.is_admin) {
                setError('Access denied. Administrator privileges are required to enter this portal.')
                setLoading(false)
                return
            }

            navigate('/admin/dashboard')
        } catch (err) {
            console.error('Admin login error:', err)
            const detail = err.response?.data?.detail
            const detailStr = typeof detail === 'string' ? detail : JSON.stringify(detail)
            setError(detailStr || 'Invalid credentials. Please check your username and password.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-brand-950 to-slate-900 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                {/* Logo & Title */}
                <div className="text-center mb-10">
                    {/* DeenFlow logo — white/inverted for dark background */}
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <img
                            src="/deenflow-icon.svg"
                            alt="DeenFlow Icon"
                            className="w-14 h-14 drop-shadow-2xl"
                        />
                        <img
                            src="/deenflow-logo.svg"
                            alt="DeenFlow"
                            className="h-10 w-auto brightness-0 invert"
                        />
                    </div>
                    <h1 className="text-2xl font-display font-bold text-white mb-1">Admin Portal</h1>
                    <p className="text-slate-400 text-sm">Authorized personnel only</p>
                </div>

                {/* Login Form */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">
                                Username or Email
                            </label>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all placeholder-slate-500"
                                placeholder="Enter your username"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all placeholder-slate-500"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-brand-600/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-white/10">
                        <p className="text-xs text-slate-400 text-center">
                            Authorized personnel only. All activities are logged and monitored.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
