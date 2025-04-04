import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Tab, 
  Tabs, 
  CircularProgress,
  Button,
  Switch,
  FormControlLabel,
  Tooltip,
  useTheme,
  TextField,
  IconButton
} from '@mui/material';
import { 
  TextFields as TextFieldsIcon,
  Psychology as PsychologyIcon,
  Highlight as HighlightIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { analysisService } from '../../services/api';
import AnalysisView from '../analysis/AnalysisView';

// Componente TabPanel per gestire il contenuto delle tab
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

/**
 * Visualizza la trascrizione e l'analisi rispettando lo stile originale
 */
const TranscriptionView = ({ text, loading, error, transcriptionId, onTextChange, onAnalysisChange }) => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [analysis, setAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);
  const [highlightKeywords, setHighlightKeywords] = useState(false);
  const [processedText, setProcessedText] = useState('');
  
  // Stati per la modifica della trascrizione
  const [isEditing, setIsEditing] = useState(false);
  const [editableText, setEditableText] = useState('');
  const [shouldReanalyze, setShouldReanalyze] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    
    // Se l'utente passa alla tab di analisi e non c'è già un'analisi, la eseguiamo
    if (newValue === 1 && !analysis && !analysisLoading && text) {
      performAnalysis();
    }
  };

  const performAnalysis = async (textOverride, forceReanalysis = false) => {
    try {
      // Usa il testo fornito o quello della prop
      const textToAnalyze = textOverride || text;
      
      // Verifica che ci sia del testo
      if (!textToAnalyze || textToAnalyze.trim() === '') {
        setAnalysisError('Nessun testo da analizzare.');
        return;
      }

      // Verifica che ci sia un ID trascrizione
      if (!transcriptionId) {
        setAnalysisError('ID trascrizione mancante, impossibile procedere con l\'analisi.');
        return;
      }

      setAnalysisLoading(true);
      setAnalysisError(null);
      
      // Recupera il nome del file audio dal localStorage
      const audioFilename = localStorage.getItem(`audioFile_${transcriptionId}`);
      
      // Esegui l'analisi
      const result = await analysisService.analyze({
        text: textToAnalyze,
        transcriptionId: transcriptionId,
        audioFilename: audioFilename, // Passa il nome del file audio
        forceReanalysis: forceReanalysis // Indica se forzare la rianalisi
      });
      
      console.log('Analisi completata:', result);
      if (result) {
        setAnalysis(result);
        if (onAnalysisChange) {
          onAnalysisChange(result);
        }
      }
    } catch (error) {
      console.error('Errore durante l\'analisi:', error);
      setAnalysisError(error.response?.data?.error || error.message || 'Errore durante l\'analisi.');
    } finally {
      setAnalysisLoading(false);
    }
  };

  // Funzione per entrare in modalità modifica
  const handleEditStart = () => {
    setIsEditing(true);
    setEditableText(text);
  };

  // Funzione per salvare le modifiche
  const handleSave = () => {
    if (typeof onTextChange === 'function') {
      onTextChange(editableText);
    }
    
    setIsEditing(false);
    
    // Se l'analisi è già stata eseguita, chiedi se rianalizzare
    if (analysis) {
      setShouldReanalyze(true);
    }
  };

  // Funzione per annullare le modifiche
  const handleCancel = () => {
    setIsEditing(false);
    setEditableText(text);
  };

  // Funzione per rianalizzare il testo modificato
  const handleReanalyze = () => {
    performAnalysis(editableText, true);
    setShouldReanalyze(false);
  };

  // Effetto per evidenziare le parole chiave quando cambia l'analisi o l'opzione di evidenziazione
  useEffect(() => {
    if (text && analysis && analysis.keywords && highlightKeywords) {
      let htmlContent = text;
      
      // Ordina le parole chiave per lunghezza (discendente) per evitare sostituzioni parziali
      const sortedKeywords = [...analysis.keywords].sort((a, b) => b.length - a.length);
      
      // Crea espressioni regolari per ogni parola chiave, ignorando maiuscole/minuscole
      sortedKeywords.forEach(keyword => {
        const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
        htmlContent = htmlContent.replace(regex, '<mark style="background-color: rgba(240, 44, 86, 0.2); padding: 0 4px; border-radius: 2px;">$1</mark>');
      });
      
      setProcessedText(htmlContent);
    } else {
      setProcessedText(text || '');
    }
  }, [text, analysis, highlightKeywords]);

  // Se non c'è testo, non mostrare nulla
  if (!text && !loading) return null;

  return (
    <Box 
      sx={{ 
        width: '100%', 
        mt: 3, 
        backgroundColor: '#f5f5f7',
        borderRadius: 2,
        border: '1px solid rgba(0,0,0,0.1)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        overflow: 'hidden'
      }}
    >
      <Tabs 
        value={tabValue} 
        onChange={handleTabChange}
        sx={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid rgba(0,0,0,0.1)',
          '& .MuiTabs-indicator': {
            backgroundColor: theme.palette.primary.main,
          }
        }}
      >
        <Tab 
          icon={<TextFieldsIcon />} 
          label="Trascrizione" 
          sx={{ 
            textTransform: 'none',
            fontWeight: 500,
            '&.Mui-selected': {
              color: theme.palette.primary.main,
            }
          }}
        />
        <Tab 
          icon={<PsychologyIcon />} 
          label="Analisi"
          disabled={!text || loading || isEditing}
          sx={{ 
            textTransform: 'none',
            fontWeight: 500,
            '&.Mui-selected': {
              color: theme.palette.primary.main,
            }
          }}
        />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : error ? (
          <Typography variant="body1" color="error" sx={{ p: 2 }}>
            {error}
          </Typography>
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
                Trascrizione
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {!isEditing && analysis && (
                  <Tooltip title="Evidenzia parole chiave nel testo">
                    <FormControlLabel
                      control={
                        <Switch
                          checked={highlightKeywords}
                          onChange={(e) => setHighlightKeywords(e.target.checked)}
                          color="primary"
                          size="small"
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <HighlightIcon fontSize="small" color={highlightKeywords ? 'primary' : 'action'} />
                          <Typography variant="body2">Evidenzia</Typography>
                        </Box>
                      }
                    />
                  </Tooltip>
                )}
                
                {isEditing ? (
                  <>
                    <Tooltip title="Salva modifiche">
                      <IconButton 
                        onClick={handleSave}
                        color="primary"
                        size="small"
                      >
                        <SaveIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Annulla modifiche">
                      <IconButton 
                        onClick={handleCancel}
                        color="default"
                        size="small"
                      >
                        <CancelIcon />
                      </IconButton>
                    </Tooltip>
                  </>
                ) : (
                  <Tooltip title="Modifica trascrizione">
                    <IconButton 
                      onClick={handleEditStart}
                      color="default"
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Box>
            
            {isEditing ? (
              <TextField
                multiline
                fullWidth
                value={editableText}
                onChange={(e) => setEditableText(e.target.value)}
                variant="outlined"
                minRows={10}
                maxRows={20}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#ffffff',
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
            ) : (
              <Typography 
                variant="body1" 
                sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}
                dangerouslySetInnerHTML={{ __html: processedText }}
              />
            )}

            {/* Mostra banner per chiedere se rianalizzare dopo la modifica */}
            {shouldReanalyze && (
              <Box sx={{ 
                mt: 3,
                p: 2, 
                bgcolor: 'rgba(240, 44, 86, 0.1)', 
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <Typography variant="body2">
                  Vuoi aggiornare l'analisi con il testo modificato?
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button 
                    size="small" 
                    variant="outlined"
                    onClick={() => setShouldReanalyze(false)}
                    sx={{ borderRadius: 2 }}
                  >
                    No
                  </Button>
                  <Button 
                    size="small" 
                    variant="contained"
                    onClick={handleReanalyze}
                    sx={{ 
                      borderRadius: 2,
                      bgcolor: theme.palette.primary.main 
                    }}
                  >
                    Aggiorna analisi
                  </Button>
                </Box>
              </Box>
            )}
          </>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {analysisLoading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3, gap: 2 }}>
            <CircularProgress size={30} />
            <Typography variant="body2" color="text.secondary">
              Analisi con Gemini in corso...
            </Typography>
          </Box>
        ) : analysisError ? (
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="body1" color="error" gutterBottom>
              {analysisError}
            </Typography>
            <Button 
              variant="outlined" 
              onClick={performAnalysis}
              sx={{ mt: 2 }}
            >
              Riprova
            </Button>
          </Box>
        ) : analysis ? (
          <AnalysisView 
            analysis={analysis} 
            onKeywordClick={(keyword) => {
              setTabValue(0);
              setHighlightKeywords(true);
            }}
            onAnalysisChange={(updatedAnalysis) => {
              setAnalysis(updatedAnalysis);
              if (typeof onAnalysisChange === 'function') {
                onAnalysisChange(updatedAnalysis);
              }
            }}
          />
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3, gap: 2 }}>
            <Button 
              variant="contained" 
              onClick={performAnalysis}
              startIcon={<PsychologyIcon />}
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
              Analizza testo
            </Button>
          </Box>
        )}
      </TabPanel>
    </Box>
  );
};

export default TranscriptionView; 