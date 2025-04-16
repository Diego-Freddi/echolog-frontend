import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import PageContainer from '../components/layout/PageContainer';
import UsageWidget from '../components/Dashboard/UsageWidget';
import { ApplePaper, containerStyles, pageTitleStyles, pageSubtitleStyles } from '../styles/pageStyles';
import { BORDERS } from '../styles/themes';

const Usage = () => {
  return (
    <PageContainer>
      <Box sx={containerStyles}>
        <ApplePaper>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            sx={pageTitleStyles}
          >
            Monitoraggio Consumi
          </Typography>
          
          <Typography 
            variant="subtitle1" 
            color="text.secondary" 
            sx={pageSubtitleStyles}
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
                borderRadius: BORDERS.radius.md, 
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
        </ApplePaper>
      </Box>
    </PageContainer>
  );
};

export default Usage; 