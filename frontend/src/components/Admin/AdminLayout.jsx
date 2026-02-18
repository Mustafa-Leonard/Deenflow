import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import AdminTopbar from './AdminTopbar'

export default function AdminLayout() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <AdminTopbar />
            <AdminSidebar />

            <main className="ml-72 pt-20 p-8 transition-all duration-300">
                <Outlet />
            </main>
        </div>
    )
}
