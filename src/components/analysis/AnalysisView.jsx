import React from 'react';
import { 
  Box, 
  Typography, 
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  useTheme
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Info as InfoIcon,
  Lightbulb as LightbulbIcon,
  Label as LabelIcon,
  PictureAsPdf as PdfIcon
} from '@mui/icons-material';
import { TagCloud } from 'react-tagcloud';
import { PDFDownloadLink } from '@react-pdf/renderer';
import AnalysisPDF from './AnalysisPDF';

/**
 * Componente per visualizzare i risultati dell'analisi del testo
 * rispettando lo stile originale dell'applicazione
 */
const AnalysisView = ({ analysis, onKeywordClick }) => {
  const theme = useTheme();
  
  if (!analysis) return null;
  
  const { summary, tone, keywords, sections } = analysis;
  
  // Preparazione dati per TagCloud
  const cloudData = keywords?.map(keyword => ({
    value: keyword,
    count: Math.floor(Math.random() * 30) + 10, // Peso randomico per visual appeal
  })) || [];
  
  // Configurazione TagCloud
  const cloudOptions = {
    luminosity: 'light',
    hue: '#f02c56', // Colore primario dell'app
  };
  
  // Gestisci il click su una parola chiave
  const handleKeywordClick = (keyword) => {
    if (onKeywordClick) {
      onKeywordClick(keyword);
    }
  };
  
  return (
    <Box>
      {/* Pulsante esporta PDF */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <PDFDownloadLink 
          document={<AnalysisPDF analysis={analysis} />} 
          fileName="analisi.pdf"
          style={{ textDecoration: 'none' }}
        >
          {({ loading, error }) => (
            <Button
              variant="outlined"
              size="small"
              startIcon={<PdfIcon />}
              disabled={loading}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: 'rgba(240,44,86,0.04)',
                  borderColor: theme.palette.primary.main,
                }
              }}
            >
              {loading ? 'Preparazione PDF...' : 'Esporta PDF'}
            </Button>
          )}
        </PDFDownloadLink>
      </Box>
      
      {/* Contenuto da visualizzare */}
      <Box sx={{ p: 1 }}>
        {/* Riepilogo */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <InfoIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
            <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
              Riepilogo
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
            {summary}
          </Typography>
        </Box>
        
        {/* Tono */}
        {tone && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LightbulbIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
              <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
                Tono
              </Typography>
            </Box>
            <Chip 
              label={tone} 
              sx={{ 
                backgroundColor: 'rgba(240,44,86,0.1)',
                color: theme.palette.primary.main,
                fontWeight: 500,
                borderRadius: 4
              }} 
            />
          </Box>
        )}
        
        {/* Parole chiave - Tag Cloud */}
        {keywords && keywords.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LabelIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
              <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
                Parole chiave
              </Typography>
            </Box>
            
            {/* Visualizzazione Tag Cloud */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              p: 2, 
              backgroundColor: '#f9f9f9',
              borderRadius: 2,
              mb: 2
            }}>
              <TagCloud
                minSize={14}
                maxSize={35}
                tags={cloudData}
                colorOptions={cloudOptions}
                renderer={(tag, size, color) => (
                  <span
                    key={tag.value}
                    style={{
                      animation: 'blinker 3s linear infinite',
                      animationDelay: `${Math.random() * 2}s`,
                      fontSize: `${size}px`,
                      margin: '5px',
                      padding: '5px',
                      display: 'inline-block',
                      color: theme.palette.primary.main,
                      fontWeight: 'bold',
                      opacity: size / 35 + 0.5, // Opacità basata sulla dimensione
                      cursor: onKeywordClick ? 'pointer' : 'default',
                    }}
                    onClick={() => handleKeywordClick(tag.value)}
                  >
                    {tag.value}
                  </span>
                )}
              />
            </Box>
            
            {/* Visualizzazione tradizionale (per il PDF e fallback) */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {keywords.map((keyword, index) => (
                <Chip 
                  key={index}
                  label={keyword}
                  onClick={() => handleKeywordClick(keyword)}
                  sx={{ 
                    backgroundColor: '#f5f5f7',
                    borderRadius: 4,
                    cursor: onKeywordClick ? 'pointer' : 'default',
                    '&:hover': onKeywordClick ? {
                      backgroundColor: 'rgba(240,44,86,0.1)',
                    } : {}
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
        
        {/* Sezioni tematiche */}
        {sections && sections.length > 0 && (
          <Box>
            <Typography variant="h6" sx={{ color: theme.palette.primary.main, mb: 1 }}>
              Sezioni tematiche
            </Typography>
            {sections.map((section, index) => (
              <Accordion 
                key={index}
                sx={{ 
                  mb: 1,
                  borderRadius: '8px!important',
                  '&:before': { display: 'none' },
                  boxShadow: 'none',
                  border: '1px solid rgba(0,0,0,0.08)'
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ 
                    borderRadius: 2,
                    backgroundColor: 'rgba(0,0,0,0.02)'
                  }}
                >
                  <Typography sx={{ fontWeight: 500 }}>{section.title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography sx={{ mb: 2 }}>{section.content}</Typography>
                  {section.keywords && section.keywords.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {section.keywords.map((keyword, keywordIndex) => (
                        <Chip 
                          key={keywordIndex}
                          label={keyword}
                          size="small"
                          onClick={() => handleKeywordClick(keyword)}
                          sx={{ 
                            backgroundColor: 'rgba(240,44,86,0.05)',
                            borderRadius: 4,
                            fontSize: '0.75rem',
                            cursor: onKeywordClick ? 'pointer' : 'default',
                            '&:hover': onKeywordClick ? {
                              backgroundColor: 'rgba(240,44,86,0.15)',
                            } : {}
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AnalysisView; 