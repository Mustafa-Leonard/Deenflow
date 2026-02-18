import React, { createContext, useContext, useEffect, useState } from 'react'
import AuthContext from './AuthContext'

export const ThemeContext = createContext()

export function ThemeProvider({ children }) {
    const { user, updateProfile } = useContext(AuthContext)
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

    useEffect(() => {
        // If user is logged in and has a theme set in profile, prioritize that
        if (user?.theme && user.theme !== theme) {
            setTheme(user.theme)
        }
    }, [user])

    useEffect(() => {
        const root = window.document.documentElement
        if (theme === 'dark') {
            root.classList.add('dark')
        } else {
            root.classList.remove('dark')
        }
        localStorage.setItem('theme', theme)
    }, [theme])

    const toggleTheme = async () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)

        // Sync with backend if user is logged in
        if (user) {
            try {
                await updateProfile({ theme: newTheme })
            } catch (e) {
                console.error('Failed to sync theme with backend', e)
            }
        }
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeContext
