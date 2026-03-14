import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../api';
import AuthContext from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = useCallback(async (silent = false) => {
        if (!user) return;
        if (!silent) setLoading(true);
        try {
            const res = await api.get('/notifications/');
            setNotifications(res.data);
            setUnreadCount(res.data.filter(n => !n.is_read).length);
        } catch (error) {
            console.error('Notification fetch failed:', error);
        } finally {
            if (!silent) setLoading(false);
        }
    }, [user]);

    const markAsRead = async (id) => {
        try {
            await api.patch(`/notifications/${id}/`, { is_read: true });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Mark as read failed:', error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchNotifications();
            // Polling for "real-time" feel - 10 seconds interval
            const interval = setInterval(() => fetchNotifications(true), 10000);
            return () => clearInterval(interval);
        } else {
            setNotifications([]);
            setUnreadCount(0);
        }
    }, [user, fetchNotifications]);

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, loading, fetchNotifications, markAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);
