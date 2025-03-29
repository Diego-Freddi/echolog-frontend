import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/auth';

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
                const savedUser = authService.getCurrentUser();
                if (savedUser) {
                    await authService.verifyToken();
                    // Estrai i dati dell'utente dall'oggetto salvato
                    setUser(savedUser.user);
                }
            } catch (err) {
                console.error('Errore durante l\'inizializzazione:', err);
                authService.logout();
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (googleToken) => {
        try {
            setError(null);
            const data = await authService.loginWithGoogle(googleToken);
            // Estrai i dati dell'utente dall'oggetto response
            setUser(data.user);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
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