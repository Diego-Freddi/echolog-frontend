import React from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Button,
  styled,
  useTheme,
  CircularProgress,
  Typography,
  Chip
} from '@mui/material';
import { 
  Mic as MicIcon, 
  Stop as StopIcon,
  Pause as PauseIcon,
  PlayArrow as PlayIcon,
  Upload as UploadIcon,
  TextFields as TextFieldsIcon,
  Computer as ComputerIcon,
  Timer as TimerIcon
} from '@mui/icons-material';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';
import TranscriptionView from '../transcription/TranscriptionView';
import { 
  pulse, 
  buttonStyles, 
  audioWaveContainerStyles, 
  audioPlayerStyles, 
  timerStyles,
  statusIndicatorStyles,
  audioWaveStyles
} from '../../styles/audioRecorderStyles';

// Contenitore per il visualizzatore di onde audio
const AudioWaveContainer = styled(Box)(audioWaveContainerStyles);

// Visualizzatore onde audio
const AudioWave = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isActive' && prop !== 'index'
})(({ isActive, index }) => ({
  width: 4,
  margin: '0 1px',
  borderRadius: 4,
  backgroundColor: '#f02c56',
  position: 'absolute',
  bottom: 0,
  transform: 'translateY(0)',
  transformOrigin: 'bottom',
  transition: isActive ? 'height 0.1s ease-in-out' : 'height 0.5s ease-out',
}));

// Audio Player stilizzato
const AppleAudioPlayer = styled('audio')(audioPlayerStyles);

/**
 * Componente per la registrazione audio con visualizzazione forme d'onda
 * e funzionalità di trascrizione
 */
const AudioRecorder = ({ onRecordingComplete, onTranscribe }) => {
  const theme = useTheme();
  const {
    // Stati
    isRecording,
    isPaused,
    audioSource,
    audioUrl,
    audioLevels,
    isConverting,
    isTranscribing,
    transcriptionStatus,
    transcriptionError,
    transcriptionText,
    transcriptionId,
    recordingDuration,
    currentBlob,
    
    // Funzioni
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    handleAudioSourceChange,
    handleFileUpload,
    handleDownload,
    transcribeAudio,
    formatTime,
    handleTranscriptionChange,
    handleAnalysisChange
  } = useAudioRecorder();

  // Callback per l'upload di file
  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileUpload(file);
        if (onRecordingComplete) {
        onRecordingComplete(file);
      }
    }
  };

  // Callback per avviare la trascrizione
  const handleTranscribeClick = () => {
    transcribeAudio(currentBlob, onTranscribe);
  };

  // Genera le barre delle onde audio
  const waveElements = audioLevels.map((level, i) => (
    <Box 
      key={i}
      sx={audioWaveStyles.barContainer}
    >
    <AudioWave 
      index={i} 
      isActive={isRecording}
      sx={{ 
          ...audioWaveStyles.bar(isRecording, level),
        backgroundColor: isRecording && level > 15 ? theme.palette.primary.main : '#c5c5c7',
        }}
      />
    </Box>
  ));

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: { xs: 1.5, sm: 2, md: 3 },
      width: '100%'
    }}>
      {/* Toggle Button Group per la selezione della sorgente */}
      <Box sx={{ 
        display: 'flex', 
        gap: { xs: 1, sm: 2 }, 
        backgroundColor: '#f5f5f7',
        borderRadius: 4,
        padding: { xs: 0.5, sm: 1 },
        width: '65%',
        justifyContent: 'center',
        flexWrap: { xs: 'wrap', sm: 'nowrap' }
      }}>
        <Button
          variant={audioSource === 'microphone' ? 'contained' : 'text'}
          onClick={() => handleAudioSourceChange('microphone')}
          startIcon={<MicIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.3rem' } }} />}
          sx={{ 
            ...buttonStyles.sourceSelector,
            ...buttonStyles.selected(audioSource === 'microphone')
          }}
        >
          Microfono
        </Button>
        <Button
          variant={audioSource === 'system' ? 'contained' : 'text'}
          onClick={() => handleAudioSourceChange('system')}
          startIcon={<ComputerIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />}
          sx={{ 
            ...buttonStyles.sourceSelector,
            ...buttonStyles.selected(audioSource === 'system')
          }}
        >
          Audio di Sistema
        </Button>
      </Box>

      {/* Visualizzatore onde audio */}
      <Box sx={{ my: { xs: 4, sm: 5 }, width: '100%' }}>
      <AudioWaveContainer>
        {waveElements}
      </AudioWaveContainer>
      </Box>

      {/* Timer della registrazione */}
      {isRecording && (
        <Box sx={timerStyles}>
          <Chip
            icon={<TimerIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />}
            label={formatTime(recordingDuration)}
            color="primary"
            sx={{
              ...timerStyles.chip,
              animation: isPaused ? 'none' : `${pulse} 2s infinite`,
            }}
          />
        </Box>
      )}

      {/* Bottoni di controllo */}
      <Box sx={{ 
        display: 'flex', 
        gap: { xs: 1, sm: 2 }, 
        mt: { xs: 1, sm: 2 },
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <Button
          variant="contained"
          startIcon={isRecording ? <StopIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} /> : <MicIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />}
          onClick={isRecording ? stopRecording : startRecording}
          sx={buttonStyles.base}
        >
          {isRecording ? 'Stop' : 'Registra'}
        </Button>
        {isRecording && (
          <Button
            variant="contained"
            startIcon={isPaused ? <PlayIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} /> : <PauseIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />}
            onClick={isPaused ? resumeRecording : pauseRecording}
            sx={buttonStyles.base}
          >
            {isPaused ? 'Riprendi' : 'Pausa'}
          </Button>
        )}
        {audioUrl && (
          <>
            <Button
              variant="contained"
              onClick={handleDownload}
              sx={buttonStyles.base}
            >
              Scarica MP3
            </Button>
            <Button
              variant="contained"
              startIcon={<TextFieldsIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />}
              onClick={handleTranscribeClick}
              disabled={isTranscribing}
              sx={{ 
                ...buttonStyles.base,
                ...(isTranscribing && buttonStyles.disabled)
              }}
            >
              {isTranscribing ? 'Trascrizione...' : 'Trascrivi'}
            </Button>
          </>
        )}
        <Button
          variant="contained"
          component="label"
          startIcon={<UploadIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />}
          sx={buttonStyles.base}
        >
          Carica File
          <input
            type="file"
            hidden
            accept="audio/*"
            onChange={handleFileInputChange}
          />
        </Button>
      </Box>

      {audioUrl && (
        <Box sx={{ 
          width: '100%', 
          mt: { xs: 1, sm: 2 },
          px: { xs: 1, sm: 2 }
        }}>
          <AppleAudioPlayer src={audioUrl} controls />
        </Box>
      )}

      {/* Aggiungi indicatore di conversione */}
      {isConverting && (
        <Box sx={statusIndicatorStyles.container}>
          <CircularProgress size={{ xs: 14, sm: 16 }} color="primary" />
          <Typography variant="body2" sx={statusIndicatorStyles.text}>
            Conversione in corso...
          </Typography>
        </Box>
      )}

      {isTranscribing && (
        <Box sx={{ 
          mt: { xs: 1, sm: 2 }, 
          textAlign: 'center' 
        }}>
          <CircularProgress size={{ xs: 20, sm: 24 }} sx={{ mr: { xs: 0.5, sm: 1 } }} />
          <Typography variant="body2" color="text.secondary" sx={statusIndicatorStyles.text}>
            {transcriptionStatus}
          </Typography>
        </Box>
      )}

      {transcriptionError && (
        <Box sx={{ 
          mt: { xs: 1, sm: 2 }, 
          textAlign: 'center' 
        }}>
          <Typography variant="body2" color="error" sx={statusIndicatorStyles.text}>
            {transcriptionError}
          </Typography>
        </Box>
      )}

      {/* Visualizzazione trascrizione e analisi */}
      <TranscriptionView 
        text={transcriptionText} 
        loading={isTranscribing}
        error={transcriptionError}
        transcriptionId={transcriptionId}
        onTextChange={handleTranscriptionChange}
        onAnalysisChange={handleAnalysisChange}
      />
    </Box>
  );
};

AudioRecorder.propTypes = {
  /** Callback chiamata quando la registrazione è completata con il blob audio */
  onRecordingComplete: PropTypes.func,
  /** Callback chiamata quando la trascrizione è completata con il testo trascritto */
  onTranscribe: PropTypes.func
};

export default React.memo(AudioRecorder); 