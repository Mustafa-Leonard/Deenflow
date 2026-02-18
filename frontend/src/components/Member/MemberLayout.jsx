import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import AppSidebar from './AppSidebar'
import AppTopbar from './AppTopbar'
import AuthContext from '../../contexts/AuthContext'

export default function MemberLayout() {
    const { user } = React.useContext(AuthContext)

    if (user?.is_admin) {
        return <Navigate to="/admin/dashboard" replace />
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <AppTopbar />
            <AppSidebar />

            <main className="ml-72 pt-20 p-8 transition-all duration-300">
                <Outlet />
            </main>
        </div>
    )
}
