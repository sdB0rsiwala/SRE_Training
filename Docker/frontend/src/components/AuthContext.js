// src/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from './axiosConfig';
  // Import axios or use your preferred method for API calls

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    const verifyToken = async () => {
        try {
            const response = await axiosInstance.post('/api/accounts/token/verify/', {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            if (response.status === 200) {
                setUser(response.data['user']);
                setIsLoggedIn(true);
                console.log(user)
            }
        } catch (error) {
            setIsLoggedIn(false);
            setUser(null);
        }
    };

    useEffect(() => {
        verifyToken();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        setUser(null);
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, verifyToken, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};
