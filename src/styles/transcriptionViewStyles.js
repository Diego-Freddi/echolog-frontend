import { 
  COLORS, 
  BORDERS, 
  SPACING, 
  TYPOGRAPHY, 
  SHADOWS 
} from './themes';

// Stili per il componente TabPanel
export const tabPanelStyles = {
  container: {
    p: { xs: 1, sm: 2, md: 3 },
    overflow: 'auto'
  }
};

// Funzione per generare lo stile di evidenziazione in base al tema
export const getHighlightStyle = (isDarkMode) => {
  return `background-color: ${isDarkMode ? 'rgba(240, 44, 86, 0.3)' : 'rgba(240, 44, 86, 0.15)'}; color: inherit; padding: 0 4px; border-radius: ${BORDERS.radius.xs}px;`;
};

// Stili per il componente TranscriptionView
const styles = {
  // Container principale
  container: { 
    width: '100%' 
  },
  
  // Tabs container
  tabsContainer: {
    borderBottom: 1, 
    borderColor: 'divider',
    mb: { xs: 1, sm: 2 },
    position: 'sticky',
    top: 0,
    zIndex: 1
  },
  
  // Tabs
  tabs: {
    '& .MuiTab-root': {
      minHeight: { xs: 44, sm: 52 },
      fontSize: { xs: '0.7rem', sm: '0.8rem' },
      px: { xs: 1, sm: 2 },
    }
  },
  
  // Tab singola
  tab: {
    flexDirection: { xs: 'row', sm: 'column' },
    gap: { xs: 1, sm: 0 },
    '& .MuiTab-iconWrapper': {
      mr: { xs: 1, sm: 0 }
    }
  },
  
  // Contenitore testo trascrizione
  textContainer: { 
    position: 'relative',
    mb: { xs: 2, sm: 3 }
  },
  
  // Controlli trascrizione
  transcriptionControls: { 
    display: 'flex', 
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 1,
    mb: { xs: 1, sm: 2 }
  },
  
  // Label switch
  switchLabel: { 
    fontSize: { xs: '0.75rem', sm: '0.875rem' } 
  },
  
  // Container pulsanti
  buttonsContainer: { 
    display: 'flex', 
    gap: 1 
  },
  
  // Pulsante mobile
  mobileButton: { 
    display: { xs: 'flex', sm: 'none' } 
  },
  
  // Pulsante desktop
  desktopButton: { 
    display: { xs: 'none', sm: 'flex' },
    borderRadius: BORDERS.radius.xs,
    fontSize: '0.85rem',
    py: 0.75
  },
  
  // Textarea modifica
  textField: {
    '& .MuiOutlinedInput-root': {
      fontSize: { xs: '0.875rem', sm: '1rem' },
      lineHeight: { xs: 1.5, sm: 1.75 }
    }
  },
  
  // Testo trascrizione
  transcriptionText: {
    whiteSpace: 'pre-wrap',
    fontSize: { xs: '0.875rem', sm: '1rem' },
    lineHeight: { xs: 1.5, sm: 1.75 },
    wordBreak: 'break-word'
  },
  
  // Banner rianalisi
  reanalysisBanner: {
    mt: { xs: 2, sm: 3 },
    p: { xs: 1.5, sm: 2 },
    borderRadius: BORDERS.radius.xs,
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    alignItems: { xs: 'stretch', sm: 'center' },
    gap: { xs: 1, sm: 2 }
  },
  
  // Testo banner
  bannerText: { 
    flex: 1,
    fontSize: { xs: '0.75rem', sm: '0.875rem' }
  },
  
  // Container pulsanti banner
  bannerButtons: { 
    display: 'flex', 
    gap: 1,
    justifyContent: { xs: 'flex-end', sm: 'flex-start' }
  },
  
  // Pulsante banner
  bannerButton: { 
    borderRadius: BORDERS.radius.xs,
    fontSize: '0.85rem',
    py: 0.75
  },
  
  // Container caricamento
  loadingContainer: { 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    gap: 2,
    p: { xs: 2, sm: 3 }
  },
  
  // Testo caricamento
  loadingText: { 
    fontSize: { xs: '0.75rem', sm: '0.875rem' } 
  },
  
  // Container errore
  errorContainer: { 
    textAlign: 'center', 
    p: { xs: 2, sm: 3 }
  },
  
  // Testo errore
  errorText: { 
    fontSize: { xs: '0.875rem', sm: '1rem' } 
  },
  
  // Pulsante retry
  retryButton: { 
    mt: { xs: 1, sm: 2 },
    borderRadius: BORDERS.radius.xs,
    fontSize: '0.85rem',
    py: 0.75
  },
  
  // Container analisi
  analyzeContainer: { 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center',
    gap: 2,
    p: { xs: 2, sm: 3 }
  },
  
  // Pulsante analizza
  analyzeButton: { 
    borderRadius: BORDERS.radius.xs,
    backgroundColor: COLORS.neutral.lightGray,
    color: COLORS.neutral.black,
    boxShadow: SHADOWS.sm,
    transition: 'all 0.2s ease-in-out',
    fontSize: '0.85rem',
    py: 0.75,
    '&:hover': {
      backgroundColor: COLORS.neutral.mediumGray,
      boxShadow: SHADOWS.md,
      transform: 'translateY(-1px)'
    }
  }
};

export default styles; 