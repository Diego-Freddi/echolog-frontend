import { useState, useRef, useEffect, useCallback } from 'react';
import RecordRTC from 'recordrtc';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { transcriptionService } from '../services/api';

/**
 * Hook personalizzato per gestire la registrazione audio
 * Incapsula tutta la logica di registrazione, processing e trascrizione audio
 */
export function useAudioRecorder() {
  // Stati
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
  const [transcriptionId, setTranscriptionId] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [analysis, setAnalysis] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  
  // Refs
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const visualizerIntervalRef = useRef(null);
  const currentBlobRef = useRef(null);
  const ffmpegRef = useRef(null);
  const timerIntervalRef = useRef(null);

  // Formatta il tempo da secondi a mm:ss
  const formatTime = useCallback((seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  // Cleanup delle risorse
  const cleanup = useCallback(() => {
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

    // Ferma il timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
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
  }, [audioUrl]);

    // Converte un file in MP3
    const convertToMP3 = useCallback(async (file) => {
      try {
        setIsConverting(true);
        
        if (!ffmpegRef.current) {
          throw new Error('FFmpeg non inizializzato');
        }
        
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
        console.log('✅ Blob assegnato in convertToMP3:', currentBlobRef.current);
        setAudioUrl(url);
        
        setIsConverting(false);
        return mp3Blob;
      } catch (error) {
        console.error('Errore nella conversione:', error);
        setIsConverting(false);
        setTranscriptionError('Errore nella conversione del file audio');
        throw error;
      }
    }, [audioUrl]);
  

  // Inizializza FFmpeg
  useEffect(() => {
    const initFFmpeg = async () => {
      try {
        const ffmpeg = new FFmpeg();
        await ffmpeg.load();
        ffmpegRef.current = ffmpeg;
      } catch (error) {
        console.error('Errore inizializzazione FFmpeg:', error);
      }
    };
    initFFmpeg();
  }, []);

  // Cleanup quando il componente viene smontato
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  // Cleanup quando cambia l'audioUrl
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  // Gestione audioLevels durante la registrazione
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
  }, [isRecording, streamRef.current, audioContextRef.current]);

  // Timer per la durata della registrazione
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isRecording, isPaused]);

  // Cambia la sorgente audio (microfono o sistema)
  const handleAudioSourceChange = useCallback((newSource) => {
    if (newSource !== null) {
      setAudioSource(newSource);
    }
  }, []);

  // Avvia la registrazione
  const startRecording = useCallback(async () => {
    // Reset della durata della registrazione
    setRecordingDuration(0);
    
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
      setTranscriptionError('Impossibile accedere al dispositivo audio');
    }
  }, [audioSource]);

  // Arresta la registrazione
  const stopRecording = useCallback(() => {
    if (recorderRef.current) {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }

      recorderRef.current.stopRecording(async () => {
        try {
          const originalBlob = recorderRef.current.getBlob();
          console.log('🎙️ Blob originale:', originalBlob);
          console.log('Dimensione blob originale:', originalBlob.size, 'bytes');

          // Verifica il MIME type del blob
          console.log('MIME type blob originale:', originalBlob.type);

          const mp3Blob = await convertToMP3(originalBlob);
          console.log('🎧 Blob MP3 pronto:', mp3Blob);
          console.log('Dimensione blob convertito:', mp3Blob.size, 'bytes');
          console.log('MIME type blob convertito:', mp3Blob.type);

          // Assegna esplicitamente il blob alla ref e allo stato
          currentBlobRef.current = mp3Blob;
          setAudioBlob(mp3Blob);
          console.log('Blob assegnato a currentBlobRef:', currentBlobRef.current);
          
          // Crea URL e aggiorna lo stato
          const url = URL.createObjectURL(mp3Blob);
          setAudioUrl(url);
          
          // Test immediato per verificare che il blob sia disponibile
          if (currentBlobRef.current) {
            console.log('✅ currentBlobRef.current è disponibile dopo la conversione');
          } else {
            console.error('❌ currentBlobRef.current è null/undefined dopo la conversione');
          }
        } catch (e) {
          console.error('❌ Errore nella conversione a MP3:', e);
        } finally {
          setIsRecording(false);
          setIsPaused(false);
        }
      });
    }
  }, [convertToMP3]);

  // Pausa la registrazione
  const pauseRecording = useCallback(() => {
    if (recorderRef.current) {
      recorderRef.current.pauseRecording();
      setIsPaused(true);
    }
  }, []);

  // Riprende la registrazione
  const resumeRecording = useCallback(() => {
    if (recorderRef.current) {
      recorderRef.current.resumeRecording();
      setIsPaused(false);
    }
  }, []);

  // Gestisce l'upload di un file audio
  const handleFileUpload = useCallback(async (file) => {
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
        setAudioBlob(processedBlob);
        
        console.log('File caricato:', processedBlob.type, processedBlob.size, 'bytes');
        
        const url = URL.createObjectURL(processedBlob);
        setAudioUrl(url);
      } catch (error) {
        console.error('Errore nel processamento del file:', error);
        setTranscriptionError('Errore nell\'elaborazione del file audio');
      }
    }
  }, [convertToMP3]);


  // Scarica l'audio registrato utilizzando un metodo alternativo
  const handleDownload = useCallback(() => {
    // Usiamo prima lo stato, poi il ref come fallback
    const blobToDownload = audioBlob || currentBlobRef.current;
    
    if (!blobToDownload) {
      console.error('Nessun blob disponibile per il download', { 
        stateBlob: !!audioBlob, 
        refBlob: !!currentBlobRef.current 
      });
      return;
    }
    
    console.log('Download in corso, dimensione blob:', blobToDownload.size, 'bytes');
    
    try {
      // Approccio semplificato e diretto
      const fileName = `registrazione_${new Date().toISOString().replace(/[:.]/g, '-')}.mp3`;
      const url = URL.createObjectURL(blobToDownload);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      
      console.log('Avvio download...');
      link.click();
      
      // Pulizia con tempistiche più lunghe
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        console.log('Pulizia URL completata');
      }, 500);
    } catch (err) {
      console.error('Errore nel download:', err);
      setTranscriptionError('Impossibile scaricare il file audio');
    }
  }, [audioBlob]);

  // Trascrivi l'audio
  const transcribeAudio = useCallback(async (audioBlob, onTranscribe) => {
    if (!audioBlob) {
      setTranscriptionError('Nessun audio da trascrivere');
      return;
    }
    
    try {
      setIsTranscribing(true);
      setTranscriptionStatus('Inizio trascrizione...');
      setTranscriptionError(null);
      setTranscriptionText('');
      setTranscriptionId(null);

      const response = await transcriptionService.transcribe(audioBlob);

      if (!response.operationId) {
        throw new Error('Nessun ID operazione ricevuto dal server');
      }

      setTranscriptionStatus('Trascrizione in corso...');

      // Polling dello stato della trascrizione
      const checkStatus = async () => {
        try {
          // Verifica che recordingId sia disponibile
          if (!response.recordingId) {
            throw new Error('recordingId non disponibile');
          }
          
          const statusResponse = await transcriptionService.checkStatus(
            response.operationId, 
            response.recordingId
          );
          
          if (statusResponse.status === 'completed') {
            setTranscriptionStatus('Trascrizione completata!');
            setIsTranscribing(false);
            setTranscriptionText(statusResponse.transcription);
            
            if (statusResponse.transcriptionId) {
              setTranscriptionId(statusResponse.transcriptionId);
            }
            
            if (statusResponse.audioFilename) {
              localStorage.setItem(`audioFile_${statusResponse.transcriptionId}`, statusResponse.audioFilename);
            }
            
            if (onTranscribe) {
              onTranscribe(statusResponse.transcription);
            }
            return;
          } 
          
          if (statusResponse.status === 'failed') {
            throw new Error(statusResponse.error || 'Errore durante la trascrizione');
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
  }, []);

  // Gestisce la modifica della trascrizione
  const handleTranscriptionChange = useCallback((updatedText) => {
    setTranscriptionText(updatedText);
  }, []);
  
  // Gestisce la modifica dell'analisi
  const handleAnalysisChange = useCallback((updatedAnalysis) => {
    setAnalysis(updatedAnalysis);
  }, []);

  // Restituisce tutte le funzionalità e gli stati necessari
  return {
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
    analysis,
    currentBlob: audioBlob || currentBlobRef.current,
    
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
  };
} 