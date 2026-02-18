import React, { useContext, useState, useEffect } from 'react'
import AuthContext from '../contexts/AuthContext'
import Card from '../components/Card'

export default function Profile() {
  const { user, updateProfile } = useContext(AuthContext)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ full_name: '', email: '' })

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || ''
      })
    }
  }, [user])

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await updateProfile(formData)
      setIsEditing(false)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-24 max-w-2xl animate-in fade-in duration-700">
      <div className="mb-10">
        <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight">Your <span className="text-brand-600">Profile</span></h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Manage your personal information and preferences.</p>
      </div>

      <Card className="p-10 bg-white dark:bg-slate-900 border-0 shadow-soft rounded-[2.5rem] relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10 group-hover:opacity-10 transition-opacity">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>

        <form onSubmit={handleSave} className="space-y-8 relative z-10">
          <div className="flex items-center gap-6 pb-8 border-b border-slate-50 dark:border-slate-800">
            <div className="w-20 h-20 rounded-3xl bg-brand-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-brand-200">
              {user?.full_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
            </div>
            <div>
              {isEditing ? (
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Full Name</label>
                  <input
                    value={formData.full_name}
                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white font-medium"
                    placeholder="Enter your name"
                  />
                </div>
              ) : (
                <>
                  <div className="text-2xl font-display font-bold text-slate-900 dark:text-slate-100">{user?.full_name || user?.username}</div>
                  <div className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mt-1 italic">Knowledge Seeker</div>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Email Address</div>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white font-medium"
                />
              ) : (
                <div className="text-slate-700 dark:text-slate-200 font-medium">{user?.email}</div>
              )}
            </div>
            <div className="space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Account Type</div>
              <div className="text-slate-700 dark:text-slate-200 font-medium">Standard Member</div>
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            {isEditing ? (
              <>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-slate-950 dark:bg-brand-600 hover:bg-slate-800 dark:hover:bg-brand-700 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-xl active:scale-95 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-8 py-3 rounded-2xl font-bold transition-all hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="bg-slate-950 dark:bg-brand-600 hover:bg-slate-800 dark:hover:bg-brand-700 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-xl active:scale-95"
              >
                Update public profile
              </button>
            )}
          </div>
        </form>
      </Card>

      <div className="mt-8 p-6 bg-brand-50 dark:bg-brand-900/20 rounded-3xl border border-brand-100/50 dark:border-brand-800/30 flex items-center gap-4 transition-colors duration-300">
        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-brand-600 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
          Your data is stored securely and analyzed using privacy-first Islamic AI.
        </div>
      </div>
    </div>
  )
}
