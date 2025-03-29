import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  IconButton,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  Mic as MicIcon,
  Stop as StopIcon,
  Upload as UploadIcon,
  Computer as ComputerIcon,
} from '@mui/icons-material';
import PageContainer from '../components/layout/PageContainer';

const Record = () => {
  const [mode, setMode] = useState(0); // 0: microfono, 1: sistema, 2: upload
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleModeChange = (event, newValue) => {
    setMode(newValue);
    // Reset dello stato quando si cambia modalità
    setIsRecording(false);
    setAudioBlob(null);
  };

  const startRecording = () => {
    setIsRecording(true);
    if (mode === 0) {
      // Implementare registrazione microfono
    } else if (mode === 1) {
      // Implementare registrazione sistema
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    // Implementare stop registrazione
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Implementare gestione file
      setAudioBlob(file);
    }
  };

  const handleTranscribe = async () => {
    if (!audioBlob) return;
    
    setLoading(true);
    try {
      // Implementare invio audio per trascrizione
      console.log('Trascrizione in corso...');
    } catch (error) {
      console.error('Errore durante la trascrizione:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <Typography variant="h4" gutterBottom>
        Registra Audio
      </Typography>
      
      <Paper sx={{ 
        mt: 3,
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
        <Tabs
          value={mode}
          onChange={handleModeChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab 
            icon={<MicIcon />} 
            label="Microfono" 
            iconPosition="start"
          />
          <Tab 
            icon={<ComputerIcon />} 
            label="Sistema" 
            iconPosition="start"
          />
          <Tab 
            icon={<UploadIcon />} 
            label="Upload" 
            iconPosition="start"
          />
        </Tabs>

        <Box sx={{ p: 3, minHeight: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {mode === 0 && ( // Microfono
            <>
              <IconButton
                color={isRecording ? 'error' : 'primary'}
                sx={{ 
                  width: 80, 
                  height: 80,
                  mb: 2,
                  '& .MuiSvgIcon-root': { fontSize: 40 }
                }}
                onClick={isRecording ? stopRecording : startRecording}
              >
                {isRecording ? <StopIcon /> : <MicIcon />}
              </IconButton>
              <Typography>
                {isRecording ? 'Registrazione in corso...' : 'Premi per registrare'}
              </Typography>
            </>
          )}

          {mode === 1 && ( // Sistema
            <>
              <IconButton
                color={isRecording ? 'error' : 'primary'}
                sx={{ 
                  width: 80, 
                  height: 80,
                  mb: 2,
                  '& .MuiSvgIcon-root': { fontSize: 40 }
                }}
                onClick={isRecording ? stopRecording : startRecording}
              >
                {isRecording ? <StopIcon /> : <ComputerIcon />}
              </IconButton>
              <Typography>
                {isRecording ? 'Registrazione in corso...' : 'Premi per registrare l\'audio di sistema'}
              </Typography>
            </>
          )}

          {mode === 2 && ( // Upload
            <>
              <input
                accept="audio/*"
                style={{ display: 'none' }}
                id="audio-file-upload"
                type="file"
                onChange={handleFileUpload}
              />
              <label htmlFor="audio-file-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<UploadIcon />}
                  sx={{ mb: 2 }}
                >
                  Seleziona File Audio
                </Button>
              </label>
              {audioBlob && (
                <Typography>
                  File selezionato: {audioBlob.name}
                </Typography>
              )}
            </>
          )}

          {audioBlob && !isRecording && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleTranscribe}
              disabled={loading}
              sx={{ mt: 3 }}
            >
              {loading ? (
                <>
                  <CircularProgress size={24} sx={{ mr: 1 }} />
                  Trascrizione in corso...
                </>
              ) : (
                'Trascrivi'
              )}
            </Button>
          )}
        </Box>
      </Paper>
    </PageContainer>
  );
};

export default Record; 