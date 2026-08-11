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
        <div className="h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300 flex">
            {/* Mobile Sidebar Backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar - sticky on desktop, fixed on mobile */}
            <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* Main content area - pushed right by sidebar on desktop */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Topbar floats above content with sidebar offset on desktop */}
                <AdminTopbar setIsOpen={setIsSidebarOpen} />

                {/* Page content below fixed topbar - scrolls internally to stay aligned with sidebar */}
                <main className="flex-1 mt-20 overflow-y-auto w-full">
                    <div className="p-4 sm:p-6 lg:p-8 w-full">
                        <Outlet />
                    </div>
                    <Footer />
                </main>
            </div>
        </div>
    )
}

