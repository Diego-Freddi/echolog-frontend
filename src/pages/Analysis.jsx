import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert, IconButton, Paper } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { analysisService } from '../services/api';
import PageContainer from '../components/layout/PageContainer';
import AnalysisView from '../components/analysis/AnalysisView';
import { styled } from '@mui/material/styles';

// Paper stilizzato in stile Apple
const ApplePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
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
      <Box sx={{
        width: { xs: '100%', md: '90%', lg: '80%' },
        maxWidth: '1200px',
        mx: 'auto',
        p: { xs: 2, md: 3 },
      }}>
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
              sx={{ 
                fontWeight: 600,
                fontSize: '1.75rem',
                background: 'linear-gradient(90deg, #f02c56 0%, #7c32ff 50%, #35a0ee 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
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
                borderRadius: '12px',
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
                borderRadius: '12px',
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