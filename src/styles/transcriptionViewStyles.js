import { 
  BORDERS, 
  SPACING, 
  TYPOGRAPHY, 
  BUTTON_STYLES
} from './themes';

/**
 * Stili centralizzati per il componente TranscriptionView
 * Estende correttamente gli stili base di themes.js
 */

/**
 * Stili per il componente TabPanel
 * Contenitore principale per il contenuto di ogni tab
 */
export const tabPanelStyles = {
  container: {
    p: { xs: SPACING.sm.xs, sm: SPACING.sm.sm, md: SPACING.md.xs },
    overflow: 'auto'
  }
};

/**
 * Funzione per generare lo stile di evidenziazione in base al tema
 * Usata per evidenziare parti di testo nella trascrizione
 */
export const getHighlightStyle = (isDarkMode) => {
  return `background-color: ${isDarkMode ? 'rgba(240, 44, 86, 0.3)' : 'rgba(240, 44, 86, 0.15)'}; color: inherit; padding: 0 4px; border-radius: ${BORDERS.radius.xs}px;`;
};

/**
 * Stili per il componente TranscriptionView
 * Organizzati per area funzionale
 */
const styles = {
  // Container principale
  container: { 
    width: '100%' 
  },
  
  /**
   * Area Tabs e Navigazione
   */
  tabsContainer: {
    borderBottom: 1, 
    borderColor: 'divider',
    mb: { xs: SPACING.xs.xs, sm: SPACING.sm.xs },
    position: 'sticky',
    top: 0,
    zIndex: 1
  },
  
  tabs: {
    '& .MuiTab-root': {
      minHeight: { xs: 44, sm: 52 },
      fontSize: { xs: TYPOGRAPHY.fontSize.xs.xs, sm: TYPOGRAPHY.fontSize.xs.sm },
      px: { xs: SPACING.xs.xs, sm: SPACING.sm.xs },
    }
  },
  
  tab: {
    flexDirection: { xs: 'row', sm: 'column' },
    gap: { xs: SPACING.xs.xs, sm: 0 },
    '& .MuiTab-iconWrapper': {
      mr: { xs: SPACING.xs.xs, sm: 0 }
    }
  },
  
  /**
   * Area Trascrizione
   */
  textContainer: { 
    position: 'relative',
    mb: { xs: SPACING.sm.xs, sm: SPACING.md.xs }
  },
  
  transcriptionControls: { 
    display: 'flex', 
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: SPACING.xs.xs,
    mb: { xs: SPACING.xs.xs, sm: SPACING.sm.xs }
  },
  
  switchLabel: { 
    fontSize: { xs: TYPOGRAPHY.fontSize.xs.xs, sm: TYPOGRAPHY.fontSize.xs.sm } 
  },
  
  buttonsContainer: { 
    display: 'flex', 
    gap: SPACING.xs.xs 
  },
  
  mobileButton: { 
    display: { xs: 'flex', sm: 'none' } 
  },
  
  desktopButton: { 
    ...BUTTON_STYLES.base,
    display: { xs: 'none', sm: 'flex' },
    fontSize: TYPOGRAPHY.fontSize.xs.sm,
    py: 0.75
  },
  
  textField: {
    '& .MuiOutlinedInput-root': {
      fontSize: { xs: TYPOGRAPHY.fontSize.sm.xs, sm: TYPOGRAPHY.fontSize.md.xs },
      lineHeight: { xs: TYPOGRAPHY.lineHeight.tight, sm: TYPOGRAPHY.lineHeight.normal }
    }
  },
  
  transcriptionText: {
    whiteSpace: 'pre-wrap',
    fontSize: { xs: TYPOGRAPHY.fontSize.sm.xs, sm: TYPOGRAPHY.fontSize.md.xs },
    lineHeight: { xs: TYPOGRAPHY.lineHeight.tight, sm: TYPOGRAPHY.lineHeight.normal },
    wordBreak: 'break-word'
  },
  
  /**
   * Area Banner e Azioni
   */
  reanalysisBanner: {
    mt: { xs: SPACING.sm.xs, sm: SPACING.md.xs },
    p: { xs: 1.5, sm: SPACING.sm.xs },
    borderRadius: BORDERS.radius.sm,
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    alignItems: { xs: 'stretch', sm: 'center' },
    gap: { xs: SPACING.xs.xs, sm: SPACING.sm.xs }
  },
  
  bannerText: { 
    flex: 1,
    fontSize: { xs: TYPOGRAPHY.fontSize.xs.xs, sm: TYPOGRAPHY.fontSize.sm.xs }
  },
  
  bannerButtons: { 
    display: 'flex', 
    gap: SPACING.xs.xs,
    justifyContent: { xs: 'flex-end', sm: 'flex-start' }
  },
  
  bannerButton: { 
    ...BUTTON_STYLES.base,
    fontSize: TYPOGRAPHY.fontSize.xs.sm,
    py: 0.75
  },
  
  /**
   * Area Stati (Loading, Error, ecc.)
   */
  loadingContainer: { 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    gap: SPACING.sm.xs,
    p: { xs: SPACING.sm.xs, sm: SPACING.md.xs }
  },
  
  loadingText: { 
    fontSize: { xs: TYPOGRAPHY.fontSize.xs.xs, sm: TYPOGRAPHY.fontSize.sm.xs } 
  },
  
  errorContainer: { 
    textAlign: 'center', 
    p: { xs: SPACING.sm.xs, sm: SPACING.md.xs }
  },
  
  errorText: { 
    fontSize: { xs: TYPOGRAPHY.fontSize.sm.xs, sm: TYPOGRAPHY.fontSize.md.xs } 
  },
  
  retryButton: {
    ...BUTTON_STYLES.base, 
    mt: { xs: SPACING.xs.xs, sm: SPACING.sm.xs },
    fontSize: TYPOGRAPHY.fontSize.xs.sm,
    py: 0.75
  },
  
  /**
   * Area Analisi
   */
  analyzeContainer: { 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center',
    gap: SPACING.sm.xs,
    p: { xs: SPACING.sm.xs, sm: SPACING.md.xs }
  },
  
  analyzeButton: { 
    ...BUTTON_STYLES.base,
    ...BUTTON_STYLES.filled,
    fontSize: TYPOGRAPHY.fontSize.xs.sm,
    py: 0.75,
    '&:hover': {
      ...BUTTON_STYLES.filled['&:hover'],
      transform: BUTTON_STYLES.base['&:hover'].transform
    }
  }
};

export default styles; 