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
import AudioRecorder from '../components/audio/AudioRecorder';

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

  const handleRecordingComplete = async (blob) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('audio', blob);

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/audio/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Errore nel caricamento del file audio');
      }

      const data = await response.json();
      
      // Creiamo un link di download effettivo
      const downloadUrl = `${process.env.REACT_APP_API_URL}${data.audioUrl}`;
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `recording-${new Date().toISOString().split('T')[0]}.wav`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Errore nel download:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTranscribe = async (blob) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('audio', blob);

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/transcribe`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Errore durante la trascrizione');
      }

      const data = await response.json();
      // Qui implementeremo la navigazione alla pagina di trascrizione
      console.log('Trascrizione completata:', data);
    } catch (error) {
      console.error('Errore durante la trascrizione:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAudioBlob(file);
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
            <AudioRecorder 
              onRecordingComplete={handleRecordingComplete}
              onTranscribe={handleTranscribe}
            />
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
                onClick={() => setIsRecording(!isRecording)}
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
        </Box>
      </Paper>
    </PageContainer>
  );
};

export default Record; 