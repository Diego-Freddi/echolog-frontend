import React, { useState, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  TextField, 
  CircularProgress,
  Alert,
  useTheme,
  styled
} from '@mui/material';
import {
  Upload as UploadIcon,
  Description as DescriptionIcon,
  TextFields as TextFieldsIcon,
  Psychology as PsychologyIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import PageContainer from '../components/layout/PageContainer';
import TranscriptionView from '../components/transcription/TranscriptionView';
import { transcriptionService } from '../services/api';

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

// Styling per la zona di drag & drop
const DropZone = styled(Box)(({ theme, isDragActive, hasFile }) => ({
  border: `2px dashed ${isDragActive ? theme.palette.primary.main : hasFile ? theme.palette.success.main : '#ccc'}`,
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(4),
  textAlign: 'center',
  backgroundColor: isDragActive ? 'rgba(240, 44, 86, 0.08)' : hasFile ? 'rgba(76, 175, 80, 0.08)' : theme.palette.background.paper,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  marginBottom: theme.spacing(3),
  '&:hover': {
    backgroundColor: isDragActive ? 'rgba(240, 44, 86, 0.12)' : hasFile ? 'rgba(76, 175, 80, 0.12)' : theme.palette.background.hover,
    borderColor: isDragActive ? theme.palette.primary.main : hasFile ? theme.palette.success.main : theme.palette.primary.light
  }
}));

const TextAnalyzer = () => {
  const theme = useTheme();
  const fileInputRef = useRef(null);
  const [tabValue, setTabValue] = useState(0);
  const [isDragActive, setIsDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [fileProcessing, setFileProcessing] = useState(false);
  const [directText, setDirectText] = useState('');
  const [textProcessing, setTextProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [showTranscriptionView, setShowTranscriptionView] = useState(false);
  const [transcriptionData, setTranscriptionData] = useState({
    text: '',
    transcriptionId: null,
    recordingId: null
  });

  // Gestione del cambio tab
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError(null);
  };

  // Gestione drag & drop
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragActive) {
      setIsDragActive(true);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      handleFileSelected(droppedFile);
    }
  };

  // Gestione selezione file
  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (selectedFile) => {
    const fileName = selectedFile.name.toLowerCase();
    const validExtensions = ['.pdf', '.docx', '.doc', '.txt'];
    const isValidFile = validExtensions.some(ext => fileName.endsWith(ext));
    
    if (!isValidFile) {
      setError(`Formato file non supportato. Formati accettati: PDF, DOCX, DOC, TXT.`);
      return;
    }
    
    setError(null);
    setFile(selectedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setError(null);
  };

  // Gestione input testo diretto
  const handleTextChange = (e) => {
    setDirectText(e.target.value);
  };

  // Funzione per elaborare il file
  const handleProcessFile = async () => {
    if (!file) {
      setError('Seleziona un file da analizzare');
      return;
    }

    try {
      setFileProcessing(true);
      setError(null);
      
      const result = await transcriptionService.transcribeFromFile(file);
      
      setTranscriptionData({
        text: result.transcription,
        transcriptionId: result.transcriptionId,
        recordingId: result.recordingId
      });
      setShowTranscriptionView(true);
    } catch (error) {
      console.error('Errore nell\'elaborazione del file:', error);
      setError(error.message || 'Si è verificato un errore durante l\'elaborazione del file');
    } finally {
      setFileProcessing(false);
    }
  };

  // Funzione per elaborare il testo diretto
  const handleProcessText = async () => {
    if (!directText.trim()) {
      setError('Inserisci del testo da analizzare');
      return;
    }

    try {
      setTextProcessing(true);
      setError(null);
      
      const result = await transcriptionService.transcribeFromText(directText);
      
      setTranscriptionData({
        text: result.transcription,
        transcriptionId: result.transcriptionId,
        recordingId: result.recordingId
      });
      setShowTranscriptionView(true);
    } catch (error) {
      console.error('Errore nell\'elaborazione del testo:', error);
      setError(error.message || 'Si è verificato un errore durante l\'elaborazione del testo');
    } finally {
      setTextProcessing(false);
    }
  };

  // Gestione aggiornamento testo
  const handleTextUpdate = (newText) => {
    setTranscriptionData(prev => ({
      ...prev,
      text: newText
    }));
  };

  if (showTranscriptionView) {
    return (
      <PageContainer>
        <Box sx={{
          width: '100%',
          maxWidth: '800px',
          mx: 'auto',
          p: { xs: 1, sm: 2, md: 3 }
        }}>
          <ApplePaper>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 3,
              pb: 2,
              borderBottom: '1px solid rgba(0,0,0,0.06)'
            }}>
              <Typography variant="h6" sx={{ 
                color: theme.palette.primary.main,
                fontWeight: 600
              }}>
                {file ? file.name : 'Testo analizzato'}
              </Typography>
              
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setShowTranscriptionView(false);
                  setTranscriptionData({
                    text: '',
                    transcriptionId: null,
                    recordingId: null
                  });
                  setFile(null);
                  setDirectText('');
                  setTabValue(0);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                sx={{
                  borderRadius: '12px',
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: 'rgba(240,44,86,0.04)',
                    borderColor: theme.palette.primary.main,
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                Nuova Analisi
              </Button>
            </Box>
            
            <TranscriptionView 
              text={transcriptionData.text}
              transcriptionId={transcriptionData.transcriptionId}
              onTextChange={handleTextUpdate}
            />
          </ApplePaper>
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Box sx={{
        width: { xs: '100%', md: '90%', lg: '800px' },
        maxWidth: '1200px',
        mx: 'auto',
        p: { xs: 2, md: 3 },
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
              mb: 2,
              textAlign: 'center'
            }}
          >
            Text Analyzer
          </Typography>
          
          <Typography 
            variant="subtitle1" 
            color="text.secondary" 
            sx={{ 
              mb: 4, 
              textAlign: 'center' 
            }}
          >
            Analizza testo da file o input diretto senza registrazione audio
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            backgroundColor: theme.palette.background.default,
            borderRadius: 4,
            padding: 1,
            justifyContent: 'center',
            mb: 4,
            mx: 'auto',
            maxWidth: 'fit-content'
          }}>
            <Button
              variant={tabValue === 0 ? 'contained' : 'text'}
              onClick={() => handleTabChange(null, 0)}
              startIcon={<UploadIcon />}
              sx={{ 
                borderRadius: 2,
                backgroundColor: tabValue === 0 ? theme.palette.background.paper : 'transparent',
                color: tabValue === 0 ? theme.palette.text.primary : theme.palette.text.secondary,
                boxShadow: tabValue === 0 ? theme.shadows[1] : 'none',
                transition: 'all 0.2s ease-in-out',
                px: 3,
                py: 1,
                textTransform: 'uppercase',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: tabValue === 0 ? theme.palette.background.paper : theme.palette.action.hover,
                  boxShadow: tabValue === 0 ? theme.shadows[2] : 'none',
                  transform: 'translateY(-1px)'
                }
              }}
            >
              Carica File
            </Button>
            <Button
              variant={tabValue === 1 ? 'contained' : 'text'}
              onClick={() => handleTabChange(null, 1)}
              startIcon={<TextFieldsIcon />}
              sx={{ 
                borderRadius: 2,
                backgroundColor: tabValue === 1 ? theme.palette.background.paper : 'transparent',
                color: tabValue === 1 ? theme.palette.text.primary : theme.palette.text.secondary,
                boxShadow: tabValue === 1 ? theme.shadows[1] : 'none',
                transition: 'all 0.2s ease-in-out',
                px: 3,
                py: 1,
                textTransform: 'uppercase',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: tabValue === 1 ? theme.palette.background.paper : theme.palette.action.hover,
                  boxShadow: tabValue === 1 ? theme.shadows[2] : 'none',
                  transform: 'translateY(-1px)'
                }
              }}
            >
              Input Diretto
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ 
              mb: 3, 
              width: '100%',
              borderRadius: 2
            }}>
              {error}
            </Alert>
          )}

          {/* Tab Carica File */}
          {tabValue === 0 && (
            <Box sx={{ width: '100%' }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ 
                  fontWeight: 600
                }}>
                  Carica un file da analizzare
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Formati supportati: PDF, DOCX, DOC, TXT
                </Typography>
              </Box>
              
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".pdf,.docx,.doc,.txt"
                onChange={handleFileInputChange}
              />
              
              <DropZone
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleFileClick}
                isDragActive={isDragActive}
                hasFile={!!file}
              >
                {file ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <DescriptionIcon color="success" sx={{ fontSize: 48, mb: 2 }} />
                    <Typography variant="body1" gutterBottom fontWeight={500}>
                      {file.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {(file.size / 1024).toFixed(2)} KB
                    </Typography>
                    
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                      <Button
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile();
                        }}
                        color="error"
                        variant="outlined"
                        sx={{ borderRadius: '12px' }}
                      >
                        Rimuovi
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Box>
                    <UploadIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                    <Typography variant="body1" gutterBottom fontWeight={500}>
                      Trascina qui un file o fai click per selezionarlo
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Dimensione massima: 10MB
                    </Typography>
                  </Box>
                )}
              </DropZone>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  disabled={!file || fileProcessing}
                  onClick={handleProcessFile}
                  startIcon={fileProcessing ? <CircularProgress size={20} color="inherit" /> : <PsychologyIcon />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: '12px',
                    background: 'linear-gradient(90deg, #f02c56 0%, #7c32ff 100%)',
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 500,
                    boxShadow: '0 4px 12px rgba(240,44,86,0.2)',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #e02951 0%, #6c2be0 100%)',
                      boxShadow: '0 6px 16px rgba(240,44,86,0.3)',
                      transform: 'translateY(-2px)'
                    },
                    '&:disabled': {
                      background: '#e0e0e0',
                      color: '#a0a0a0'
                    }
                  }}
                >
                  {fileProcessing ? 'Elaborazione in corso...' : 'Estrai e Analizza'}
                </Button>
              </Box>
            </Box>
          )}

          {/* Tab Input Diretto */}
          {tabValue === 1 && (
            <Box sx={{ width: '100%' }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ 
                  fontWeight: 600
                }}>
                  Inserisci il testo da analizzare
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Incolla o scrivi direttamente il testo che desideri analizzare
                </Typography>
              </Box>
              
              <TextField
                multiline
                fullWidth
                value={directText}
                onChange={handleTextChange}
                variant="outlined"
                placeholder="Inserisci qui il testo da analizzare..."
                minRows={10}
                maxRows={15}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                      borderWidth: 1,
                    }
                  }
                }}
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  disabled={!directText.trim() || textProcessing}
                  onClick={handleProcessText}
                  startIcon={textProcessing ? <CircularProgress size={20} color="inherit" /> : <PsychologyIcon />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: '12px',
                    background: 'linear-gradient(90deg, #f02c56 0%, #7c32ff 100%)',
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 500,
                    boxShadow: '0 4px 12px rgba(240,44,86,0.2)',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #e02951 0%, #6c2be0 100%)',
                      boxShadow: '0 6px 16px rgba(240,44,86,0.3)',
                      transform: 'translateY(-2px)'
                    },
                    '&:disabled': {
                      background: '#e0e0e0',
                      color: '#a0a0a0'
                    }
                  }}
                >
                  {textProcessing ? 'Elaborazione in corso...' : 'Analizza Testo'}
                </Button>
              </Box>
            </Box>
          )}
        </ApplePaper>
      </Box>
    </PageContainer>
  );
};

export default TextAnalyzer; 