import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Tab, 
  Tabs, 
  CircularProgress,
  Button,
  useTheme
} from '@mui/material';
import { 
  TextFields as TextFieldsIcon,
  Psychology as PsychologyIcon
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
const TranscriptionView = ({ text, loading, error, transcriptionId }) => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [analysis, setAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    
    // Se l'utente passa alla tab di analisi e non c'è già un'analisi, la eseguiamo
    if (newValue === 1 && !analysis && !analysisLoading && text) {
      performAnalysis();
    }
  };

  const performAnalysis = async () => {
    if (!text) return;
    
    setAnalysisLoading(true);
    setAnalysisError(null);
    
    try {
      // Usa sempre l'API reale di Gemini
      console.log('Utilizzo API reale Gemini');
      
      // Assicurati di inviare sia il testo che l'ID della trascrizione
      const result = await analysisService.analyzeText(text, transcriptionId);
      setAnalysis(result.analysis);
    } catch (error) {
      console.error('Errore durante l\'analisi:', error);
      setAnalysisError(error.response?.data?.error || error.message || 'Errore durante l\'analisi');
    } finally {
      setAnalysisLoading(false);
    }
  };

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
          disabled={!text || loading}
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
            <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main }}>
              Trascrizione
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
              {text}
            </Typography>
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
          <AnalysisView analysis={analysis} />
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
              Analizza Testo con Gemini
            </Button>
          </Box>
        )}
      </TabPanel>
    </Box>
  );
};

export default TranscriptionView; 