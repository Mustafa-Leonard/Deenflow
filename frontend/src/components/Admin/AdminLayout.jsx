import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import AdminTopbar from './AdminTopbar'
import Footer from '../Footer'

export default function AdminLayout() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <AdminTopbar />
            <AdminSidebar />

            <main className="ml-72 pt-20 transition-all duration-300">
                <div className="p-8">
                    <Outlet />
                </div>
                <Footer />
            </main>
        </div>
    )
}

