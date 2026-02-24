import React, { useState, useEffect } from 'react'
import { Outlet, Navigate, useLocation } from 'react-router-dom'
import AppSidebar from './AppSidebar'
import AppTopbar from './AppTopbar'
import Footer from '../Footer'
import AuthContext from '../../contexts/AuthContext'

export default function MemberLayout() {
    const { user } = React.useContext(AuthContext)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const location = useLocation()

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setIsSidebarOpen(false)
    }, [location])

    if (user?.is_admin) {
        return <Navigate to="/admin/dashboard" replace />
    }

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
            <AppSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="flex-1 flex flex-col min-w-0">
                <AppTopbar setIsOpen={setIsSidebarOpen} />

                <main className={`flex-1 pt-20 transition-all duration-500 w-full lg:pl-72`}>
                    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                        <Outlet />
                    </div>
                    <Footer />
                </main>
            </div>
        </div>
    )
}
