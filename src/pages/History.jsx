import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Grid, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Chip, Button, Alert, Pagination, Tabs, Tab,
  Card, CardContent, IconButton, Tooltip, useTheme,
  LinearProgress, Dialog, DialogActions, DialogContent, 
  DialogContentText, DialogTitle
} from '@mui/material';
import {
  Timeline as TimelineIcon,
  Description as DescriptionIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  InsertDriveFile as InsertDriveFileIcon,
  AccessTime as AccessTimeIcon,
  CalendarToday as CalendarTodayIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../services/api';
import { transcriptionService } from '../services/api';
import PageContainer from '../components/layout/PageContainer';
import { ApplePaper, AppleCard, containerStyles, pageTitleStyles, pageSubtitleStyles } from '../styles/pageStyles';
import { COLORS, BORDERS } from '../styles/themes';
import { 
  tabStyles, 
  statCardStyles, 
  historyTableStyles, 
  actionStyles, 
  confirmDialogStyles, 
  paginationStyles,
  emptyStateStyles
} from '../styles/historyStyles';

// Componente TabPanel per la gestione delle tabs
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const History = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState({ analyses: [], total: 0 });
  const [stats, setStats] = useState({
    totalTranscriptions: 0,
    totalAudioMinutes: 0,
    averageWords: 0,
    mostFrequentKeywords: [],
    storage: {
      usedMB: 0,
      limitMB: 500,
      usagePercent: 0
    }
  });
  const [page, setPage] = useState(1);
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transcriptionToDelete, setTranscriptionToDelete] = useState(null);

  const itemsPerPage = 5;

  // Effettua le chiamate API all'avvio e quando cambia la pagina
  useEffect(() => {
    fetchData();
  }, [page]);

  // Funzione per recuperare i dati
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Se siamo nella prima pagina o se stiamo caricando le statistiche
      if (page === 1 || tabValue === 0) {
        // Recupera le statistiche
        const statsData = await dashboardService.getStats();
        setStats(statsData);
      }
      
      // Recupera la cronologia
      const skip = (page - 1) * itemsPerPage;
      const historyData = await dashboardService.getHistory(itemsPerPage, skip);
      setAnalysisHistory(historyData);
    } catch (err) {
      console.error('Errore nel recupero dei dati:', err);
      setError('Si è verificato un errore nel caricamento della cronologia. Riprova più tardi.');
    } finally {
      setLoading(false);
    }
  };

  // Gestione del cambio pagina
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  // Gestione del cambio tab
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Gestione del click sul pulsante "Inizia a Registrare"
  const handleStartRecording = () => {
    navigate('/record');
  };

  // Gestione della visualizzazione dell'analisi
  const handleViewAnalysis = (analysisId) => {
    navigate(`/analysis/${analysisId}`);
  };

  // Gestione del download dell'audio
  const handleDownloadAudio = async (analysis) => {
    try {
      // Verifica se l'audio è disponibile
      if (!analysis.audio || !analysis.audio.available) {
        throw new Error('Audio non più disponibile');
      }

      // Ottieni il token dall'utente corrente
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user?.token) {
        throw new Error('Token non trovato');
      }

      // Determina il nome del file da scaricare (usando audioFilename se disponibile)
      const fileToDownload = analysis.audioFilename || analysis.transcriptionId;
      
      if (!fileToDownload) {
        throw new Error('Nome file audio non disponibile');
      }

      console.log('Tentativo download file:', fileToDownload);
      
      // Costruisci l'URL completo per il download
      const downloadUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5050'}/api/audio/${fileToDownload}`;
      
      // Esegui la richiesta con il token
      const response = await fetch(downloadUrl, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Accept': 'audio/*'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Audio non più disponibile');
        }
        throw new Error(`Errore nel download del file: ${response.status}`);
      }

      // Ottieni il blob del file
      const blob = await response.blob();
      
      // Crea un URL oggetto per il blob
      const url = window.URL.createObjectURL(blob);
      
      // Crea un elemento anchor temporaneo
      const link = document.createElement('a');
      link.href = url;
      link.download = `audio_${analysis.transcriptionId}.mp3`; // Nome file più descrittivo
      
      // Aggiungi l'elemento al DOM, cliccalo e rimuovilo
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Pulisci l'URL oggetto
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Errore nel download dell\'audio:', error);
      // Mostra un messaggio di errore all'utente
      setError(error.message || 'Si è verificato un errore durante il download dell\'audio');
    }
  };

  // Formatta la data in formato italiano
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('it-IT', options);
  };

  // Restituisce un estratto del testo di riepilogo
  const getSummaryExcerpt = (summary, maxLength = 100) => {
    if (!summary) return 'Nessun riepilogo disponibile';
    return summary.length > maxLength 
      ? `${summary.substring(0, maxLength)}...` 
      : summary;
  };

  // Apri il dialogo di conferma dell'eliminazione
  const handleDeleteConfirmationOpen = (transcriptionId) => {
    setTranscriptionToDelete(transcriptionId);
    setDeleteDialogOpen(true);
  };
  
  // Chiudi il dialogo di conferma dell'eliminazione
  const handleDeleteConfirmationClose = () => {
    setDeleteDialogOpen(false);
    setTranscriptionToDelete(null);
  };
  
  // Elimina la trascrizione
  const handleDeleteTranscription = async () => {
    try {
      if (!transcriptionToDelete) {
        throw new Error('ID trascrizione mancante');
      }
      
      setLoading(true);
      await transcriptionService.deleteTranscription(transcriptionToDelete);
      
      // Chiudi il dialogo e aggiorna i dati
      handleDeleteConfirmationClose();
      fetchData();
      
      // Mostra messaggio di successo (opzionale)
      // setSuccessMessage('Trascrizione eliminata con successo');
    } catch (err) {
      console.error('Errore durante l\'eliminazione della trascrizione:', err);
      setError('Si è verificato un errore durante l\'eliminazione della trascrizione. Riprova più tardi.');
      handleDeleteConfirmationClose();
    } finally {
      setLoading(false);
    }
  };

  // Inizializza il tab all'indice 1 su mobile, 0 su desktop
  useEffect(() => {
    const isMobile = window.innerWidth < 600; // breakpoint 'sm' di MUI è 600px
    setTabValue(isMobile ? 1 : 0);

    // Opzionale: Aggiungi listener per cambiare tab se la dimensione dello schermo cambia
    const handleResize = () => {
      const isMobileNow = window.innerWidth < 600;
      if (isMobileNow && tabValue === 0) {
        setTabValue(1);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Renderizzazione contenitore di caricamento
  const renderLoading = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
      <CircularProgress sx={{ color: '#f02c56' }} />
    </Box>
  );

  // Renderizzazione messaggio di errore
  const renderError = () => (
    <Alert severity="error" sx={{ mb: 3 }}>
      {error}
    </Alert>
  );

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
            La Tua Cronologia
          </Typography>
          <Typography 
            variant="subtitle1" 
            color="text.secondary" 
            sx={pageSubtitleStyles}
          >
            Visualizza e gestisci le tue trascrizioni e analisi precedenti
          </Typography>

          {/* Tabs */}
          <Box sx={tabStyles.container}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="cronologia tabs"
              textColor="primary"
              sx={tabStyles.tabs}
            >
              <Tab label="Riepilogo" id="tab-0" aria-controls="tabpanel-0" sx={{ display: { xs: 'none', sm: 'block' } }} />
              <Tab label="Trascrizioni e Analisi" id="tab-1" aria-controls="tabpanel-1" />
            </Tabs>
          </Box>

          {/* Tab Riepilogo */}
          <TabPanel value={tabValue} index={0}>
            {loading ? renderLoading() : error ? renderError() : (
              <Grid container spacing={3}>
                {/* Cards statistiche */}
                <Grid item xs={12} md={6} lg={3}>
                  <AppleCard sx={statCardStyles.card}>
                    <CardContent sx={statCardStyles.content}>
                      <Box sx={statCardStyles.header}>
                        <DescriptionIcon sx={statCardStyles.icon(COLORS.primary.main)} />
                        <Typography variant="h6" component="div" sx={statCardStyles.title}>
                          Trascrizioni Totali
                        </Typography>
                      </Box>
                      <Typography variant="h3" component="div" sx={statCardStyles.value}>
                        {stats.totalTranscriptions}
                      </Typography>
                    </CardContent>
                  </AppleCard>
                </Grid>

                <Grid item xs={12} md={6} lg={3}>
                  <AppleCard sx={statCardStyles.card}>
                    <CardContent sx={statCardStyles.content}>
                      <Box sx={statCardStyles.header}>
                        <AccessTimeIcon sx={statCardStyles.icon(COLORS.secondary.main)} />
                        <Typography variant="h6" component="div" sx={statCardStyles.title}>
                          Minuti di Audio
                        </Typography>
                      </Box>
                      <Typography variant="h3" component="div" sx={statCardStyles.value}>
                        {stats.totalAudioMinutes}
                      </Typography>
                    </CardContent>
                  </AppleCard>
                </Grid>

                <Grid item xs={12} md={6} lg={6}>
                  <AppleCard sx={statCardStyles.card}>
                    <CardContent sx={statCardStyles.content}>
                      <Box sx={statCardStyles.header}>
                        <TimelineIcon sx={statCardStyles.icon(COLORS.accent.blue)} />
                        <Typography variant="h6" component="div" sx={statCardStyles.title}>
                          Parole Chiave Più Frequenti
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {stats.mostFrequentKeywords && stats.mostFrequentKeywords.map((item, index) => (
                          <Chip 
                            key={index}
                            label={item.keyword}
                            size="medium"
                            sx={{ 
                              bgcolor: `rgba(240, 44, 86, ${0.1 + (item.count / 10)})`,
                              borderRadius: BORDERS.radius.lg,
                              '& .MuiChip-label': { px: 1.5 },
                              color: theme.palette.primary.main
                            }}
                          />
                        ))}
                        {(!stats.mostFrequentKeywords || stats.mostFrequentKeywords.length === 0) && (
                          <Typography variant="body2" color="text.secondary">
                            Nessuna parola chiave disponibile
                          </Typography>
                        )}
                      </Box>
                    </CardContent>
                  </AppleCard>
                </Grid>

                {/* Informazioni generali */}
                <Grid item xs={12}>
                  <AppleCard>
                    <CardContent sx={statCardStyles.content}>
                      <Typography variant="h6" gutterBottom sx={statCardStyles.title}>
                        Informazioni sui File Audio
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body1" gutterBottom>
                          I file audio rimangono disponibili per 7 giorni dalla data di registrazione. 
                          Se desideri conservarli più a lungo, ricordati di scaricarli prima della scadenza.
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Le trascrizioni e le analisi rimangono invece sempre disponibili.
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={stats.storage?.usagePercent || 0} 
                        sx={{ 
                          height: 8, 
                          borderRadius: BORDERS.radius.md,
                          bgcolor: 'rgba(240, 44, 86, 0.1)',
                          '& .MuiLinearProgress-bar': {
                            backgroundImage: 'linear-gradient(90deg, #f02c56 0%, #7c32ff 100%)'
                          }
                        }}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        Spazio utilizzato: {stats.storage?.usagePercent || 0}% ({stats.storage?.usedMB || 0}MB su {stats.storage?.limitMB || 500}MB)
                      </Typography>
                    </CardContent>
                  </AppleCard>
                </Grid>
                
                {/* Pulsante registra */}
                <Grid item xs={12} sx={{ textAlign: 'center', mt: 2 }}>
                  <Button 
                    variant="contained" 
                    sx={actionStyles.gradientButton}
                    onClick={handleStartRecording}
                  >
                    Registra Nuovo Audio
                  </Button>
                </Grid>
              </Grid>
            )}
          </TabPanel>

          {/* Tab Trascrizioni e Analisi */}
          <TabPanel value={tabValue} index={1}>
            {loading ? renderLoading() : error ? renderError() : 
              analysisHistory.analyses && analysisHistory.analyses.length === 0 ? (
                <Box sx={emptyStateStyles.container}>
                  <InsertDriveFileIcon sx={emptyStateStyles.icon} />
                  <Typography variant="h6" gutterBottom>
                    Nessuna trascrizione disponibile
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Non hai ancora effettuato trascrizioni o analisi.
                  </Typography>
                  <Button 
                    variant="contained" 
                    sx={actionStyles.gradientButton}
                    onClick={handleStartRecording}
                  >
                    Inizia a Registrare
                  </Button>
                </Box>
              ) : (
                <>
                  <TableContainer component={ApplePaper} sx={historyTableStyles.container}>
                    <Table sx={historyTableStyles.table}>
                      <TableHead>
                        <TableRow sx={historyTableStyles.header}>
                          <TableCell sx={{ fontWeight: 600 }}>Data</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Riepilogo</TableCell>
                          <TableCell sx={{ fontWeight: 600, display: { xs: 'none', md: 'table-cell' } }}>Parole Chiave</TableCell>
                          <TableCell sx={{ fontWeight: 600, display: { xs: 'none', sm: 'table-cell' } }}>Stato Audio</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Azioni</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {analysisHistory.analyses && analysisHistory.analyses.map((analysis) => (
                          <TableRow 
                            key={analysis._id} 
                            sx={historyTableStyles.row(theme)}
                          >
                            <TableCell>
                              <Box sx={historyTableStyles.cell}>
                                <CalendarTodayIcon sx={historyTableStyles.cellIcon(COLORS.secondary.main)} />
                                <Typography variant="body2">
                                  {formatDate(analysis.createdAt)}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {getSummaryExcerpt(analysis.summary, window.innerWidth < 600 ? 60 : 100)}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                              <Box sx={historyTableStyles.keywordsContainer}>
                                {analysis.keywords && analysis.keywords.slice(0, 3).map((keyword, idx) => (
                                  <Chip 
                                    key={idx} 
                                    label={keyword} 
                                    size="small" 
                                    sx={historyTableStyles.keywordChip} 
                                  />
                                ))}
                                {analysis.keywords && analysis.keywords.length > 3 && (
                                  <Chip 
                                    label={`+${analysis.keywords.length - 3}`} 
                                    size="small" 
                                    sx={historyTableStyles.additionalKeywordsChip} 
                                  />
                                )}
                              </Box>
                            </TableCell>
                            <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                              {analysis.audio && analysis.audio.available ? (
                                <Tooltip title={`Scade il ${formatDate(analysis.audio.expiresOn)}`}>
                                  <Chip 
                                    label={`Disponibile (${analysis.audio.daysRemaining} giorni)`} 
                                    size="small" 
                                    color="success" 
                                    variant="outlined"
                                    sx={historyTableStyles.audioStatusChip(true)}
                                  />
                                </Tooltip>
                              ) : (
                                <Chip 
                                  label="Scaduto" 
                                  size="small" 
                                  color="error" 
                                  variant="outlined"
                                  sx={historyTableStyles.audioStatusChip(false)}
                                />
                              )}
                            </TableCell>
                            <TableCell>
                              <Box sx={historyTableStyles.actionButtonContainer}>
                                <Tooltip title="Visualizza">
                                  <IconButton 
                                    size="small" 
                                    sx={actionStyles.viewButton}
                                    onClick={() => handleViewAnalysis(analysis._id)}
                                  >
                                    <VisibilityIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                {analysis.audio && analysis.audio.available && (
                                  <Tooltip title="Scarica Audio">
                                    <IconButton 
                                      size="small" 
                                      sx={actionStyles.downloadButton}
                                      onClick={() => handleDownloadAudio(analysis)}
                                    >
                                      <DownloadIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                                <Tooltip title="Elimina">
                                  <IconButton 
                                    size="small" 
                                    sx={actionStyles.deleteButton}
                                    onClick={() => handleDeleteConfirmationOpen(analysis.transcriptionId)}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* Paginazione */}
                  <Box sx={paginationStyles.container}>
                    <Pagination 
                      count={Math.ceil(analysisHistory.total / itemsPerPage)}
                      page={page}
                      onChange={handlePageChange}
                      variant="outlined"
                      shape="rounded"
                      sx={paginationStyles.pagination}
                    />
                  </Box>
                </>
              )
            }
          </TabPanel>
        </ApplePaper>
      </Box>
      
      {/* Dialogo di conferma eliminazione */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteConfirmationClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: confirmDialogStyles.paper
        }}
      >
        <DialogTitle id="alert-dialog-title" sx={confirmDialogStyles.title}>
          Conferma eliminazione
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Sei sicuro di voler eliminare questa trascrizione? L'operazione eliminerà definitivamente la trascrizione, 
            l'analisi associata e il file audio da Google Cloud Storage. Questa azione non può essere annullata.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={confirmDialogStyles.actions}>
          <Button 
            onClick={handleDeleteConfirmationClose}
            variant="outlined"
            sx={confirmDialogStyles.cancelButton}
          >
            Annulla
          </Button>
          <Button 
            onClick={handleDeleteTranscription} 
            autoFocus
            variant="contained"
            sx={confirmDialogStyles.confirmButton}
          >
            Elimina
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default History; 