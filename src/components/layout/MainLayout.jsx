import React from 'react';
import { Box } from '@mui/material';
import Navbar from './Navbar';

const MainLayout = ({ children }) => {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, rgba(240,44,86,0.05) 0%, rgba(124,50,255,0.05) 100%)'
    }}>
      <Navbar />
      <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout; 