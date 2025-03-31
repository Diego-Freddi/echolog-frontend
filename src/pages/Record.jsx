import React from 'react';
import {
  Box,
  Paper,
  Typography,
  styled
} from '@mui/material';
import PageContainer from '../components/layout/PageContainer';
import AudioRecorder from '../components/audio/AudioRecorder';

// Paper stilizzato in stile Apple
const ApplePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  backgroundColor: theme.palette.mode === 'dark' ? '#1c1c1e' : '#ffffff',
  boxShadow: '0px 10px 38px -10px rgba(0, 0, 0, 0.1), 0px 10px 20px -15px rgba(0, 0, 0, 0.05)',
  backdropFilter: 'blur(10px)',
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #f02c56 0%, #7c32ff 50%, #35a0ee 100%)',
  }
}));

const Record = () => {
  return (
    <PageContainer>
      <Box sx={{
        width: '800px',  // Puoi modificare questo valore per cambiare la larghezza
        mx: 'auto',    // Margini automatici orizzontali per centrare
        p: 3,         // Padding generale
      }}>
        <ApplePaper>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              fontWeight: 600, 
              fontSize: '1.75rem',
              background: 'linear-gradient(90deg, #f02c56 0%, #7c32ff 50%, #35a0ee 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 4,
              textAlign: 'center'
            }}
          >
            Registratore e Trascrittore Audio
          </Typography>
          
          <AudioRecorder />
        </ApplePaper>
      </Box>
    </PageContainer>
  );
};

export default Record; 