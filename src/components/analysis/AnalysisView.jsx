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
  Stack
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
import styles from '../../styles/analysisViewStyles';
import { BORDERS } from '../../styles/themes';

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
  
  // Componente per l'intestazione delle sezioni
  const SectionHeader = ({ icon: Icon, title }) => (
    <Box sx={styles.sectionHeader}>
      <Icon sx={styles.icon(theme)} aria-hidden="true" />
      <Typography variant="h6" sx={styles.sectionTitle(theme)}>
        {title}
      </Typography>
    </Box>
  );
  
  return (
    <Box>
      {/* Barra superiore con pulsanti */}
      <Box sx={styles.topBar}>
        <Typography variant="h6" sx={styles.sectionTitle(theme)}>
          Analisi
        </Typography>
        
        <Box sx={styles.actionsContainer}>
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
                sx={{ display: { xs: 'none', sm: 'flex' }, borderRadius: BORDERS.radius.sm }}
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
                sx={{ display: { xs: 'none', sm: 'flex' }, borderRadius: BORDERS.radius.sm }}
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
                        borderRadius: BORDERS.radius.sm,
                        ...styles.buttonPrimary(theme)
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
                    sx={{ display: { xs: 'none', sm: 'flex' }, borderRadius: BORDERS.radius.sm }}
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
      <Box sx={styles.container}>
        {isEditing ? (
          // MODALITÀ MODIFICA
          <>
            {/* Riepilogo */}
            <Box sx={styles.sectionContainer}>
              <SectionHeader icon={InfoIcon} title="Riepilogo" />
              <TextField
                multiline
                fullWidth
                value={editedAnalysis.summary}
                onChange={(e) => setEditedAnalysis({...editedAnalysis, summary: e.target.value})}
                variant="outlined"
                minRows={3}
                maxRows={10}
                sx={styles.textField(theme)}
              />
            </Box>
            
            {/* Tono */}
            <Box sx={styles.sectionContainer}>
              <SectionHeader icon={LightbulbIcon} title="Tono" />
              <TextField
                fullWidth
                value={editedAnalysis.tone || ''}
                onChange={(e) => setEditedAnalysis({...editedAnalysis, tone: e.target.value})}
                placeholder="Inserisci il tono (es. formale, informale, tecnico)"
                variant="outlined"
                size="small"
                sx={styles.textField(theme)}
              />
            </Box>
            
            {/* Parole chiave */}
            <Box sx={styles.sectionContainer}>
              <Box sx={styles.editorHeader}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LabelIcon sx={styles.icon(theme)} />
                  <Typography variant="h6" sx={styles.sectionTitle(theme)}>
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
                      sx={styles.textField(theme)}
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
              <Box sx={styles.editorHeader}>
                <Typography variant="h6" sx={styles.sectionTitle(theme)}>
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
                <Box key={sectionIndex} sx={styles.editorSection(theme)}>
                  <Box sx={styles.editorHeader}>
                    <TextField
                      fullWidth
                      value={section.title}
                      onChange={(e) => handleSectionChange(sectionIndex, 'title', e.target.value)}
                      placeholder="Titolo sezione"
                      variant="outlined"
                      size="small"
                      sx={styles.textField(theme)}
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
                      ...styles.textField(theme)
                    }}
                  />
                  
                  <Box sx={styles.editorHeader}>
                    <Typography variant="body2" sx={styles.smallHeading(theme)}>
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
                          sx={styles.textField(theme)}
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
            <Box sx={styles.sectionContainer}>
              <SectionHeader icon={InfoIcon} title="Riepilogo" />
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
              <Box sx={styles.sectionContainer}>
                <SectionHeader icon={LightbulbIcon} title="Tono" />
                <Chip label={tone} sx={styles.chip(theme)} />
              </Box>
            )}
            
            {/* Parole chiave - Tag Cloud */}
            {keywords && keywords.length > 0 && (
              <Box sx={styles.sectionContainer}>
                <SectionHeader icon={LabelIcon} title="Parole chiave" />
                
                {/* Visualizzazione Tag Cloud */}
                <Box sx={styles.tagCloud(theme)} role="list" aria-label="Nuvola di parole chiave">
                  <TagCloud
                    minSize={12}
                    maxSize={30}
                    tags={cloudData}
                    onClick={(tag) => onKeywordClick && onKeywordClick(tag.value)}
                    renderer={(tag, size, color) => (
                      <span
                        key={tag.value}
                        style={styles.tagCloudItem(size, theme)}
                        role="listitem"
                        aria-label={`Parola chiave: ${tag.value}`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onKeywordClick && onKeywordClick(tag.value);
                          }
                        }}
                        tabIndex={0}
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
                <Typography variant="h6" sx={styles.sectionTitle(theme)}>
                  Sezioni tematiche
                </Typography>
                {sections.map((section, index) => (
                  <Accordion key={index} sx={styles.accordion(theme)}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={styles.accordionSummary(theme)}>
                      <Typography sx={styles.accordionTitle}>
                        {section.title}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={styles.accordionDetails}>
                      <Typography sx={styles.accordionContent}>
                        {section.content}
                      </Typography>
                      {section.keywords && section.keywords.length > 0 && (
                        <Box sx={styles.keywordsContainer}>
                          {section.keywords.map((keyword, keywordIndex) => (
                            <Chip 
                              key={keywordIndex}
                              label={keyword}
                              size="small"
                              onClick={() => onKeywordClick(keyword)}
                              sx={{
                                ...styles.chip(theme),
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