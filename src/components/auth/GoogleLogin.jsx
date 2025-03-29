import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import axios from 'axios';

const GoogleLogin = () => {
    const { login } = useAuth();

    const googleLogin = useGoogleLogin({
        onSuccess: async (response) => {
            try {
                // Ottieni l'ID token usando l'access token
                const userInfo = await axios.get(
                    'https://www.googleapis.com/oauth2/v3/userinfo',
                    {
                        headers: { Authorization: `Bearer ${response.access_token}` },
                    }
                );
                
                // Passa le informazioni dell'utente al backend
                await login(userInfo.data);
            } catch (error) {
                console.error('Errore durante il login:', error);
            }
        },
        onError: () => {
            console.error('Login fallito');
        }
    });

    return (
        <Button
            variant="contained"
            onClick={() => googleLogin()}
            startIcon={<GoogleIcon />}
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
            Accedi con Google
        </Button>
    );
};

export default GoogleLogin; 