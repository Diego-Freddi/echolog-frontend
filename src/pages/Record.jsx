import React from 'react';
import {
  Box,
  Typography
} from '@mui/material';
import PageContainer from '../components/layout/PageContainer';
import AudioRecorder from '../components/audio/AudioRecorder';
import { ApplePaper, containerStyles, pageTitleStyles } from '../styles/pageStyles';

const Record = () => {
  return (
    <PageContainer>
      <Box sx={{
        ...containerStyles,
        maxWidth: '800px',
      }}>
        <ApplePaper>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={pageTitleStyles}
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