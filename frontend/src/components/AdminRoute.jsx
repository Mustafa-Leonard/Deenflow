import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import AuthContext from '../contexts/AuthContext'

export default function AdminRoute({ children }) {
    const { user } = useContext(AuthContext)

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (!user.is_admin) {
        return <Navigate to="/" replace />
    }

    return children
}
