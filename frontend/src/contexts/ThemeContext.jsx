import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import AuthContext from './AuthContext'

export const ThemeContext = createContext()

export function ThemeProvider({ children }) {
    const { user, updateProfile } = useContext(AuthContext)

    // Read from localStorage synchronously (inline script in index.html already applied the class,
    // so React state just needs to match — no flash possible)
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')

    // On first mount: remove the no-transition guard so CSS transitions activate
    // This ensures zero FOUC on initial render — transitions only start after hydration
    useEffect(() => {
        const t = requestAnimationFrame(() => {
            document.documentElement.classList.remove('no-transition')
        })
        return () => cancelAnimationFrame(t)
    }, [])


    // Guard against rapid double-toggles while the backend call is in-flight
    const isToggling = useRef(false)

    // Sync theme when the logged-in user has a backend preference
    useEffect(() => {
        if (user?.theme && user.theme !== theme) {
            applyTheme(user.theme)
        }
    }, [user])

    function applyTheme(newTheme) {
        const root = document.documentElement

        // 1. Stamp the class immediately so every Tailwind `dark:` rule fires at once
        if (newTheme === 'dark') {
            root.classList.add('dark')
        } else {
            root.classList.remove('dark')
        }

        // 2. Keep native browser chrome (scrollbars, inputs, etc.) in sync
        root.style.colorScheme = newTheme

        // 3. Persist for the flash-prevention script on next load
        localStorage.setItem('theme', newTheme)

        setTheme(newTheme)
    }

    const toggleTheme = async () => {
        if (isToggling.current) return   // debounce rapid clicks
        isToggling.current = true

        const newTheme = theme === 'light' ? 'dark' : 'light'
        applyTheme(newTheme)

        // Sync with backend if user is logged in (non-blocking)
        if (user) {
            try {
                await updateProfile({ theme: newTheme })
            } catch (e) {
                console.error('Failed to sync theme with backend', e)
            }
        }

        isToggling.current = false
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeContext
