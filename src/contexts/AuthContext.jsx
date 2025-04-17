import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Setup degli interceptor di Axios
        authService.setupAxiosInterceptors();

        // Verifica se c'è un utente salvato
        const initAuth = async () => {
            try {
                setLoading(true);
                const savedUser = authService.getCurrentUser();
                
                if (savedUser) {
                    console.log('Found saved user, verifying token...');
                    try {
                        // Imposta un timeout più lungo (30 secondi)
                        const controller = new AbortController();
                        const timeoutId = setTimeout(() => controller.abort(), 30000);
                        
                        await authService.verifyToken();
                        clearTimeout(timeoutId);
                        
                        console.log('Token successfully verified');
                        setUser(savedUser.user);
                    } catch (err) {
                        console.error('Token verification failed:', err);
                        // Se fallisce la verifica, facciamo logout
                        authService.logout();
                        setUser(null);
                    }
                }
            } catch (err) {
                console.error('Auth initialization error:', err);
                authService.logout();
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (googleToken) => {
        try {
            setLoading(true);
            setError(null);
            console.log('Processing login...');
            const data = await authService.loginWithGoogle(googleToken);
            if (!data.user || !data.token) {
                throw new Error('Dati utente incompleti ricevuti dal server');
            }
            setUser(data.user);
            console.log('User authenticated successfully:', data.user.name);
            return data;
        } catch (err) {
            console.error('Login error in AuthContext:', err);
            setError(err.message || 'Errore durante il login');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const value = {
        user,
        loading,
        error,
        login,
        logout,
        isAuthenticated: !!user
    };

    if (loading) {
        return <div>Caricamento...</div>; // Sostituiremo questo con un componente di loading
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve essere usato all\'interno di un AuthProvider');
    }
    return context;
};

export default AuthContext; 