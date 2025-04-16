import { 
  COLORS, 
  GRADIENTS, 
  SHADOWS, 
  BORDERS, 
  CARD_STYLES,
  TYPOGRAPHY,
  BUTTON_STYLES,
  CHIP_STYLES,
  CONTAINER_STYLES
} from './themes';

/**
 * Stili centralizzati per la pagina History dell'applicazione EchoLog
 */

// Stili per le tab e gli indicatori
export const tabStyles = {
  container: {
    borderBottom: 1, 
    borderColor: 'divider',
    '& .MuiTabs-flexContainer': {
      justifyContent: 'center',
    },
    mb: 3
  },
  tabs: {
    '& .MuiTab-root': {
      textTransform: 'none',
      fontWeight: TYPOGRAPHY.fontWeights.medium,
      fontSize: '1rem',
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

// Stili per la card statistica
export const statCardStyles = {
  card: {
    height: '100%',
  },
  content: { 
    p: 3 
  },
  header: { 
    display: 'flex', 
    alignItems: 'center', 
    mb: 2 
  },
  icon: (color) => ({ 
    color: color || COLORS.primary.main, 
    mr: 1 
  }),
  title: {
    fontWeight: TYPOGRAPHY.fontWeights.semibold
  },
  value: { 
    fontWeight: TYPOGRAPHY.fontWeights.semibold 
  }
};

// Stili per la tabella cronologia
export const historyTableStyles = {
  container: { 
    mb: 3, 
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
    mr: 1, 
    fontSize: { xs: 16, sm: 20 } 
  }),
  keywordsContainer: { 
    display: 'flex', 
    flexWrap: 'wrap', 
    gap: 0.5, 
    maxWidth: 280 
  },
  keywordChip: { 
    bgcolor: 'rgba(240, 44, 86, 0.1)', 
    fontSize: '0.75rem',
    height: 24,
    borderRadius: BORDERS.radius.xl
  },
  additionalKeywordsChip: { 
    bgcolor: 'rgba(124, 50, 255, 0.1)', 
    fontSize: '0.75rem',
    height: 24,
    borderRadius: BORDERS.radius.xl
  },
  audioStatusChip: (available) => ({
    height: 24, 
    fontSize: '0.75rem', 
    borderRadius: BORDERS.radius.xl,
    color: available ? COLORS.state.success : COLORS.state.error,
    borderColor: available ? COLORS.state.success : COLORS.state.error
  }),
  actionButtonContainer: { 
    display: 'flex' 
  }
};

// Stili per azioni e pulsanti
export const actionStyles = {
  viewButton: { 
    color: COLORS.accent.blue,
    '&:hover': {
      backgroundColor: 'rgba(53, 160, 238, 0.1)'
    }
  },
  downloadButton: { 
    color: COLORS.secondary.main,
    display: { xs: 'none', sm: 'inline-flex' },
    '&:hover': {
      backgroundColor: 'rgba(124, 50, 255, 0.1)'
    }
  },
  deleteButton: { 
    color: COLORS.primary.main,
    '&:hover': {
      backgroundColor: 'rgba(240, 44, 86, 0.1)'
    }
  },
  gradientButton: {
    mt: 2,
    borderRadius: BORDERS.radius.xl,
    background: GRADIENTS.primary,
    textTransform: 'none',
    px: 3,
    py: 1,
    fontWeight: TYPOGRAPHY.fontWeights.medium,
    '&:hover': {
      background: GRADIENTS.primaryHover,
      boxShadow: SHADOWS.primarySm
    }
  }
};

// Stili per dialogo conferma
export const confirmDialogStyles = {
  paper: {
    borderRadius: BORDERS.radius.xl,
    padding: '8px',
    boxShadow: SHADOWS.xl,
  },
  title: { 
    fontWeight: TYPOGRAPHY.fontWeights.semibold 
  },
  actions: { 
    padding: '16px' 
  },
  cancelButton: {
    borderRadius: BORDERS.radius.xl,
    textTransform: 'none',
    borderColor: COLORS.primary.main,
    color: COLORS.primary.main,
    '&:hover': {
      borderColor: COLORS.primary.main,
      backgroundColor: 'rgba(240, 44, 86, 0.05)'
    }
  },
  confirmButton: {
    borderRadius: BORDERS.radius.xl,
    textTransform: 'none',
    backgroundColor: COLORS.primary.main,
    '&:hover': {
      backgroundColor: COLORS.primary.dark
    }
  }
};

// Stili per la paginazione
export const paginationStyles = {
  container: { 
    display: 'flex', 
    justifyContent: 'center', 
    mt: 3 
  },
  pagination: {
    '& .MuiPaginationItem-root': {
      borderRadius: BORDERS.radius.xl,
      margin: '0 4px'
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

// Stili per la visualizzazione vuota
export const emptyStateStyles = {
  container: { 
    textAlign: 'center', 
    py: 6 
  },
  icon: { 
    fontSize: 60, 
    color: 'text.secondary', 
    mb: 2 
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