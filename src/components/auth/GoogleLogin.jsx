import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../contexts/AuthContext';
import { Button, CircularProgress } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

const GoogleLogin = () => {
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const googleLogin = useGoogleLogin({
        onSuccess: async (response) => {
            try {
                setIsLoading(true);
                setError(null);
                console.log('Google login success, sending token to backend...');
                // Inviamo direttamente l'access token al backend per la verifica
                await login({ 
                    token_type: response.token_type,
                    access_token: response.access_token 
                });
                console.log('Login completed successfully');
            } catch (error) {
                console.error('Errore durante il login:', error);
                setError(error.message || 'Errore durante il login');
            } finally {
                setIsLoading(false);
            }
        },
        onError: (error) => {
            console.error('Login fallito:', error);
            setError('Autenticazione Google fallita');
            setIsLoading(false);
        },
        flow: 'implicit',
        scope: 'email profile'
    });

    return (
        <>
            <Button
                variant="contained"
                onClick={() => {
                    setIsLoading(true);
                    googleLogin();
                }}
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <GoogleIcon />}
                disabled={isLoading}
                sx={{
                    backgroundColor: '#fff',
                    color: '#757575',
                    textTransform: 'none',
                    boxShadow: '0 2px 4px 0 rgba(0,0,0,0.25)',
                    '&:hover': {
                        backgroundColor: '#f5f5f5',
                        boxShadow: '0 2px 8px 0 rgba(0,0,0,0.25)',
                    },
                    padding: '10px 20px',
                    fontSize: '16px',
                    fontWeight: 500,
                    width: '100%',
                    maxWidth: '300px'
                }}
            >
                {isLoading ? 'Accesso in corso...' : 'Accedi con Google'}
            </Button>
            {error && (
                <div style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>
                    {error}
                </div>
            )}
        </>
    );
};

export default GoogleLogin; 