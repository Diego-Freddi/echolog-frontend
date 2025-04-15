import React from 'react';
import {
  Box,
  Paper,
  Typography,
  styled
} from '@mui/material';
import PageContainer from '../components/layout/PageContainer';
import AudioRecorder from '../components/audio/AudioRecorder';

// Paper stilizzato
const ApplePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
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
        width: '100%',
        maxWidth: '800px',
        mx: 'auto',
        p: { xs: 1, sm: 2, md: 3 }
      }}>
        <ApplePaper>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              fontWeight: 600, 
              fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
              background: 'linear-gradient(90deg, #f02c56 0%, #7c32ff 50%, #35a0ee 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: { xs: 2, sm: 3, md: 4 },
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