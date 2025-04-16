import { 
  COLORS, 
  GRADIENTS, 
  SHADOWS, 
  BORDERS, 
  BUTTON_STYLES,
  TYPOGRAPHY,
  TEXT_FIELD_STYLES,
  CONTAINER_STYLES
} from './themes';

/**
 * Stili centralizzati per la pagina TextAnalyzer dell'applicazione EchoLog
 */

// Stili per i tab
export const tabSelectorStyles = {
  container: { 
    display: 'flex', 
    backgroundColor: 'background.default',
    borderRadius: BORDERS.radius.md,
    padding: 1,
    justifyContent: 'center',
    mb: 4,
    mx: 'auto',
    maxWidth: 'fit-content'
  },
  button: (isSelected, theme) => ({ 
    borderRadius: BORDERS.radius.sm,
    backgroundColor: isSelected ? theme.palette.background.paper : 'transparent',
    color: isSelected ? theme.palette.text.primary : theme.palette.text.secondary,
    boxShadow: isSelected ? theme.shadows[1] : 'none',
    transition: 'all 0.2s ease-in-out',
    px: 3,
    py: 1,
    textTransform: 'uppercase',
    fontWeight: TYPOGRAPHY.fontWeights.medium,
    '&:hover': {
      backgroundColor: isSelected ? theme.palette.background.paper : theme.palette.action.hover,
      boxShadow: isSelected ? theme.shadows[2] : 'none',
      transform: 'translateY(-1px)'
    }
  })
};

// Stili per il dropzone
export const dropZoneStyles = (isDragActive, hasFile, theme) => ({
  border: `2px dashed ${
    isDragActive 
      ? theme.palette.primary.main 
      : hasFile 
        ? theme.palette.success.main 
        : '#ccc'
  }`,
  borderRadius: BORDERS.radius.md,
  padding: 4,
  textAlign: 'center',
  backgroundColor: isDragActive 
    ? 'rgba(240, 44, 86, 0.08)' 
    : hasFile 
      ? 'rgba(76, 175, 80, 0.08)' 
      : theme.palette.background.paper,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  marginBottom: 3,
  '&:hover': {
    backgroundColor: isDragActive 
      ? 'rgba(240, 44, 86, 0.12)' 
      : hasFile 
        ? 'rgba(76, 175, 80, 0.12)' 
        : theme.palette.action.hover,
    borderColor: isDragActive 
      ? theme.palette.primary.main 
      : hasFile 
        ? theme.palette.success.main 
        : theme.palette.primary.light
  }
});

// Stili per il contenitore file selezionato
export const fileInfoStyles = {
  container: { 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center' 
  },
  icon: { 
    fontSize: 48, 
    mb: 2 
  },
  fileName: {
    fontWeight: TYPOGRAPHY.fontWeights.medium
  },
  fileSize: {
    color: 'text.secondary'
  },
  actionsContainer: { 
    mt: 2, 
    display: 'flex', 
    gap: 2 
  },
  removeButton: {
    borderRadius: BORDERS.radius.xl
  }
};

// Stili per l'area di trascinamento vuota
export const emptyDropZoneStyles = {
  icon: { 
    fontSize: 48, 
    color: '#ccc', 
    mb: 2 
  },
  title: {
    fontWeight: TYPOGRAPHY.fontWeights.medium
  }
};

// Stili per il pulsante di elaborazione
export const processButtonStyles = {
  container: { 
    display: 'flex', 
    justifyContent: 'center', 
    mt: 3 
  },
  button: {
    px: 4,
    py: 1.5,
    borderRadius: BORDERS.radius.xl,
    background: GRADIENTS.primary,
    textTransform: 'none',
    fontSize: '1rem',
    fontWeight: TYPOGRAPHY.fontWeights.medium,
    boxShadow: SHADOWS.primarySm,
    '&:hover': {
      background: GRADIENTS.primaryHover,
      boxShadow: SHADOWS.primaryMd,
      transform: 'translateY(-2px)'
    },
    '&:disabled': {
      background: '#e0e0e0',
      color: '#a0a0a0'
    }
  }
};

// Stili per il textfield
export const textInputStyles = {
  container: {
    mb: 3
  },
  textField: {
    ...TEXT_FIELD_STYLES.base,
    '& .MuiOutlinedInput-root': {
      borderRadius: BORDERS.radius.md,
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: COLORS.primary.main,
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: COLORS.primary.main,
        borderWidth: 1,
      }
    }
  }
};

// Stili per l'intestazione del risultato
export const resultHeaderStyles = {
  container: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    mb: 3,
    pb: 2,
    borderBottom: '1px solid rgba(0,0,0,0.06)'
  },
  title: { 
    color: 'primary.main',
    fontWeight: TYPOGRAPHY.fontWeights.semibold
  },
  newAnalysisButton: {
    borderRadius: BORDERS.radius.xl,
    borderColor: 'primary.main',
    color: 'primary.main',
    textTransform: 'none',
    fontWeight: TYPOGRAPHY.fontWeights.medium,
    '&:hover': {
      backgroundColor: 'rgba(240,44,86,0.04)',
      borderColor: 'primary.main',
      transform: 'translateY(-1px)'
    }
  }
};

// Esporto tutti gli stili
export default {
  tabSelectorStyles,
  dropZoneStyles,
  fileInfoStyles,
  emptyDropZoneStyles,
  processButtonStyles,
  textInputStyles,
  resultHeaderStyles
}; 