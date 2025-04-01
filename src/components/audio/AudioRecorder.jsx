import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Button,
  styled,
  keyframes,
  useTheme,
  CircularProgress,
  Typography
} from '@mui/material';
import { 
  Mic as MicIcon, 
  Stop as StopIcon,
  Pause as PauseIcon,
  PlayArrow as PlayIcon,
  Upload as UploadIcon,
  TextFields as TextFieldsIcon,
  Computer as ComputerIcon
} from '@mui/icons-material';
import RecordRTC from 'recordrtc';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import axios from 'axios';

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

// Contenitore per il visualizzatore di onde audio
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
  const [audioSource, setAudioSource] = useState('microphone'); // 'microphone' o 'system'
  const [audioUrl, setAudioUrl] = useState('');
  const [audioLevels, setAudioLevels] = useState(new Array(20).fill(0));
  const [isConverting, setIsConverting] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionStatus, setTranscriptionStatus] = useState('');
  const [transcriptionError, setTranscriptionError] = useState(null);
  const [transcriptionText, setTranscriptionText] = useState('');
  
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const visualizerIntervalRef = useRef(null);
  const currentBlobRef = useRef(null);
  const ffmpegRef = useRef(null);

  // Cleanup delle risorse quando il componente viene smontato
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  // Cleanup quando cambia l'audioUrl
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

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

  // Inizializza FFmpeg
  useEffect(() => {
    const initFFmpeg = async () => {
      const ffmpeg = new FFmpeg();
      await ffmpeg.load();
      ffmpegRef.current = ffmpeg;
    };
    initFFmpeg();
  }, []);

  const cleanup = () => {
    // Ferma la registrazione se attiva
    if (recorderRef.current) {
      recorderRef.current.stopRecording(() => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      });
    }

    // Pulisci l'audio context
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }

    // Ferma l'analizzatore
    if (visualizerIntervalRef.current) {
      clearInterval(visualizerIntervalRef.current);
    }

    // Revoca gli URL dei blob
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl('');
    }

    // Reset dei riferimenti
    recorderRef.current = null;
    streamRef.current = null;
    audioContextRef.current = null;
    analyserRef.current = null;
    dataArrayRef.current = null;
    currentBlobRef.current = null;
  };

  const handleAudioSourceChange = (event, newSource) => {
    if (newSource !== null) {
      setAudioSource(newSource);
    }
  };

  const startRecording = async () => {
    try {
      let stream;
      if (audioSource === 'microphone') {
        stream = await navigator.mediaDevices.getUserMedia({ 
          audio: { 
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          } 
        });
      } else {
        stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
      }
      
      streamRef.current = stream;
      
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
    } catch (err) {
      console.error('Errore nella registrazione:', err);
    }
  };

  const transcribeAudio = async (audioBlob) => {
    try {
      setIsTranscribing(true);
      setTranscriptionStatus('Inizio trascrizione...');
      setTranscriptionError(null);
      setTranscriptionText('');

      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.mp3');

      const response = await axios.post('http://localhost:5050/api/transcribe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setTranscriptionStatus(`Upload in corso: ${percentCompleted}%`);
        }
      });

      if (!response.data.operationId) {
        throw new Error('Nessun ID operazione ricevuto dal server');
      }

      console.log('OperationId ricevuto:', response.data.operationId);
      setTranscriptionStatus('Trascrizione in corso...');

      // Polling dello stato della trascrizione
      const checkStatus = async () => {
        try {
          console.log('Controllo stato trascrizione...');
          const statusResponse = await axios.get(`http://localhost:5050/api/transcribe/status/${response.data.operationId}`);
          console.log('Risposta stato:', statusResponse.data);
          
          if (statusResponse.data.status === 'completed') {
            setTranscriptionStatus('Trascrizione completata!');
            setIsTranscribing(false);
            setTranscriptionText(statusResponse.data.transcription);
            if (onTranscribe) {
              onTranscribe(statusResponse.data.transcription);
            }
            return;
          } 
          
          if (statusResponse.data.status === 'failed') {
            throw new Error(statusResponse.data.error || 'Errore durante la trascrizione');
          }

          // Aggiorna lo stato con il progresso
          setTranscriptionStatus('Trascrizione in corso...');
          
          // Continua il polling
          setTimeout(checkStatus, 2000);
        } catch (error) {
          console.error('Errore nel controllo stato:', error);
          throw error;
        }
      };

      await checkStatus();
    } catch (error) {
      console.error('Errore completo:', error);
      setTranscriptionError(error.response?.data?.error || error.message || 'Errore durante la trascrizione');
      setTranscriptionStatus('Errore durante la trascrizione');
      setIsTranscribing(false);
    }
  };

  const stopRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.stopRecording(() => {
        const blob = recorderRef.current.getBlob();
        currentBlobRef.current = blob;
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setIsRecording(false);
        setIsPaused(false);
        
        if (onRecordingComplete) {
          onRecordingComplete(blob);
        }
      });
    }
  };

  const convertToMP3 = async (file) => {
    try {
      setIsConverting(true);
      const ffmpeg = ffmpegRef.current;
      
      // Scrivi il file di input
      await ffmpeg.writeFile('input.mp4', await fetchFile(file));
      
      // Esegui la conversione
      await ffmpeg.exec([
        '-i', 'input.mp4',
        '-acodec', 'libmp3lame',
        '-ab', '128k',
        'output.mp3'
      ]);
      
      // Leggi il file convertito
      const data = await ffmpeg.readFile('output.mp3');
      
      // Crea un nuovo Blob
      const mp3Blob = new Blob([data], { type: 'audio/mp3' });
      
      // Revoca l'URL precedente se esiste
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      
      // Crea un nuovo URL per il blob
      const url = URL.createObjectURL(mp3Blob);
      currentBlobRef.current = mp3Blob;
      setAudioUrl(url);
      
      setIsConverting(false);
      return mp3Blob;
    } catch (error) {
      console.error('Errore nella conversione:', error);
      setIsConverting(false);
      throw error;
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        let processedBlob;
        
        // Se il file è MP4, convertilo in MP3
        if (file.type === 'video/mp4' || file.type === 'audio/mp4') {
          processedBlob = await convertToMP3(file);
        } else {
          // Per altri formati, usa il file direttamente
          processedBlob = file;
        }
        
        // Imposta il blob corrente e l'URL audio
        currentBlobRef.current = processedBlob;
        const url = URL.createObjectURL(processedBlob);
        setAudioUrl(url);
        
        // Se c'è una callback onRecordingComplete, chiamala con il blob
        if (onRecordingComplete) {
          onRecordingComplete(processedBlob);
        }
      } catch (error) {
        console.error('Errore nel processamento del file:', error);
      }
    }
  };

  const handleDownload = () => {
    if (!currentBlobRef.current) return;
    try {
      // Crea un URL temporaneo per il download
      const downloadUrl = URL.createObjectURL(currentBlobRef.current);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `registrazione_${new Date().toISOString().replace(/[:.]/g, '-')}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Revoca l'URL temporaneo dopo il download
      setTimeout(() => {
        URL.revokeObjectURL(downloadUrl);
      }, 100);
    } catch (err) {
      console.error('Errore nel download:', err);
    }
  };

  const pauseRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.pauseRecording();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.resumeRecording();
      setIsPaused(false);
    }
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
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
      {/* Toggle Button Group per la selezione della sorgente */}
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        backgroundColor: '#f5f5f7',
        borderRadius: 4,
        padding: 1
      }}>
        <Button
          variant={audioSource === 'microphone' ? 'contained' : 'text'}
          onClick={() => handleAudioSourceChange(null, 'microphone')}
          startIcon={<MicIcon />}
          sx={{ 
            borderRadius: 2,
            backgroundColor: audioSource === 'microphone' ? '#ffffff' : 'transparent',
            color: audioSource === 'microphone' ? '#000000' : '#666666',
            boxShadow: audioSource === 'microphone' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: audioSource === 'microphone' ? '#ffffff' : 'rgba(0,0,0,0.04)',
              boxShadow: audioSource === 'microphone' ? '0 4px 8px rgba(0,0,0,0.05)' : 'none',
              transform: 'translateY(-1px)'
            }
          }}
        >
          Microfono
        </Button>
        <Button
          variant={audioSource === 'system' ? 'contained' : 'text'}
          onClick={() => handleAudioSourceChange(null, 'system')}
          startIcon={<ComputerIcon />}
          sx={{ 
            borderRadius: 2,
            backgroundColor: audioSource === 'system' ? '#ffffff' : 'transparent',
            color: audioSource === 'system' ? '#000000' : '#666666',
            boxShadow: audioSource === 'system' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: audioSource === 'system' ? '#ffffff' : 'rgba(0,0,0,0.04)',
              boxShadow: audioSource === 'system' ? '0 4px 8px rgba(0,0,0,0.05)' : 'none',
              transform: 'translateY(-1px)'
            }
          }}
        >
          Audio di Sistema
        </Button>
      </Box>

      {/* Visualizzatore onde audio */}
      <AudioWaveContainer>
        {waveElements}
      </AudioWaveContainer>

      {/* Bottoni di controllo */}
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button
          variant="contained"
          startIcon={isRecording ? <StopIcon /> : <MicIcon />}
          onClick={isRecording ? stopRecording : startRecording}
          sx={{ 
            borderRadius: 2,
            backgroundColor: '#f5f5f7',
            color: '#000000',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: '#e5e5e7',
              boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
              transform: 'translateY(-1px)'
            }
          }}
        >
          {isRecording ? 'Stop' : 'Registra'}
        </Button>
        {isRecording && (
          <Button
            variant="contained"
            startIcon={isPaused ? <PlayIcon /> : <PauseIcon />}
            onClick={isPaused ? resumeRecording : pauseRecording}
            sx={{ 
              borderRadius: 2,
              backgroundColor: '#f5f5f7',
              color: '#000000',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: '#e5e5e7',
                boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
                transform: 'translateY(-1px)'
              }
            }}
          >
            {isPaused ? 'Riprendi' : 'Pausa'}
          </Button>
        )}
        {audioUrl && (
          <>
            <Button
              variant="contained"
              onClick={handleDownload}
              sx={{ 
                borderRadius: 2,
                backgroundColor: '#f5f5f7',
                color: '#000000',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: '#e5e5e7',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
                  transform: 'translateY(-1px)'
                }
              }}
            >
              Scarica MP3
            </Button>
            <Button
              variant="contained"
              startIcon={<TextFieldsIcon />}
              onClick={() => transcribeAudio(currentBlobRef.current)}
              disabled={isTranscribing}
              sx={{ 
                borderRadius: 2,
                backgroundColor: '#f5f5f7',
                color: '#000000',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: '#e5e5e7',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
                  transform: 'translateY(-1px)'
                }
              }}
            >
              {isTranscribing ? 'Trascrizione...' : 'Trascrivi'}
            </Button>
          </>
        )}
        <Button
          variant="contained"
          component="label"
          startIcon={<UploadIcon />}
          sx={{ 
            borderRadius: 2,
            backgroundColor: '#f5f5f7',
            color: '#000000',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: '#e5e5e7',
              boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
              transform: 'translateY(-1px)'
            }
          }}
        >
          Carica File
          <input
            type="file"
            hidden
            accept="audio/*"
            onChange={handleFileUpload}
          />
        </Button>
      </Box>

      {audioUrl && (
        <Box sx={{ width: '100%', mt: 2 }}>
          <AppleAudioPlayer 
            src={audioUrl} 
            controls 
          />
        </Box>
      )}

      {/* Aggiungi indicatore di conversione */}
      {isConverting && (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          color: theme.palette.primary.main,
          mt: 1
        }}>
          <CircularProgress size={16} />
          <Typography variant="body2">
            Conversione in corso...
          </Typography>
        </Box>
      )}

      {isTranscribing && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <CircularProgress size={24} sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {transcriptionStatus}
          </Typography>
        </Box>
      )}

      {transcriptionError && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="error">
            {transcriptionError}
          </Typography>
        </Box>
      )}

      {transcriptionText && (
        <Box 
          sx={{ 
            width: '100%', 
            mt: 3, 
            p: 3, 
            backgroundColor: '#f5f5f7',
            borderRadius: 2,
            border: '1px solid rgba(0,0,0,0.1)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main }}>
            Trascrizione
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
            {transcriptionText}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default AudioRecorder; 