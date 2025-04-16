import React, { useState, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  CircularProgress,
  Alert,
  useTheme
} from '@mui/material';
import {
  TextFields as TextFieldsIcon,
  Psychology as PsychologyIcon,
  Upload as UploadIcon
} from '@mui/icons-material';
import PageContainer from '../components/layout/PageContainer';
import TranscriptionView from '../components/transcription/TranscriptionView';
import DropZone from '../components/upload/DropZone';
import { transcriptionService } from '../services/api';
import { ApplePaper, containerStyles, pageTitleStyles, pageSubtitleStyles } from '../styles/pageStyles';
import { 
  tabSelectorStyles, 
  processButtonStyles, 
  textInputStyles,
  resultHeaderStyles
} from '../styles/textAnalyzerStyles';
import { BORDERS } from '../styles/themes';

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

  // Funzione per tornare alla modalità di input
  const handleNewAnalysis = () => {
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
            <Box sx={resultHeaderStyles.container}>
              <Typography variant="h6" sx={resultHeaderStyles.title}>
                {file ? file.name : 'Testo analizzato'}
              </Typography>
              
              <Button
                variant="outlined"
                size="small"
                onClick={handleNewAnalysis}
                sx={resultHeaderStyles.newAnalysisButton}
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
      <Box sx={containerStyles}>
        <ApplePaper>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={pageTitleStyles}
          >
            Text Analyzer
          </Typography>
          
          <Typography 
            variant="subtitle1" 
            color="text.secondary" 
            sx={pageSubtitleStyles}
          >
            Analizza testo da file o input diretto senza registrazione audio
          </Typography>

          <Box sx={tabSelectorStyles.container}>
            <Button
              variant={tabValue === 0 ? 'contained' : 'text'}
              onClick={() => handleTabChange(null, 0)}
              startIcon={<UploadIcon />}
              sx={tabSelectorStyles.button(tabValue === 0, theme)}
            >
              Carica File
            </Button>
            <Button
              variant={tabValue === 1 ? 'contained' : 'text'}
              onClick={() => handleTabChange(null, 1)}
              startIcon={<TextFieldsIcon />}
              sx={tabSelectorStyles.button(tabValue === 1, theme)}
            >
              Input Diretto
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ 
              mb: 3, 
              width: '100%',
              borderRadius: BORDERS.radius.sm
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
                file={file}
                onRemoveFile={handleRemoveFile}
                isDragActive={isDragActive}
                acceptedFormats="Dimensione massima: 10MB"
              />
              
              <Box sx={processButtonStyles.container}>
                <Button
                  variant="contained"
                  size="large"
                  disabled={!file || fileProcessing}
                  onClick={handleProcessFile}
                  startIcon={fileProcessing ? <CircularProgress size={20} color="inherit" /> : <PsychologyIcon />}
                  sx={processButtonStyles.button}
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
                sx={textInputStyles.textField}
              />
              
              <Box sx={processButtonStyles.container}>
                <Button
                  variant="contained"
                  size="large"
                  disabled={!directText.trim() || textProcessing}
                  onClick={handleProcessText}
                  startIcon={textProcessing ? <CircularProgress size={20} color="inherit" /> : <PsychologyIcon />}
                  sx={processButtonStyles.button}
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