import React, { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import AdminTopbar from './AdminTopbar'
import Footer from '../Footer'

export default function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const location = useLocation()

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setIsSidebarOpen(false)
    }, [location])

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 flex overflow-x-hidden">
            {/* Mobile Sidebar Backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-500"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="flex-1 flex flex-col min-w-0">
                <AdminTopbar setIsOpen={setIsSidebarOpen} />

                <main className="flex-1 pt-20 transition-all duration-500 w-full lg:pl-0">
                    <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full">
                        <Outlet />
                    </div>
                    <Footer />
                </main>
            </div>
        </div>
    )
}

