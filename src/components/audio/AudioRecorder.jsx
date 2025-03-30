import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  IconButton, 
  Typography,
  CircularProgress,
  Button,
  Stack,
  styled,
  keyframes,
  useTheme,
  alpha
} from '@mui/material';
import { 
  Mic as MicIcon, 
  Stop as StopIcon,
  Pause as PauseIcon,
  PlayArrow as PlayIcon,
  Download as DownloadIcon,
  TextFields as TextFieldsIcon,
  Computer as ComputerIcon
} from '@mui/icons-material';
import RecordRTC from 'recordrtc';

// Animazione di pulsazione per il microfono attivo
const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(240, 44, 86, 0.7);
    transform: scale(1);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(240, 44, 86, 0);
    transform: scale(1.05);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(240, 44, 86, 0);
    transform: scale(1);
  }
`;

// Animazione per l'onda sonora
const wave = keyframes`
  0% { height: 5px; }
  50% { height: 20px; }
  100% { height: 5px; }
`;

// Visualizzatore di onde audio
const AudioWaveContainer = styled(Box)({
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  height: 50,
  width: '100%',
  margin: '16px 0',
  gap: 3,
});

// Visualizzatore onde audio
const AudioWave = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isActive' && prop !== 'index'
})(({ isActive, index }) => ({
  width: 4,
  height: 5,
  margin: '0 1px',
  borderRadius: 4,
  backgroundColor: '#f02c56',
  transition: isActive ? 'height 0.1s ease-in-out' : 'height 0.5s ease-out',
}));

// Audio Player stilizzato
const AppleAudioPlayer = styled('audio')({
  width: '100%',
  borderRadius: 8,
  height: 40,
  '&::-webkit-media-controls-panel': {
    backgroundColor: '#f5f5f7',
    borderRadius: 8,
  },
  '&::-webkit-media-controls-play-button': {
    backgroundColor: '#f02c56',
    borderRadius: '50%',
    color: 'white',
  },
  '&::-webkit-media-controls-timeline': {
    backgroundColor: '#e5e5e7',
    borderRadius: 4,
    height: 4,
  },
});

const AudioRecorder = ({ onRecordingComplete, onTranscribe }) => {
  const theme = useTheme();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(null);
  const [hasRecording, setHasRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [audioLevels, setAudioLevels] = useState(new Array(20).fill(0));
  
  const recorderRef = useRef(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const currentBlobRef = useRef(null);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationFrameRef = useRef(null);
  const visualizerIntervalRef = useRef(null);
  const audioPlayerRef = useRef(null);

  // Effetto per l'analisi audio in tempo reale
  useEffect(() => {
    if (isRecording) {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }

      if (streamRef.current && audioContextRef.current) {
        const audioContext = audioContextRef.current;
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(streamRef.current);
        source.connect(analyser);
        
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.7;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        analyserRef.current = analyser;
        dataArrayRef.current = dataArray;
        
        visualizerIntervalRef.current = setInterval(() => {
          if (analyserRef.current && dataArrayRef.current) {
            analyserRef.current.getByteFrequencyData(dataArrayRef.current);
            
            const numBars = 20;
            const newLevels = [];
            
            for (let i = 0; i < numBars; i++) {
              const startIndex = Math.floor(i * dataArrayRef.current.length / numBars);
              const endIndex = Math.floor((i + 1) * dataArrayRef.current.length / numBars);
              let sum = 0;
              
              for (let j = startIndex; j < endIndex; j++) {
                sum += dataArrayRef.current[j];
              }
              
              const avg = sum / (endIndex - startIndex) / 255;
              const variance = 1 + 0.2 * Math.sin(i / numBars * Math.PI);
              const randomFactor = 1 + (Math.random() * 0.1 - 0.05);
              const level = 3 + Math.pow(avg * variance * randomFactor, 0.8) * 37;
              
              newLevels.push(level);
            }
            
            setAudioLevels(newLevels);
          }
        }, 50);
      }
    }
    
    return () => {
      if (visualizerIntervalRef.current) {
        clearInterval(visualizerIntervalRef.current);
      }
    };
  }, [isRecording]);

  useEffect(() => {
    return () => {
      if (recorderRef.current) {
        recorderRef.current.stopRecording(() => {
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
          }
        });
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (visualizerIntervalRef.current) {
        clearInterval(visualizerIntervalRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      streamRef.current = stream;
      
      // Configura RecordRTC come nell'esempio
      const options = {
        type: 'audio',
        mimeType: 'audio/mp3',
        recorderType: RecordRTC.StereoAudioRecorder,
        numberOfAudioChannels: 1,
        desiredSampRate: 16000,
        disableLogs: true
      };
      
      recorderRef.current = new RecordRTC(stream, options);
      recorderRef.current.startRecording();
      
      setIsRecording(true);
      startTimeRef.current = Date.now();
      
      timerRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    } catch (err) {
      setError('Errore nell\'accesso al microfono. Assicurati di aver dato i permessi necessari.');
      console.error('Errore nella registrazione:', err);
    }
  };

  const pauseRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.pauseRecording();
      setIsPaused(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const resumeRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.resumeRecording();
      setIsPaused(false);
      startTimeRef.current = Date.now() - (duration * 1000);
      timerRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.stopRecording(() => {
        const blob = recorderRef.current.getBlob();
        currentBlobRef.current = blob;
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setHasRecording(true);
        
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        
        setIsRecording(false);
        setIsPaused(false);
        setDuration(0);
        
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      });
    }
  };

  const handleTranscribe = async () => {
    if (!currentBlobRef.current) return;
    
    setIsProcessing(true);
    try {
      await onTranscribe(currentBlobRef.current);
    } catch (err) {
      setError('Errore durante la trascrizione');
      console.error('Errore nella trascrizione:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!currentBlobRef.current) return;
    
    try {
      // Usa il metodo save di RecordRTC come nell'esempio
      recorderRef.current.save(`registrazione_${new Date().toISOString().replace(/[:.]/g, '-')}.mp3`);
    } catch (err) {
      setError('Errore nel download del file audio');
      console.error('Errore nel download:', err);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Genera le barre delle onde audio
  const waveElements = audioLevels.map((level, i) => (
    <AudioWave 
      key={i} 
      index={i} 
      isActive={isRecording}
      sx={{ 
        height: `${isRecording ? level : 3}px`,
        opacity: isRecording ? (level > 5 ? 1 : 0.7) : 0.3,
        backgroundColor: isRecording && level > 15 ? theme.palette.primary.main : '#c5c5c7',
        transition: 'height 0.1s ease-in-out, opacity 0.2s ease, background-color 0.3s ease'
      }}
    />
  ));

  return (
    <>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        {!isRecording ? (
          <IconButton
            color="primary"
            onClick={startRecording}
            sx={{ 
              width: 80, 
              height: 80,
              mb: 2,
              '& .MuiSvgIcon-root': { fontSize: 40 },
              animation: isRecording ? `${pulse} 2s infinite` : 'none'
            }}
          >
            <MicIcon />
          </IconButton>
        ) : (
          <>
            {isPaused ? (
              <IconButton
                color="primary"
                onClick={resumeRecording}
                sx={{ 
                  width: 80, 
                  height: 80,
                  mb: 2,
                  '& .MuiSvgIcon-root': { fontSize: 40 }
                }}
              >
                <PlayIcon />
              </IconButton>
            ) : (
              <IconButton
                color="primary"
                onClick={pauseRecording}
                sx={{ 
                  width: 80, 
                  height: 80,
                  mb: 2,
                  '& .MuiSvgIcon-root': { fontSize: 40 }
                }}
              >
                <PauseIcon />
              </IconButton>
            )}
            <IconButton
              color="error"
              onClick={stopRecording}
              sx={{ 
                width: 80, 
                height: 80,
                mb: 2,
                '& .MuiSvgIcon-root': { fontSize: 40 }
              }}
            >
              <StopIcon />
            </IconButton>
          </>
        )}

        {/* Visualizzatore onde audio */}
        {isRecording && (
          <>
            <AudioWaveContainer>
              {waveElements}
            </AudioWaveContainer>
            <Typography variant="h4">
              {formatDuration(duration)}
            </Typography>
          </>
        )}

        {hasRecording && !isRecording && (
          <Box sx={{ 
            width: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            gap: 2
          }}>
            <Box sx={{ 
              width: '100%', 
              borderRadius: 2, 
              overflow: 'hidden',
              backgroundColor: alpha(theme.palette.background.paper, 0.5),
              backdropFilter: 'blur(10px)',
              padding: 1
            }}>
              <AppleAudioPlayer 
                ref={audioPlayerRef}
                src={audioUrl} 
                controls 
              />
            </Box>
            
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="primary"
                startIcon={isProcessing ? <CircularProgress size={20} /> : <TextFieldsIcon />}
                onClick={handleTranscribe}
                disabled={isProcessing}
              >
                {isProcessing ? 'Trascrizione in corso...' : 'Trascrivi'}
              </Button>
              <Button
                variant="outlined"
                color="primary"
                startIcon={isProcessing ? <CircularProgress size={20} /> : <DownloadIcon />}
                onClick={handleDownload}
                disabled={isProcessing}
              >
                {isProcessing ? 'Download in corso...' : 'Download Audio'}
              </Button>
            </Stack>
          </Box>
        )}
      </Box>
    </>
  );
};

export default AudioRecorder; 