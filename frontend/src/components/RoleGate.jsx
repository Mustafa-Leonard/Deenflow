import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import AuthContext from '../contexts/AuthContext'

export default function RoleGate({ children, allowed = [] }) {
    const { user } = useContext(AuthContext)

    if (!user) {
        return <Navigate to="/admin/login" replace />
    }

    // If no specific roles required, just check if user is admin
    if (allowed.length === 0) {
        return user.is_admin ? children : <Navigate to="/" replace />
    }

    // Check if user has one of the allowed roles
    const userRole = user.role || 'member'
    const hasPermission = allowed.includes(userRole) || user.is_superuser

    if (!hasPermission) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="text-center">
                    <div className="text-6xl mb-4">🚫</div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Access Denied</h1>
                    <p className="text-slate-500 dark:text-slate-400">You don't have permission to access this resource.</p>
                </div>
            </div>
        )
    }

    return children
}
