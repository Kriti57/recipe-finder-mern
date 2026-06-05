import React, {createContext, useState, useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';

const parseJwt = (token) => {
    try{
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
};

export const AuthContext = createContext(null);

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        const loadUser = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_BACKEND_API_URL}/api/users/profile`,
                    {
                        headers: {
                        Authorization: `Bearer ${token}`,
                        'Cache-Control': 'no-cache',
                        },
                    }
                    );
                
                if (!res.ok) throw new Error('Unauthorized');
                const data = await res.json().catch(() => null);
                if (!data) throw new Error('Failed to fetch user');
                setUser({
                    id: data._id,
                    name: data.name,
                    email: data.email,
                });
            } catch {
                localStorage.removeItem('token');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        
        if (token) {
            loadUser();
        } else {
            setLoading(false);
        }
    }, []);


    const login = (userData, token) => {
        localStorage.setItem('token', token); 
        setUser({
            id: userData._id,   
            name: userData.name,
            email: userData.email,
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        navigate('/');
    };

    const authContextValue = {
        user,
        loading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {!loading && children}
        </AuthContext.Provider>
    );
};