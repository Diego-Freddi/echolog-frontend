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
      id={`transcription-tabpanel-${index}`}
      aria-labelledby={`transcription-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ 
          p: { xs: 1, sm: 2, md: 3 },
          overflow: 'auto'
        }}>
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
    <Box sx={{ width: '100%' }}>
      {/* Tabs container */}
      <Box sx={{ 
        borderBottom: 1, 
        borderColor: 'divider',
        mb: { xs: 1, sm: 2 },
        position: 'sticky',
        top: 0,
        backgroundColor: theme.palette.background.default,
        zIndex: 1
      }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            '& .MuiTab-root': {
              minHeight: { xs: 48, sm: 56 },
              fontSize: { xs: '0.875rem', sm: '0.9rem' },
              px: { xs: 1, sm: 2 },
            }
          }}
        >
          <Tab 
            icon={<TextFieldsIcon />} 
            label="Trascrizione" 
            sx={{
              flexDirection: { xs: 'row', sm: 'column' },
              gap: { xs: 1, sm: 0 },
              '& .MuiTab-iconWrapper': {
                mr: { xs: 1, sm: 0 }
              }
            }}
          />
          <Tab 
            icon={<PsychologyIcon />} 
            label="Analisi"
            sx={{
              flexDirection: { xs: 'row', sm: 'column' },
              gap: { xs: 1, sm: 0 },
              '& .MuiTab-iconWrapper': {
                mr: { xs: 1, sm: 0 }
              }
            }}
          />
        </Tabs>
      </Box>

      {/* Trascrizione Panel */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ 
          position: 'relative',
          mb: { xs: 2, sm: 3 }
        }}>
          {/* Controlli trascrizione */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1,
            mb: { xs: 1, sm: 2 }
          }}>
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
                <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  Evidenzia parole chiave
                </Typography>
              }
            />
            
            {typeof onTextChange === 'function' && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                {isEditing ? (
                  <>
                    <Tooltip title="Salva modifiche">
                      <IconButton 
                        size="small" 
                        onClick={handleSave}
                        sx={{ display: { xs: 'flex', sm: 'none' } }}
                      >
                        <SaveIcon />
                      </IconButton>
                    </Tooltip>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                      size="small"
                      sx={{ 
                        display: { xs: 'none', sm: 'flex' },
                        borderRadius: 2
                      }}
                    >
                      Salva
                    </Button>

                    <Tooltip title="Annulla">
                      <IconButton 
                        size="small" 
                        onClick={handleCancel}
                        sx={{ display: { xs: 'flex', sm: 'none' } }}
                      >
                        <CancelIcon />
                      </IconButton>
                    </Tooltip>
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={handleCancel}
                      size="small"
                      sx={{ 
                        display: { xs: 'none', sm: 'flex' },
                        borderRadius: 2
                      }}
                    >
                      Annulla
                    </Button>
                  </>
                ) : (
                  <>
                    <Tooltip title="Modifica">
                      <IconButton 
                        size="small" 
                        onClick={handleEditStart}
                        sx={{ display: { xs: 'flex', sm: 'none' } }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={handleEditStart}
                      size="small"
                      sx={{ 
                        display: { xs: 'none', sm: 'flex' },
                        borderRadius: 2
                      }}
                    >
                      Modifica
                    </Button>
                  </>
                )}
              </Box>
            )}
          </Box>

          {/* Contenuto trascrizione */}
          {isEditing ? (
            <TextField
              multiline
              fullWidth
              value={editableText}
              onChange={(e) => setEditableText(e.target.value)}
              variant="outlined"
              placeholder="Inserisci il testo della trascrizione..."
              minRows={5}
              maxRows={20}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: theme.palette.background.paper,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  lineHeight: { xs: 1.5, sm: 1.75 }
                }
              }}
            />
          ) : (
            <Typography 
              variant="body1" 
              component="div"
              dangerouslySetInnerHTML={{ 
                __html: highlightKeywords ? processedText : text 
              }}
              sx={{
                whiteSpace: 'pre-wrap',
                fontSize: { xs: '0.875rem', sm: '1rem' },
                lineHeight: { xs: 1.5, sm: 1.75 },
                wordBreak: 'break-word'
              }}
            />
          )}
        </Box>

        {/* Banner rianalisi */}
        {shouldReanalyze && (
          <Box sx={{ 
            mt: { xs: 2, sm: 3 },
            p: { xs: 1.5, sm: 2 },
            borderRadius: 2,
            backgroundColor: theme.palette.mode === 'dark' 
              ? 'rgba(240,44,86,0.1)' 
              : 'rgba(240,44,86,0.05)',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: { xs: 1, sm: 2 }
          }}>
            <Typography 
              variant="body2" 
              sx={{ 
                flex: 1,
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}
            >
              Il testo è stato modificato. Vuoi aggiornare l'analisi?
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              gap: 1,
              justifyContent: { xs: 'flex-end', sm: 'flex-start' }
            }}>
              <Button
                variant="contained"
                size="small"
                onClick={() => {
                  setShouldReanalyze(false);
                  performAnalysis(editableText, true);
                }}
                sx={{ borderRadius: 2 }}
              >
                Aggiorna
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setShouldReanalyze(false)}
                sx={{ borderRadius: 2 }}
              >
                No
              </Button>
            </Box>
          </Box>
        )}
      </TabPanel>

      {/* Analisi Panel */}
      <TabPanel value={tabValue} index={1}>
        {analysisLoading ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: 2,
            p: { xs: 2, sm: 3 }
          }}>
            <CircularProgress size={30} />
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              Analisi con Gemini in corso...
            </Typography>
          </Box>
        ) : analysisError ? (
          <Box sx={{ 
            textAlign: 'center', 
            p: { xs: 2, sm: 3 }
          }}>
            <Typography 
              variant="body1" 
              color="error" 
              gutterBottom
              sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
            >
              {analysisError}
            </Typography>
            <Button 
              variant="outlined" 
              onClick={performAnalysis}
              sx={{ 
                mt: { xs: 1, sm: 2 },
                borderRadius: 2
              }}
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
              // Evidenzia la parola chiave nel testo usando i colori del tema
              const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
              const highlightedText = text.replace(regex, `<mark style="background-color: ${theme.palette.mode === 'dark' ? 'rgba(240, 44, 86, 0.3)' : 'rgba(240, 44, 86, 0.15)'}; color: ${theme.palette.text.primary}; padding: 0 4px; border-radius: 2px;">$1</mark>`);
              setProcessedText(highlightedText);
            }}
            onAnalysisChange={(updatedAnalysis) => {
              setAnalysis(updatedAnalysis);
              if (typeof onAnalysisChange === 'function') {
                onAnalysisChange(updatedAnalysis);
              }
            }}
          />
        ) : (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            gap: 2,
            p: { xs: 2, sm: 3 }
          }}>
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