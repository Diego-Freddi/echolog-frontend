import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import PageContainer from '../components/layout/PageContainer';
import UsageWidget from '../components/Dashboard/UsageWidget';

const Usage = () => {
  return (
    <PageContainer>
      <Box sx={{ 
        width: { xs: '100%', md: '90%', lg: '80%' },
        maxWidth: '1200px',
        mx: 'auto',
        p: { xs: 2, md: 3 },
      }}>
        <Paper sx={{ 
          p: 4, 
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          border: '1px solid rgba(240,44,86,0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <Typography 
            variant="h4" 
            component="h1" 
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
            Monitoraggio Consumi
          </Typography>
          
          <Typography 
            variant="subtitle1" 
            color="text.secondary" 
            sx={{ 
              mb: 4, 
              textAlign: 'center' 
            }}
          >
            Monitora l'utilizzo delle API Google Cloud e i relativi costi
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <UsageWidget />
            </Grid>
            
            <Grid item xs={12}>
              <Paper sx={{ 
                p: 3, 
                borderRadius: 4, 
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
              }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Informazioni sui Consumi
                </Typography>
                <Typography variant="body2" paragraph>
                  Questo pannello mostra i consumi delle API Google Cloud utilizzate da EchoLog.
                </Typography>
                <Typography variant="body2" paragraph>
                  I dati presentati includono:
                </Typography>
                <ul>
                  <li>
                    <Typography variant="body2">
                      <b>Crediti Google Cloud</b>: Crediti disponibili e giorni rimanenti del periodo di prova
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      <b>Costi Totali</b>: Costi accumulati nell'ultimo mese, inclusi i crediti utilizzati
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      <b>Suddivisione per Servizio</b>: Ripartizione dei costi per ciascun servizio utilizzato
                    </Typography>
                  </li>
                </ul>
                <Typography variant="body2">
                  I servizi utilizzati includono Google Speech-to-Text per la trascrizione, Vertex AI (Gemini) per l'analisi e Google Cloud Storage per l'archiviazione dei file audio.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </PageContainer>
  );
};

export default Usage; 