import React from 'react';
import { Container, Box } from '@mui/material';

const PageContainer = ({ children, maxWidth = 'lg', disableGutters = false }) => {
  return (
    <Box sx={{ 
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, rgba(240,44,86,0.05) 0%, rgba(124,50,255,0.05) 100%)'
    }}>
      <Container 
        maxWidth={maxWidth} 
        disableGutters={disableGutters}
        sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          py: 4
        }}
      >
        {children}
      </Container>
    </Box>
  );
};

export default PageContainer; 