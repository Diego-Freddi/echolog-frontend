import React from 'react';
import { 
  Box, 
  Typography, 
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Info as InfoIcon,
  Lightbulb as LightbulbIcon,
  Label as LabelIcon
} from '@mui/icons-material';

/**
 * Componente per visualizzare i risultati dell'analisi del testo
 * rispettando lo stile originale dell'applicazione
 */
const AnalysisView = ({ analysis }) => {
  const theme = useTheme();
  
  if (!analysis) return null;
  
  const { summary, tone, keywords, sections } = analysis;
  
  return (
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
      
      {/* Parole chiave */}
      {keywords && keywords.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LabelIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
            <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
              Parole chiave
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {keywords.map((keyword, index) => (
              <Chip 
                key={index}
                label={keyword}
                sx={{ 
                  backgroundColor: '#f5f5f7',
                  borderRadius: 4
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
                        sx={{ 
                          backgroundColor: 'rgba(240,44,86,0.05)',
                          borderRadius: 4,
                          fontSize: '0.75rem'
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
  );
};

export default AnalysisView; 