import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  useTheme,
  IconButton,
  TextField,
  Tooltip,
  Stack,
  Divider
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Info as InfoIcon,
  Lightbulb as LightbulbIcon,
  Label as LabelIcon,
  PictureAsPdf as PdfIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { TagCloud } from 'react-tagcloud';
import { PDFDownloadLink } from '@react-pdf/renderer';
import AnalysisPDF from './AnalysisPDF';

/**
 * Componente per visualizzare i risultati dell'analisi del testo
 * rispettando lo stile originale dell'applicazione
 */
const AnalysisView = ({ analysis, onKeywordClick, onAnalysisChange }) => {
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editedAnalysis, setEditedAnalysis] = useState(null);
  
  // Calcola i pesi delle parole chiave in base alla loro frequenza nel testo
  const cloudData = useMemo(() => {
    if (!analysis?.keywords || !analysis?.summary) return [];
    
    const { summary, sections, keywords } = analysis;
    
    // Combina il testo del sommario e delle sezioni
    const fullText = [
      summary,
      ...(sections?.map(section => section.content) || [])
    ].join(' ').toLowerCase();
    
    return keywords.map(keyword => {
      // Conta le occorrenze della parola chiave nel testo
      const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'g');
      const count = (fullText.match(regex) || []).length;
      
      // Normalizza il conteggio per avere valori tra 10 e 50
      const normalizedCount = Math.max(10, Math.min(50, count * 5 + 10));
      
      return {
        value: keyword,
        count: normalizedCount
      };
    });
  }, [analysis]);
  
  // Configurazione TagCloud con colori del tema
  const cloudOptions = {
    luminosity: theme.palette.mode === 'dark' ? 'light' : 'dark',
    hue: theme.palette.primary.main
  };
  
  if (!analysis) return null;
  
  const { summary, tone, keywords, sections } = analysis;
  
  // Entra in modalità modifica
  const handleEditStart = () => {
    setEditedAnalysis({...analysis});
    setIsEditing(true);
  };
  
  // Salva le modifiche
  const handleSave = () => {
    if (typeof onAnalysisChange === 'function') {
      onAnalysisChange(editedAnalysis);
    }
    setIsEditing(false);
  };
  
  // Annulla le modifiche
  const handleCancel = () => {
    setEditedAnalysis(null);
    setIsEditing(false);
  };
  
  // Gestisci l'aggiunta di una parola chiave
  const handleAddKeyword = () => {
    setEditedAnalysis({
      ...editedAnalysis,
      keywords: [...editedAnalysis.keywords, '']
    });
  };
  
  // Gestisci la modifica di una parola chiave
  const handleKeywordChange = (index, value) => {
    const updatedKeywords = [...editedAnalysis.keywords];
    updatedKeywords[index] = value;
    setEditedAnalysis({
      ...editedAnalysis,
      keywords: updatedKeywords
    });
  };
  
  // Rimuovi una parola chiave
  const handleRemoveKeyword = (index) => {
    const updatedKeywords = [...editedAnalysis.keywords];
    updatedKeywords.splice(index, 1);
    setEditedAnalysis({
      ...editedAnalysis,
      keywords: updatedKeywords
    });
  };
  
  // Aggiungi una nuova sezione
  const handleAddSection = () => {
    setEditedAnalysis({
      ...editedAnalysis,
      sections: [...editedAnalysis.sections, {
        title: 'Nuova sezione',
        content: '',
        keywords: []
      }]
    });
  };
  
  // Modifica una sezione
  const handleSectionChange = (index, field, value) => {
    const updatedSections = [...editedAnalysis.sections];
    updatedSections[index] = {
      ...updatedSections[index],
      [field]: value
    };
    setEditedAnalysis({
      ...editedAnalysis,
      sections: updatedSections
    });
  };
  
  // Aggiungi una parola chiave a una sezione
  const handleAddSectionKeyword = (sectionIndex) => {
    const updatedSections = [...editedAnalysis.sections];
    updatedSections[sectionIndex] = {
      ...updatedSections[sectionIndex],
      keywords: [...(updatedSections[sectionIndex].keywords || []), '']
    };
    setEditedAnalysis({
      ...editedAnalysis,
      sections: updatedSections
    });
  };
  
  // Modifica una parola chiave di una sezione
  const handleSectionKeywordChange = (sectionIndex, keywordIndex, value) => {
    const updatedSections = [...editedAnalysis.sections];
    const updatedKeywords = [...updatedSections[sectionIndex].keywords];
    updatedKeywords[keywordIndex] = value;
    updatedSections[sectionIndex] = {
      ...updatedSections[sectionIndex],
      keywords: updatedKeywords
    };
    setEditedAnalysis({
      ...editedAnalysis,
      sections: updatedSections
    });
  };
  
  // Rimuovi una parola chiave da una sezione
  const handleRemoveSectionKeyword = (sectionIndex, keywordIndex) => {
    const updatedSections = [...editedAnalysis.sections];
    const updatedKeywords = [...updatedSections[sectionIndex].keywords];
    updatedKeywords.splice(keywordIndex, 1);
    updatedSections[sectionIndex] = {
      ...updatedSections[sectionIndex],
      keywords: updatedKeywords
    };
    setEditedAnalysis({
      ...editedAnalysis,
      sections: updatedSections
    });
  };
  
  // Rimuovi una sezione
  const handleRemoveSection = (index) => {
    const updatedSections = [...editedAnalysis.sections];
    updatedSections.splice(index, 1);
    setEditedAnalysis({
      ...editedAnalysis,
      sections: updatedSections
    });
  };
  
  return (
    <Box>
      {/* Barra superiore con pulsanti */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: { xs: 1.5, sm: 2 },
        flexWrap: 'wrap',
        gap: 1
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            color: theme.palette.primary.main,
            fontSize: { xs: '1.125rem', sm: '1.25rem' }
          }}
        >
          Analisi
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          {isEditing ? (
            <>
              <Tooltip title="Salva modifiche">
                <IconButton 
                  color="primary" 
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
                  color="default" 
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
              <PDFDownloadLink 
                document={<AnalysisPDF analysis={analysis} />} 
                fileName="analisi.pdf"
                style={{ textDecoration: 'none' }}
              >
                {({ loading, error }) => (
                  <>
                    <Tooltip title="Esporta PDF">
                      <IconButton
                        color="primary"
                        size="small"
                        disabled={loading}
                        sx={{ display: { xs: 'flex', sm: 'none' } }}
                      >
                        <PdfIcon />
                      </IconButton>
                    </Tooltip>
                    <Button
                      variant="outlined"
                      startIcon={<PdfIcon />}
                      disabled={loading}
                      size="small"
                      sx={{ 
                        display: { xs: 'none', sm: 'flex' },
                        borderRadius: 2,
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        '&:hover': {
                          backgroundColor: 'rgba(240,44,86,0.04)',
                          borderColor: theme.palette.primary.main,
                        }
                      }}
                    >
                      {loading ? 'Preparazione...' : 'Esporta PDF'}
                    </Button>
                  </>
                )}
              </PDFDownloadLink>
              
              {typeof onAnalysisChange === 'function' && (
                <>
                  <Tooltip title="Modifica">
                    <IconButton 
                      color="default" 
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
            </>
          )}
        </Box>
      </Box>
      
      {/* Contenuto */}
      <Box sx={{ p: { xs: 0.5, sm: 1 } }}>
        {isEditing ? (
          // MODALITÀ MODIFICA
          <>
            {/* Riepilogo */}
            <Box sx={{ mb: { xs: 2, sm: 3 } }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: { xs: 0.5, sm: 1 }
              }}>
                <InfoIcon sx={{ 
                  color: theme.palette.primary.main, 
                  mr: 1,
                  fontSize: { xs: '1.25rem', sm: '1.5rem' }
                }} />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: theme.palette.primary.main,
                    fontSize: { xs: '1rem', sm: '1.25rem' }
                  }}
                >
                  Riepilogo
                </Typography>
              </Box>
              <TextField
                multiline
                fullWidth
                value={editedAnalysis.summary}
                onChange={(e) => setEditedAnalysis({...editedAnalysis, summary: e.target.value})}
                variant="outlined"
                minRows={3}
                maxRows={10}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: theme.palette.background.paper,
                    borderRadius: 2,
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    lineHeight: { xs: 1.5, sm: 1.75 }
                  }
                }}
              />
            </Box>
            
            {/* Tono */}
            <Box sx={{ mb: { xs: 2, sm: 3 } }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: { xs: 0.5, sm: 1 }
              }}>
                <LightbulbIcon sx={{ 
                  color: theme.palette.primary.main, 
                  mr: 1,
                  fontSize: { xs: '1.25rem', sm: '1.5rem' }
                }} />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: theme.palette.primary.main,
                    fontSize: { xs: '1rem', sm: '1.25rem' }
                  }}
                >
                  Tono
                </Typography>
              </Box>
              <TextField
                fullWidth
                value={editedAnalysis.tone || ''}
                onChange={(e) => setEditedAnalysis({...editedAnalysis, tone: e.target.value})}
                placeholder="Inserisci il tono (es. formale, informale, tecnico)"
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: theme.palette.background.paper,
                    borderRadius: 2,
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }
                }}
              />
            </Box>
            
            {/* Parole chiave */}
            <Box sx={{ mb: { xs: 2, sm: 3 } }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                mb: { xs: 0.5, sm: 1 }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LabelIcon sx={{ 
                    color: theme.palette.primary.main, 
                    mr: 1,
                    fontSize: { xs: '1.25rem', sm: '1.5rem' }
                  }} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: theme.palette.primary.main,
                      fontSize: { xs: '1rem', sm: '1.25rem' }
                    }}
                  >
                    Parole chiave
                  </Typography>
                </Box>
                <Tooltip title="Aggiungi parola chiave">
                  <IconButton 
                    size="small" 
                    color="primary"
                    onClick={handleAddKeyword}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              
              <Stack spacing={1}>
                {editedAnalysis.keywords.map((keyword, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                      fullWidth
                      value={keyword}
                      onChange={(e) => handleKeywordChange(index, e.target.value)}
                      placeholder="Parola chiave"
                      variant="outlined"
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: theme.palette.background.paper,
                          borderRadius: 2,
                          fontSize: { xs: '0.875rem', sm: '1rem' }
                        }
                      }}
                    />
                    <Tooltip title="Rimuovi">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleRemoveKeyword(index)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                ))}
              </Stack>
            </Box>
            
            {/* Sezioni tematiche */}
            <Box>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                mb: { xs: 0.5, sm: 1 }
              }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: theme.palette.primary.main,
                    fontSize: { xs: '1rem', sm: '1.25rem' }
                  }}
                >
                  Sezioni tematiche
                </Typography>
                <Tooltip title="Aggiungi sezione">
                  <IconButton 
                    size="small" 
                    color="primary"
                    onClick={handleAddSection}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              
              {editedAnalysis.sections && editedAnalysis.sections.map((section, sectionIndex) => (
                <Box 
                  key={sectionIndex} 
                  sx={{ 
                    mb: { xs: 1.5, sm: 2 },
                    p: { xs: 1, sm: 2 },
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    backgroundColor: theme.palette.background.paper
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    mb: { xs: 1, sm: 2 }
                  }}>
                    <TextField
                      fullWidth
                      value={section.title}
                      onChange={(e) => handleSectionChange(sectionIndex, 'title', e.target.value)}
                      placeholder="Titolo sezione"
                      variant="outlined"
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: theme.palette.background.paper,
                          borderRadius: 2,
                          fontSize: { xs: '0.875rem', sm: '1rem' }
                        }
                      }}
                    />
                    <Tooltip title="Rimuovi sezione">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleRemoveSection(sectionIndex)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  
                  <TextField
                    multiline
                    fullWidth
                    value={section.content}
                    onChange={(e) => handleSectionChange(sectionIndex, 'content', e.target.value)}
                    placeholder="Contenuto della sezione"
                    variant="outlined"
                    minRows={2}
                    maxRows={6}
                    sx={{
                      mb: { xs: 1, sm: 2 },
                      '& .MuiOutlinedInput-root': {
                        bgcolor: theme.palette.background.paper,
                        borderRadius: 2,
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        lineHeight: { xs: 1.5, sm: 1.75 }
                      }
                    }}
                  />
                  
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    mb: { xs: 0.5, sm: 1 }
                  }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 500, 
                        color: theme.palette.text.primary,
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                      }}
                    >
                      Parole chiave della sezione
                    </Typography>
                    <Tooltip title="Aggiungi parola chiave">
                      <IconButton 
                        size="small" 
                        onClick={() => handleAddSectionKeyword(sectionIndex)}
                        sx={{ color: theme.palette.primary.main }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  
                  <Stack spacing={1}>
                    {section.keywords && section.keywords.map((keyword, keywordIndex) => (
                      <Box key={keywordIndex} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TextField
                          fullWidth
                          value={keyword}
                          onChange={(e) => handleSectionKeywordChange(sectionIndex, keywordIndex, e.target.value)}
                          placeholder="Parola chiave"
                          variant="outlined"
                          size="small"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              bgcolor: theme.palette.background.paper,
                              borderRadius: 2,
                              fontSize: { xs: '0.875rem', sm: '1rem' }
                            }
                          }}
                        />
                        <Tooltip title="Rimuovi">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleRemoveSectionKeyword(sectionIndex, keywordIndex)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              ))}
            </Box>
          </>
        ) : (
          // MODALITÀ VISUALIZZAZIONE
          <>
            {/* Riepilogo */}
            <Box sx={{ mb: { xs: 2, sm: 3 } }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: { xs: 0.5, sm: 1 }
              }}>
                <InfoIcon sx={{ 
                  color: theme.palette.primary.main, 
                  mr: 1,
                  fontSize: { xs: '1.25rem', sm: '1.5rem' }
                }} />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: theme.palette.primary.main,
                    fontSize: { xs: '1rem', sm: '1.25rem' }
                  }}
                >
                  Riepilogo
                </Typography>
              </Box>
              <Typography 
                variant="body1" 
                sx={{ 
                  whiteSpace: 'pre-wrap', 
                  lineHeight: { xs: 1.5, sm: 1.75 },
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                {summary}
              </Typography>
            </Box>
            
            {/* Tono */}
            {tone && (
              <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: { xs: 0.5, sm: 1 }
                }}>
                  <LightbulbIcon sx={{ 
                    color: theme.palette.primary.main, 
                    mr: 1,
                    fontSize: { xs: '1.25rem', sm: '1.5rem' }
                  }} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: theme.palette.primary.main,
                      fontSize: { xs: '1rem', sm: '1.25rem' }
                    }}
                  >
                    Tono
                  </Typography>
                </Box>
                <Chip 
                  label={tone} 
                  sx={{ 
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(240,44,86,0.2)' 
                      : 'rgba(240,44,86,0.1)',
                    color: theme.palette.primary.main,
                    fontWeight: 500,
                    borderRadius: 4,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    height: { xs: 24, sm: 32 }
                  }} 
                />
              </Box>
            )}
            
            {/* Parole chiave - Tag Cloud */}
            {keywords && keywords.length > 0 && (
              <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: { xs: 0.5, sm: 1 }
                }}>
                  <LabelIcon sx={{ 
                    color: theme.palette.primary.main, 
                    mr: 1,
                    fontSize: { xs: '1.25rem', sm: '1.5rem' }
                  }} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: theme.palette.primary.main,
                      fontSize: { xs: '1rem', sm: '1.25rem' }
                    }}
                  >
                    Parole chiave
                  </Typography>
                </Box>
                
                {/* Visualizzazione Tag Cloud */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  p: { xs: 1, sm: 2 }, 
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: 2,
                  mb: { xs: 1, sm: 2 },
                  overflow: 'hidden'
                }}>
                  <TagCloud
                    minSize={12}
                    maxSize={30}
                    tags={cloudData}
                    onClick={(tag) => onKeywordClick && onKeywordClick(tag.value)}
                    renderer={(tag, size, color) => (
                      <span
                        key={tag.value}
                        style={{
                          animation: 'blinker 3s linear infinite',
                          animationDelay: `${Math.random() * 2}s`,
                          fontSize: `${size}px`,
                          margin: '3px',
                          padding: '3px',
                          display: 'inline-block',
                          color: theme.palette.text.primary,
                          fontWeight: 'bold',
                          opacity: size / 30 + 0.5,
                          cursor: onKeywordClick ? 'pointer' : 'default',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            color: theme.palette.primary.main,
                            transform: 'scale(1.1)'
                          }
                        }}
                      >
                        {tag.value}
                      </span>
                    )}
                  />
                </Box>
              </Box>
            )}
            
            {/* Sezioni tematiche */}
            {sections && sections.length > 0 && (
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: theme.palette.primary.main,
                    mb: { xs: 0.5, sm: 1 },
                    fontSize: { xs: '1rem', sm: '1.25rem' }
                  }}
                >
                  Sezioni tematiche
                </Typography>
                {sections.map((section, index) => (
                  <Accordion 
                    key={index}
                    sx={{ 
                      mb: { xs: 0.5, sm: 1 },
                      borderRadius: '8px!important',
                      '&:before': { display: 'none' },
                      boxShadow: 'none',
                      border: `1px solid ${theme.palette.divider}`,
                      backgroundColor: theme.palette.background.paper
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{ 
                        borderRadius: 2,
                        backgroundColor: theme.palette.action.hover,
                        minHeight: { xs: 40, sm: 48 }
                      }}
                    >
                      <Typography 
                        sx={{ 
                          fontWeight: 500,
                          fontSize: { xs: '0.875rem', sm: '1rem' }
                        }}
                      >
                        {section.title}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: { xs: 1, sm: 2 } }}>
                      <Typography 
                        sx={{ 
                          mb: { xs: 1, sm: 2 },
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          lineHeight: { xs: 1.5, sm: 1.75 }
                        }}
                      >
                        {section.content}
                      </Typography>
                      {section.keywords && section.keywords.length > 0 && (
                        <Box sx={{ 
                          display: 'flex', 
                          flexWrap: 'wrap', 
                          gap: { xs: 0.5, sm: 1 }
                        }}>
                          {section.keywords.map((keyword, keywordIndex) => (
                            <Chip 
                              key={keywordIndex}
                              label={keyword}
                              size="small"
                              onClick={() => onKeywordClick(keyword)}
                              sx={{ 
                                backgroundColor: theme.palette.mode === 'dark' 
                                  ? 'rgba(240,44,86,0.2)' 
                                  : 'rgba(240,44,86,0.1)',
                                color: theme.palette.primary.main,
                                fontWeight: 500,
                                borderRadius: 4,
                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                height: { xs: 24, sm: 32 },
                                cursor: onKeywordClick ? 'pointer' : 'default',
                                '&:hover': onKeywordClick ? {
                                  backgroundColor: theme.palette.mode === 'dark' 
                                    ? 'rgba(240,44,86,0.3)' 
                                    : 'rgba(240,44,86,0.2)',
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
          </>
        )}
      </Box>
    </Box>
  );
};

export default AnalysisView; 