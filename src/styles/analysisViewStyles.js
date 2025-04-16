import {
  BORDERS,
  SPACING,
  TYPOGRAPHY,
  CHIP_STYLES,
  TEXT_FIELD_STYLES,
  ANIMATIONS
} from './themes';

/**
 * File di stili per il componente AnalysisView
 * Contiene tutti gli stili necessari per la visualizzazione e modifica dell'analisi,
 * utilizzando le costanti di stile definite nel file themes.js
 */

export const styles = {
  // Stili per il container principale
  container: {
    p: { xs: 0.5, sm: 1 }
  },
  
  // Stili per il titolo principale
  mainTitle: (theme) => ({
    color: theme.palette.primary.main,
    fontSize: TYPOGRAPHY.fontSize.lg,
    mb: SPACING.sm
  }),
  
  // Stili per le intestazioni delle sezioni
  sectionTitle: (theme) => ({
    color: theme.palette.primary.main,
    fontSize: { xs: '1rem', sm: '1.25rem' }
  }),
  
  // Stili per le icone
  icon: (theme) => ({
    color: theme.palette.primary.main, 
    mr: 1,
    fontSize: { xs: '1.25rem', sm: '1.5rem' }
  }),
  
  // Stili per i container delle sezioni
  sectionContainer: {
    mb: { xs: 2, sm: 3 }
  },
  
  // Stili per le intestazioni delle sezioni
  sectionHeader: {
    display: 'flex', 
    alignItems: 'center', 
    mb: { xs: 0.5, sm: 1 }
  },
  
  // Stili per campi di testo
  textField: (theme) => ({
    ...TEXT_FIELD_STYLES.base,
    '& .MuiOutlinedInput-root': {
      ...TEXT_FIELD_STYLES.base['& .MuiOutlinedInput-root'],
      bgcolor: theme.palette.background.paper,
      borderRadius: BORDERS.radius.sm,
      fontSize: { xs: '0.875rem', sm: '1rem' }
    }
  }),
  
  // Stili per chip (etichette)
  chip: (theme) => ({ 
    ...CHIP_STYLES.base,
    ...CHIP_STYLES.primary,
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(240,44,86,0.2)' 
      : 'rgba(240,44,86,0.1)',
    color: theme.palette.primary.main,
    fontWeight: TYPOGRAPHY.fontWeights.medium,
    borderRadius: BORDERS.radius.md,
    fontSize: { xs: '0.75rem', sm: '0.875rem' },
    height: { xs: 24, sm: 32 }
  }),
  
  // Stili per la barra superiore
  topBar: {
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    mb: { xs: 1.5, sm: 2 },
    flexWrap: 'wrap',
    gap: 1
  },
  
  // Stili per il contenitore delle azioni
  actionsContainer: {
    display: 'flex', 
    gap: 1
  },
  
  // Stili per i bottoni
  button: {
    borderRadius: BORDERS.radius.sm,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeights.medium
  },
  
  buttonPrimary: (theme) => ({
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: 'rgba(240,44,86,0.04)',
      borderColor: theme.palette.primary.main,
    }
  }),
  
  // Stili per gli accordion (sezioni tematiche)
  accordion: (theme) => ({
    mb: { xs: 0.5, sm: 1 },
    borderRadius: `${BORDERS.radius.lg}px!important`,
    '&:before': { display: 'none' },
    boxShadow: 'none',
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper
  }),
  
  accordionSummary: (theme) => ({
    borderRadius: BORDERS.radius.sm,
    backgroundColor: theme.palette.action.hover,
    minHeight: { xs: 40, sm: 48 }
  }),
  
  accordionTitle: {
    fontWeight: TYPOGRAPHY.fontWeights.medium,
    fontSize: { xs: '0.875rem', sm: '1rem' }
  },
  
  accordionDetails: {
    p: { xs: 1, sm: 2 }
  },
  
  accordionContent: {
    mb: { xs: 1, sm: 2 },
    fontSize: { xs: '0.875rem', sm: '1rem' },
    lineHeight: { xs: 1.5, sm: 1.75 }
  },
  
  // Stili per il contenitore delle parole chiave
  keywordsContainer: {
    display: 'flex', 
    flexWrap: 'wrap', 
    gap: { xs: 0.5, sm: 1 }
  },
  
  // Stili per la tagcloud - ora è una funzione che accetta il tema
  tagCloud: (theme) => ({
    display: 'flex', 
    justifyContent: 'center', 
    p: { xs: 1, sm: 2 }, 
    backgroundColor: theme.palette.background.paper,
    borderRadius: BORDERS.radius.sm,
    mb: { xs: 1, sm: 2 },
    overflow: 'hidden'
  }),
  
  // Stili per gli elementi del TagCloud
  tagCloudItem: (size, theme) => ({
    animation: `${ANIMATIONS.breathe} 3s linear infinite`,
    animationDelay: `${Math.random() * 2}s`,
    fontSize: `${size}px`,
    margin: '3px',
    padding: '3px',
    display: 'inline-block',
    color: theme.palette.text.primary,
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    opacity: size / 30 + 0.5,
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  }),
  
  // Stili per la sezione di modifica
  editorSection: (theme) => ({
    mb: { xs: 1.5, sm: 2 },
    p: { xs: 1, sm: 2 },
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: BORDERS.radius.sm,
    backgroundColor: theme.palette.background.paper
  }),
  
  editorHeader: {
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    mb: { xs: 1, sm: 2 }
  },
  
  smallHeading: (theme) => ({
    fontWeight: TYPOGRAPHY.fontWeights.medium, 
    color: theme.palette.text.primary,
    fontSize: { xs: '0.75rem', sm: '0.875rem' }
  })
};

export default styles; 