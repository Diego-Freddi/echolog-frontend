import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/layout/Navbar';
import GoogleLogin from '../components/auth/GoogleLogin';
import PageContainer from '../components/layout/PageContainer';
import { BORDERS } from '../styles/themes';

const Login = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Usa useEffect per gestire il redirect
  useEffect(() => {
    if (user && !loading) {
      console.log('User authenticated, redirecting to dashboard...');
      navigate('/');
    }
  }, [user, loading, navigate]);

  // Mostra un loader durante l'autenticazione
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Se l'utente è già autenticato, reindirizza alla home
  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'linear-gradient(135deg, rgba(240,44,86,0.05) 0%, rgba(124,50,255,0.05) 100%)'
    }}>
      <Navbar />
      
      <PageContainer maxWidth="sm" sx={{ display: 'flex', alignItems: 'center' }}>
        <Paper sx={{ 
          p: { xs: 3, sm: 4 }, 
          width: '100%',
          borderRadius: BORDERS.radius.md,
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          border: '1px solid rgba(240,44,86,0.1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #f02c56 0%, #7c32ff 50%, #35a0ee 100%)'
          }
        }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ 
            color: '#f02c56',
            fontWeight: 700,
            mb: 3,
            textAlign: 'center',
            fontSize: { xs: '2rem', sm: '2.25rem' }
          }}>
            Accedi
          </Typography>
          
          <Typography variant="body1" sx={{ 
            mb: 4,
            textAlign: 'center',
            color: 'rgba(0,0,0,0.6)',
            fontSize: '1rem',
            lineHeight: 1.5
          }}>
            EchoLog utilizza i servizi Google per offrirti la migliore esperienza di trascrizione e analisi audio.
          </Typography>

          <Typography variant="body2" sx={{ 
            mb: 4,
            textAlign: 'center',
            color: 'rgba(0,0,0,0.5)',
            fontSize: '0.875rem',
            lineHeight: 1.5
          }}>
            Accedi con il tuo account Google per iniziare. Non è necessaria alcuna registrazione aggiuntiva.
          </Typography>

          <Box sx={{ 
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            mb: 3
          }}>
            <GoogleLogin />
          </Box>
        </Paper>
      </PageContainer>
    </Box>
  );
};

export default Login; 