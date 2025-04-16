import {
  BORDERS,
  SPACING,
  TYPOGRAPHY,
  CHIP_STYLES,
  TEXT_FIELD_STYLES,
  ANIMATIONS,
  BUTTON_STYLES
} from './themes';

/**
 * File di stili per il componente AnalysisView
 * Contiene tutti gli stili necessari per la visualizzazione e modifica dell'analisi,
 * utilizzando le costanti di stile definite nel file themes.js
 */

export const styles = {
  /**
   * Layout Principale
   */
  container: {
    p: { xs: SPACING.xs.xs, sm: SPACING.xs.sm }
  },
  
  mainTitle: (theme) => ({
    color: theme.palette.primary.main,
    fontSize: TYPOGRAPHY.fontSize.lg.xs,
    mb: SPACING.sm.xs
  }),
  
  /**
   * Sezioni e Intestazioni
   */
  sectionTitle: (theme) => ({
    color: theme.palette.primary.main,
    fontSize: { xs: TYPOGRAPHY.fontSize.md.xs, sm: TYPOGRAPHY.fontSize.lg.xs }
  }),
  
  icon: (theme) => ({
    color: theme.palette.primary.main, 
    mr: SPACING.xs.xs,
    fontSize: { xs: '1.25rem', sm: '1.5rem' }
  }),
  
  sectionContainer: {
    mb: { xs: SPACING.sm.xs, sm: SPACING.md.xs }
  },
  
  sectionHeader: {
    display: 'flex', 
    alignItems: 'center', 
    mb: { xs: SPACING.xs.xs, sm: SPACING.xs.sm }
  },
  
  /**
   * Campi di Testo e Input
   */
  textField: (theme) => ({
    ...TEXT_FIELD_STYLES.base,
    '& .MuiOutlinedInput-root': {
      ...TEXT_FIELD_STYLES.base['& .MuiOutlinedInput-root'],
      bgcolor: theme.palette.background.paper,
      borderRadius: BORDERS.radius.sm,
      fontSize: { xs: TYPOGRAPHY.fontSize.sm.xs, sm: TYPOGRAPHY.fontSize.md.xs }
    }
  }),
  
  /**
   * Etichette e Chip
   */
  chip: (theme) => ({ 
    ...CHIP_STYLES.base,
    ...CHIP_STYLES.primary,
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(240,44,86,0.2)' 
      : 'rgba(240,44,86,0.1)',
    color: theme.palette.primary.main,
    fontWeight: TYPOGRAPHY.fontWeights.medium,
    borderRadius: BORDERS.radius.sm,
    fontSize: { xs: TYPOGRAPHY.fontSize.xs.xs, sm: TYPOGRAPHY.fontSize.sm.xs },
    height: { xs: 24, sm: 32 }
  }),
  
  /**
   * Barra Superiore e Azioni
   */
  topBar: {
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    mb: { xs: SPACING.sm.xs, sm: SPACING.md.xs },
    flexWrap: 'wrap',
    gap: SPACING.xs.xs
  },
  
  actionsContainer: {
    display: 'flex', 
    gap: SPACING.xs.xs
  },
  
  /**
   * Pulsanti
   */
  button: {
    ...BUTTON_STYLES.base,
    fontSize: TYPOGRAPHY.fontSize.sm.xs,
    fontWeight: TYPOGRAPHY.fontWeights.medium
  },
  
  buttonPrimary: (theme) => ({
    ...BUTTON_STYLES.base,
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    '&:hover': {
      ...BUTTON_STYLES.base['&:hover'],
      backgroundColor: 'rgba(240,44,86,0.04)',
      borderColor: theme.palette.primary.main
    }
  }),
  
  /**
   * Accordion e Sezioni Tematiche
   */
  accordion: (theme) => ({
    mb: { xs: SPACING.xs.xs, sm: SPACING.xs.sm },
    borderRadius: `${BORDERS.radius.md}px!important`,
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
    fontSize: { xs: TYPOGRAPHY.fontSize.sm.xs, sm: TYPOGRAPHY.fontSize.md.xs }
  },
  
  accordionDetails: {
    p: { xs: SPACING.xs.xs, sm: SPACING.sm.xs }
  },
  
  accordionContent: {
    mb: { xs: SPACING.xs.sm, sm: SPACING.sm.xs },
    fontSize: { xs: TYPOGRAPHY.fontSize.sm.xs, sm: TYPOGRAPHY.fontSize.md.xs },
    lineHeight: { xs: TYPOGRAPHY.lineHeight.tight, sm: TYPOGRAPHY.lineHeight.normal }
  },
  
  /**
   * Parole Chiave e Tag Cloud
   */
  keywordsContainer: {
    display: 'flex', 
    flexWrap: 'wrap', 
    gap: { xs: SPACING.xs.xs, sm: SPACING.xs.sm }
  },
  
  tagCloud: (theme) => ({
    display: 'flex', 
    justifyContent: 'center', 
    p: { xs: SPACING.xs.xs, sm: SPACING.sm.xs }, 
    backgroundColor: theme.palette.background.paper,
    borderRadius: BORDERS.radius.sm,
    mb: { xs: SPACING.xs.sm, sm: SPACING.sm.xs },
    overflow: 'hidden'
  }),
  
  tagCloudItem: (size, theme) => ({
    animation: `${ANIMATIONS.breathe} 3s linear infinite`,
    animationDelay: `${Math.random() * 2}s`,
    fontSize: `${size}px`,
    margin: SPACING.xs.xs,
    padding: SPACING.xs.xs,
    display: 'inline-block',
    color: theme.palette.text.primary,
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    opacity: size / 30 + 0.5,
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  }),
  
  /**
   * Sezione di Modifica
   */
  editorSection: (theme) => ({
    mb: { xs: SPACING.sm.xs, sm: SPACING.sm.sm },
    p: { xs: SPACING.xs.xs, sm: SPACING.sm.xs },
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: BORDERS.radius.sm,
    backgroundColor: theme.palette.background.paper
  }),
  
  editorHeader: {
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    mb: { xs: SPACING.xs.sm, sm: SPACING.sm.xs }
  },
  
  smallHeading: (theme) => ({
    fontWeight: TYPOGRAPHY.fontWeights.medium, 
    color: theme.palette.text.primary,
    fontSize: { xs: TYPOGRAPHY.fontSize.xs.xs, sm: TYPOGRAPHY.fontSize.sm.xs }
  })
};

export default styles; 