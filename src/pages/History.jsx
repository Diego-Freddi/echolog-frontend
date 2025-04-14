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

// Card stilizzata con stile Apple
const AppleCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0px 10px 38px -10px rgba(0, 0, 0, 0.1), 0px 10px 20px -15px rgba(0, 0, 0, 0.05)',
  height: '100%',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
  }
}));

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
      
      // Rilascia l'URL oggetto
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Errore nel download dell\'audio:', err);
      setError('Si è verificato un errore durante il download dell\'audio. Riprova più tardi.');
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

  return (
    <PageContainer>
      <Box sx={{
        width: { xs: '100%', md: '90%', lg: '90%' },
        maxWidth: '1200px',
        mx: 'auto',
        p: { xs: 2, md: 3 },
      }}>
        <ApplePaper>
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
              mb: 3,
              textAlign: 'center'
            }}
          >
            La Tua Cronologia
          </Typography>
          <Typography 
            variant="subtitle1" 
            color="text.secondary" 
            sx={{ 
              mb: 4, 
              textAlign: 'center' 
            }}
          >
            Visualizza e gestisci le tue trascrizioni e analisi precedenti
          </Typography>

          {/* Tabs */}
          <Box sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            '& .MuiTabs-flexContainer': {
              justifyContent: 'center',
            },
            mb: 3
          }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="cronologia tabs"
              textColor="primary"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '1rem',
                  minWidth: 120,
                },
                '& .Mui-selected': {
                  fontWeight: 600,
                  color: '#f02c56',
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#f02c56',
                  height: 3,
                  borderRadius: '3px 3px 0 0',
                }
              }}
            >
              <Tab label="Riepilogo" id="tab-0" aria-controls="tabpanel-0" />
              <Tab label="Trascrizioni e Analisi" id="tab-1" aria-controls="tabpanel-1" />
            </Tabs>
          </Box>

          {/* Tab Riepilogo */}
          <TabPanel value={tabValue} index={0}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
                <CircularProgress sx={{ color: '#f02c56' }} />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            ) : (
              <Grid container spacing={3}>
                {/* Cards statistiche */}
                <Grid item xs={12} md={6} lg={3}>
                  <AppleCard>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <DescriptionIcon sx={{ color: '#f02c56', mr: 1 }} />
                        <Typography variant="h6" component="div">
                          Trascrizioni Totali
                        </Typography>
                      </Box>
                      <Typography variant="h3" component="div" sx={{ fontWeight: 600 }}>
                        {stats.totalTranscriptions}
                      </Typography>
                    </CardContent>
                  </AppleCard>
                </Grid>

                <Grid item xs={12} md={6} lg={3}>
                  <AppleCard>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <AccessTimeIcon sx={{ color: '#7c32ff', mr: 1 }} />
                        <Typography variant="h6" component="div">
                          Minuti di Audio
                        </Typography>
                      </Box>
                      <Typography variant="h3" component="div" sx={{ fontWeight: 600 }}>
                        {stats.totalAudioMinutes}
                      </Typography>
                    </CardContent>
                  </AppleCard>
                </Grid>

                <Grid item xs={12} md={6} lg={6}>
                  <AppleCard>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <TimelineIcon sx={{ color: '#35a0ee', mr: 1 }} />
                        <Typography variant="h6" component="div">
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
                              borderRadius: '12px',
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
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>
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
                          borderRadius: 4,
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
                    sx={{
                      mt: 2,
                      borderRadius: '12px',
                      background: 'linear-gradient(90deg, #f02c56 0%, #7c32ff 100%)',
                      textTransform: 'none',
                      px: 3,
                      py: 1,
                      fontWeight: 500
                    }}
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
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
                <CircularProgress sx={{ color: '#f02c56' }} />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            ) : analysisHistory.analyses && analysisHistory.analyses.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <InsertDriveFileIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Nessuna trascrizione disponibile
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Non hai ancora effettuato trascrizioni o analisi.
                </Typography>
                <Button 
                  variant="contained" 
                  sx={{
                    mt: 2,
                    borderRadius: '12px',
                    background: 'linear-gradient(90deg, #f02c56 0%, #7c32ff 100%)',
                    textTransform: 'none',
                    px: 3,
                    py: 1,
                    fontWeight: 500
                  }}
                  onClick={handleStartRecording}
                >
                  Inizia a Registrare
                </Button>
              </Box>
            ) : (
              <>
                <TableContainer component={ApplePaper} sx={{ mb: 3, p: 0, overflow: 'hidden' }}>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow sx={{ 
                        backgroundColor: 'rgba(240, 44, 86, 0.03)',
                        '& th': { fontWeight: 600, py: 1.5 }
                      }}>
                        <TableCell sx={{ fontWeight: 600 }}>Data</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Riepilogo</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Parole Chiave</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Stato Audio</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Azioni</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {analysisHistory.analyses && analysisHistory.analyses.map((analysis) => (
                        <TableRow 
                          key={analysis._id} 
                          sx={{ 
                            '&:last-child td, &:last-child th': { border: 0 },
                            '&:hover': { 
                              backgroundColor: theme.palette.action.hover,
                              transition: 'all 0.2s'
                            }
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <CalendarTodayIcon sx={{ color: '#7c32ff', mr: 1, fontSize: 20 }} />
                              <Typography variant="body2">
                                {formatDate(analysis.createdAt)}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {getSummaryExcerpt(analysis.summary)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: 280 }}>
                              {analysis.keywords && analysis.keywords.slice(0, 3).map((keyword, idx) => (
                                <Chip 
                                  key={idx} 
                                  label={keyword} 
                                  size="small" 
                                  sx={{ 
                                    bgcolor: 'rgba(240, 44, 86, 0.1)', 
                                    fontSize: '0.75rem',
                                    height: 24,
                                    borderRadius: '12px'
                                  }} 
                                />
                              ))}
                              {analysis.keywords && analysis.keywords.length > 3 && (
                                <Chip 
                                  label={`+${analysis.keywords.length - 3}`} 
                                  size="small" 
                                  sx={{ 
                                    bgcolor: 'rgba(124, 50, 255, 0.1)', 
                                    fontSize: '0.75rem',
                                    height: 24,
                                    borderRadius: '12px'
                                  }} 
                                />
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            {analysis.audio && analysis.audio.available ? (
                              <Tooltip title={`Scade il ${formatDate(analysis.audio.expiresOn)}`}>
                                <Chip 
                                  label={`Disponibile (${analysis.audio.daysRemaining} giorni)`} 
                                  size="small" 
                                  color="success" 
                                  variant="outlined"
                                  sx={{ height: 24, fontSize: '0.75rem', borderRadius: '12px' }}
                                />
                              </Tooltip>
                            ) : analysis.transcriptionId ? (
                              <Tooltip title="Questa trascrizione è collegata a un file audio">
                                <Chip 
                                  label="Audio Disponibile" 
                                  size="small" 
                                  color="success" 
                                  variant="outlined"
                                  sx={{ height: 24, fontSize: '0.75rem', borderRadius: '12px' }}
                                />
                              </Tooltip>
                            ) : (
                              <Chip 
                                label="Non disponibile" 
                                size="small" 
                                color="error" 
                                variant="outlined"
                                sx={{ height: 24, fontSize: '0.75rem', borderRadius: '12px' }}
                              />
                            )}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex' }}>
                              <Tooltip title="Visualizza">
                                <IconButton 
                                  size="small" 
                                  sx={{ 
                                    color: '#35a0ee',
                                    '&:hover': {
                                      backgroundColor: 'rgba(53, 160, 238, 0.1)'
                                    }
                                  }}
                                  onClick={() => handleViewAnalysis(analysis._id)}
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              {analysis.transcriptionId && (
                                <Tooltip title="Scarica Audio">
                                  <IconButton 
                                    size="small" 
                                    sx={{ 
                                      color: '#7c32ff',
                                      '&:hover': {
                                        backgroundColor: 'rgba(124, 50, 255, 0.1)'
                                      }
                                    }}
                                    onClick={() => handleDownloadAudio(analysis)}
                                  >
                                    <DownloadIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                              <Tooltip title="Elimina">
                                <IconButton 
                                  size="small" 
                                  sx={{ 
                                    color: '#f02c56',
                                    '&:hover': {
                                      backgroundColor: 'rgba(240, 44, 86, 0.1)'
                                    }
                                  }}
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
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Pagination 
                    count={Math.ceil(analysisHistory.total / itemsPerPage)}
                    page={page}
                    onChange={handlePageChange}
                    variant="outlined"
                    shape="rounded"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        borderRadius: '12px',
                        margin: '0 4px'
                      },
                      '& .Mui-selected': {
                        background: 'linear-gradient(90deg, rgba(240, 44, 86, 0.1) 0%, rgba(124, 50, 255, 0.1) 100%)',
                        borderColor: 'transparent',
                        fontWeight: 600
                      },
                      '& .MuiPaginationItem-page:hover': {
                        backgroundColor: 'rgba(240, 44, 86, 0.05)'
                      }
                    }}
                  />
                </Box>
              </>
            )}
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
          sx: {
            borderRadius: '16px',
            padding: '8px',
            boxShadow: '0px 10px 38px -10px rgba(0, 0, 0, 0.2), 0px 10px 20px -15px rgba(0, 0, 0, 0.15)',
          }
        }}
      >
        <DialogTitle id="alert-dialog-title" sx={{ fontWeight: 600 }}>
          Conferma eliminazione
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Sei sicuro di voler eliminare questa trascrizione? L'operazione eliminerà definitivamente la trascrizione, 
            l'analisi associata e il file audio da Google Cloud Storage. Questa azione non può essere annullata.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: '16px' }}>
          <Button 
            onClick={handleDeleteConfirmationClose}
            variant="outlined"
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              borderColor: '#f02c56',
              color: '#f02c56',
              '&:hover': {
                borderColor: '#f02c56',
                backgroundColor: 'rgba(240, 44, 86, 0.05)'
              }
            }}
          >
            Annulla
          </Button>
          <Button 
            onClick={handleDeleteTranscription}
            variant="contained"
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              backgroundColor: '#f02c56',
              '&:hover': {
                backgroundColor: '#d81d48'
              }
            }}
            autoFocus
          >
            Elimina
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default History; 