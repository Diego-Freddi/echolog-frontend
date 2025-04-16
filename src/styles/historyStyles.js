import { 
  COLORS, 
  GRADIENTS, 
  SHADOWS, 
  BORDERS, 
  CARD_STYLES,
  TYPOGRAPHY,
  BUTTON_STYLES,
  CHIP_STYLES,
  CONTAINER_STYLES,
  SPACING
} from './themes';

/**
 * Stili centralizzati per la pagina History dell'applicazione EchoLog
 * Estende correttamente gli stili base di themes.js
 */

/**
 * Tabs e Navigazione
 * Stili per i tabs e gli indicatori di selezione
 */
export const tabStyles = {
  container: {
    borderBottom: 1, 
    borderColor: 'divider',
    '& .MuiTabs-flexContainer': {
      justifyContent: 'center',
    },
    mb: SPACING.md.xs
  },
  tabs: {
    '& .MuiTab-root': {
      textTransform: 'none',
      fontWeight: TYPOGRAPHY.fontWeights.medium,
      fontSize: TYPOGRAPHY.fontSize.md.xs,
      minWidth: 120,
    },
    '& .Mui-selected': {
      fontWeight: TYPOGRAPHY.fontWeights.semibold,
      color: COLORS.primary.main,
    },
    '& .MuiTabs-indicator': {
      backgroundColor: COLORS.primary.main,
      height: BORDERS.width.medium,
      borderRadius: `${BORDERS.radius.xs}px ${BORDERS.radius.xs}px 0 0`,
    }
  }
};

/**
 * Card Statistiche
 * Stili per le card che visualizzano dati statistici
 */
export const statCardStyles = {
  card: {
    ...CARD_STYLES.base,
    height: '100%',
  },
  content: { 
    p: SPACING.md.xs 
  },
  header: { 
    display: 'flex', 
    alignItems: 'center', 
    mb: SPACING.sm.xs 
  },
  icon: (color) => ({ 
    color: color || COLORS.primary.main, 
    mr: SPACING.xs.xs 
  }),
  title: {
    fontWeight: TYPOGRAPHY.fontWeights.semibold
  },
  value: { 
    fontWeight: TYPOGRAPHY.fontWeights.semibold 
  }
};

/**
 * Tabella Cronologia
 * Stili per la visualizzazione tabulare delle registrazioni
 */
export const historyTableStyles = {
  container: { 
    mb: SPACING.md.xs, 
    p: 0, 
    overflow: { xs: 'auto', sm: 'hidden' },
    borderRadius: BORDERS.radius.md
  },
  table: { 
    minWidth: { xs: 400, sm: 650 } 
  },
  header: { 
    backgroundColor: 'rgba(240, 44, 86, 0.03)',
    '& th': { 
      fontWeight: TYPOGRAPHY.fontWeights.semibold, 
      py: 1.5 
    }
  },
  row: (theme) => ({
    '&:last-child td, &:last-child th': { border: 0 },
    '&:hover': { 
      backgroundColor: theme.palette.action.hover,
      transition: 'all 0.2s'
    }
  }),
  cell: {
    display: 'flex', 
    alignItems: 'center'
  },
  cellIcon: (color) => ({ 
    color: color || COLORS.secondary.main, 
    mr: SPACING.xs.xs, 
    fontSize: { xs: 16, sm: 20 } 
  }),
  keywordsContainer: { 
    display: 'flex', 
    flexWrap: 'wrap', 
    gap: SPACING.xs.xs, 
    maxWidth: 280 
  },
  keywordChip: { 
    ...CHIP_STYLES.base,
    bgcolor: 'rgba(240, 44, 86, 0.1)', 
    fontSize: TYPOGRAPHY.fontSize.xs.xs,
    height: 24,
    borderRadius: BORDERS.radius.md // Standardizzato da xl a md
  },
  additionalKeywordsChip: { 
    ...CHIP_STYLES.base,
    bgcolor: 'rgba(124, 50, 255, 0.1)', 
    fontSize: TYPOGRAPHY.fontSize.xs.xs,
    height: 24,
    borderRadius: BORDERS.radius.md // Standardizzato da xl a md
  },
  audioStatusChip: (available) => ({
    ...CHIP_STYLES.base,
    height: 24, 
    fontSize: TYPOGRAPHY.fontSize.xs.xs, 
    borderRadius: BORDERS.radius.md, // Standardizzato da xl a md
    color: available ? COLORS.state.success : COLORS.state.error,
    borderColor: available ? COLORS.state.success : COLORS.state.error
  }),
  actionButtonContainer: { 
    display: 'flex' 
  }
};

/**
 * Azioni e Pulsanti
 * Stili per i pulsanti di azione nella tabella e nell'interfaccia
 */
export const actionStyles = {
  viewButton: { 
    ...BUTTON_STYLES.base,
    color: COLORS.accent.blue,
    '&:hover': {
      ...BUTTON_STYLES.base['&:hover'],
      backgroundColor: 'rgba(53, 160, 238, 0.1)'
    }
  },
  downloadButton: { 
    ...BUTTON_STYLES.base,
    color: COLORS.secondary.main,
    display: { xs: 'none', sm: 'inline-flex' },
    '&:hover': {
      ...BUTTON_STYLES.base['&:hover'],
      backgroundColor: 'rgba(124, 50, 255, 0.1)'
    }
  },
  deleteButton: { 
    ...BUTTON_STYLES.base,
    color: COLORS.primary.main,
    '&:hover': {
      ...BUTTON_STYLES.base['&:hover'],
      backgroundColor: 'rgba(240, 44, 86, 0.1)'
    }
  },
  gradientButton: {
    ...BUTTON_STYLES.base,
    ...BUTTON_STYLES.primary,
    mt: SPACING.sm.xs,
    borderRadius: BORDERS.radius.md, // Standardizzato da xl a md
    textTransform: 'none',
    px: SPACING.md.xs,
    py: SPACING.xs.xs,
    fontWeight: TYPOGRAPHY.fontWeights.medium
  }
};

/**
 * Dialogo di Conferma
 * Stili per i dialoghi di conferma delle azioni
 */
export const confirmDialogStyles = {
  paper: {
    borderRadius: BORDERS.radius.md, // Standardizzato da xl a md
    padding: SPACING.xs.xs,
    boxShadow: SHADOWS.xl,
  },
  title: { 
    fontWeight: TYPOGRAPHY.fontWeights.semibold 
  },
  actions: { 
    padding: SPACING.sm.xs 
  },
  cancelButton: {
    ...BUTTON_STYLES.base,
    borderRadius: BORDERS.radius.md, // Standardizzato da xl a md
    textTransform: 'none',
    borderColor: COLORS.primary.main,
    color: COLORS.primary.main,
    '&:hover': {
      ...BUTTON_STYLES.base['&:hover'],
      borderColor: COLORS.primary.main,
      backgroundColor: 'rgba(240, 44, 86, 0.05)'
    }
  },
  confirmButton: {
    ...BUTTON_STYLES.base,
    ...BUTTON_STYLES.primary,
    borderRadius: BORDERS.radius.md, // Standardizzato da xl a md
    textTransform: 'none'
  }
};

/**
 * Paginazione
 * Stili per la paginazione della tabella
 */
export const paginationStyles = {
  container: { 
    display: 'flex', 
    justifyContent: 'center', 
    mt: SPACING.md.xs 
  },
  pagination: {
    '& .MuiPaginationItem-root': {
      borderRadius: BORDERS.radius.md, // Standardizzato da xl a md
      margin: `0 ${SPACING.xs.xs}px`
    },
    '& .Mui-selected': {
      background: 'linear-gradient(90deg, rgba(240, 44, 86, 0.1) 0%, rgba(124, 50, 255, 0.1) 100%)',
      borderColor: 'transparent',
      fontWeight: TYPOGRAPHY.fontWeights.semibold
    },
    '& .MuiPaginationItem-page:hover': {
      backgroundColor: 'rgba(240, 44, 86, 0.05)'
    }
  }
};

/**
 * Stato Vuoto
 * Stili per la visualizzazione quando non ci sono dati
 */
export const emptyStateStyles = {
  container: { 
    textAlign: 'center', 
    py: SPACING.xl.sm
  },
  icon: { 
    fontSize: 60, 
    color: 'text.secondary', 
    mb: SPACING.sm.xs 
  }
};

// Esporto un oggetto con tutti gli stili
export default {
  tabStyles,
  statCardStyles,
  historyTableStyles,
  actionStyles,
  confirmDialogStyles,
  paginationStyles,
  emptyStateStyles
}; 