import React from 'react';
import { Navigate } from 'react-router-dom';
import { Box, Typography, Paper } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/layout/Navbar';
import GoogleLogin from '../components/auth/GoogleLogin';
import PageContainer from '../components/layout/PageContainer';

const Login = () => {
  const { user } = useAuth();

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
          borderRadius: '16px',
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