import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext.js';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { setLoading(false); return; }

        const loadUser = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_BACKEND_API_URL}/api/users/profile`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (!res.ok) throw new Error('Unauthorized');
                const data = await res.json();
                setUser({ id: data._id, name: data.name, email: data.email });
            } catch {
                localStorage.removeItem('token');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = useCallback(({ user, token }) => {
        localStorage.setItem('token', token);
        setUser({ id: user._id, name: user.name, email: user.email });
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('token');
        navigate('/');
    }, [navigate]);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};