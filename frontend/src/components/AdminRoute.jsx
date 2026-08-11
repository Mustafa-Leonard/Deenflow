import React, { useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import AuthContext from '../contexts/AuthContext'

export default function AdminRoute({ children }) {
    const { user, loading } = useContext(AuthContext)
    const location = useLocation()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-800 border-t-brand-600 rounded-full animate-spin"></div>
            </div>
        )
    }

if (!user) {
        // Admin area always routes to the dedicated Admin Portal login
        return <Navigate to="/admin/login" state={{ from: location }} replace />
    }

    if (!user.is_admin) {
        // Non-admin users can never enter the admin area
        return <Navigate to="/app/dashboard" replace />
    }

    return children
}
