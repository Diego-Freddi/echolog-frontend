import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert, IconButton } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { analysisService } from '../services/api';
import PageContainer from '../components/layout/PageContainer';
import AnalysisView from '../components/analysis/AnalysisView';
import { ApplePaper, containerStyles, pageTitleStyles } from '../styles/pageStyles';
import { BORDERS } from '../styles/themes';

const Analysis = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await analysisService.getAnalysis(id);
        setAnalysis(data);
      } catch (err) {
        console.error('Errore nel recupero dell\'analisi:', err);
        setError('Si è verificato un errore nel caricamento dell\'analisi. Riprova più tardi.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [id]);

  const handleAnalysisChange = async (updatedAnalysis) => {
    try {
      // TODO: Implementare la chiamata API per salvare le modifiche
      setAnalysis(updatedAnalysis);
    } catch (err) {
      console.error('Errore nel salvataggio delle modifiche:', err);
      setError('Si è verificato un errore nel salvataggio delle modifiche. Riprova più tardi.');
    }
  };

  return (
    <PageContainer>
      <Box sx={containerStyles}>
        <ApplePaper>
          {/* Header con pulsante indietro */}
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
            <IconButton 
              onClick={() => navigate(-1)} 
              sx={{ 
                mr: 2,
                color: '#7c32ff',
                '&:hover': {
                  backgroundColor: 'rgba(124, 50, 255, 0.1)'
                }
              }}
              aria-label="torna indietro"
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={pageTitleStyles}
            >
              Dettagli Analisi
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
              <CircularProgress sx={{ color: '#f02c56' }} />
            </Box>
          ) : error ? (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: BORDERS.radius.lg,
                '& .MuiAlert-icon': {
                  color: '#f02c56'
                }
              }}
            >
              {error}
            </Alert>
          ) : analysis ? (
            <AnalysisView 
              analysis={analysis} 
              onAnalysisChange={handleAnalysisChange}
            />
          ) : (
            <Alert 
              severity="warning" 
              sx={{ 
                borderRadius: BORDERS.radius.lg,
                '& .MuiAlert-icon': {
                  color: '#f5a623'
                }
              }}
            >
              Analisi non trovata
            </Alert>
          )}
        </ApplePaper>
      </Box>
    </PageContainer>
  );
};

export default Analysis; 