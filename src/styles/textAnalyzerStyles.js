import { 
  BORDERS, 
  BUTTON_STYLES,
  TYPOGRAPHY,
  TEXT_FIELD_STYLES,
  SPACING
} from './themes';

/**
 * Stili centralizzati per la pagina TextAnalyzer dell'applicazione EchoLog
 * Estende correttamente gli stili base di themes.js
 */

/**
 * Stili per i tab selector
 * Gestisce l'aspetto dei tab per la selezione del tipo di input
 */
export const tabSelectorStyles = {
  container: { 
    display: 'flex', 
    backgroundColor: 'background.default',
    borderRadius: BORDERS.radius.sm,
    padding: SPACING.xs,
    justifyContent: 'center',
    mb: SPACING.lg,
    mx: 'auto',
    maxWidth: 'fit-content'
  },
  button: (isSelected, theme) => ({ 
    ...BUTTON_STYLES.base,
    backgroundColor: isSelected ? theme.palette.background.paper : 'transparent',
    color: isSelected ? theme.palette.text.primary : theme.palette.text.secondary,
    boxShadow: isSelected ? theme.shadows[1] : 'none',
    px: SPACING.md,
    py: SPACING.xs,
    textTransform: 'uppercase',
    fontWeight: TYPOGRAPHY.fontWeights.medium,
    '&:hover': {
      ...BUTTON_STYLES.base['&:hover'],
      backgroundColor: isSelected ? theme.palette.background.paper : theme.palette.action.hover,
      boxShadow: isSelected ? theme.shadows[2] : 'none'
    }
  })
};

/**
 * Stili per il dropzone
 * Area di trascinamento per il caricamento dei file
 */
export const dropZoneStyles = (isDragActive, hasFile, theme) => ({
  border: `2px dashed ${
    isDragActive 
      ? theme.palette.primary.main 
      : hasFile 
        ? theme.palette.success.main 
        : '#ccc'
  }`,
  borderRadius: BORDERS.radius.md,
  padding: theme.spacing(SPACING.lg.sm),
  textAlign: 'center',
  backgroundColor: isDragActive 
    ? 'rgba(240, 44, 86, 0.08)' 
    : hasFile 
      ? 'rgba(76, 175, 80, 0.08)' 
      : theme.palette.background.paper,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  marginBottom: theme.spacing(SPACING.md.xs),
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

/**
 * Stili per il contenitore file selezionato
 * Visualizza le informazioni sul file caricato
 */
export const fileInfoStyles = {
  container: { 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center' 
  },
  icon: { 
    fontSize: 48, 
    mb: SPACING.sm 
  },
  fileName: {
    fontWeight: TYPOGRAPHY.fontWeights.medium
  },
  fileSize: {
    color: 'text.secondary'
  },
  actionsContainer: { 
    mt: SPACING.sm, 
    display: 'flex', 
    gap: SPACING.sm 
  },
  removeButton: {
    ...BUTTON_STYLES.base,
    borderRadius: BORDERS.radius.md // Standardizzato da xl a md
  }
};

/**
 * Stili per l'area di trascinamento vuota
 * Stato iniziale del dropzone quando non ci sono file
 */
export const emptyDropZoneStyles = {
  icon: { 
    fontSize: 48, 
    color: '#ccc', 
    mb: SPACING.sm
  },
  title: {
    fontWeight: TYPOGRAPHY.fontWeights.medium
  }
};

/**
 * Stili per il pulsante di elaborazione
 * Bottone primario per avviare il processo di analisi
 */
export const processButtonStyles = {
  container: { 
    display: 'flex', 
    justifyContent: 'center', 
    mt: SPACING.md 
  },
  button: {
    ...BUTTON_STYLES.base,
    ...BUTTON_STYLES.primary,
    px: SPACING.lg,
    py: 1.5,
    borderRadius: BORDERS.radius.md, // Standardizzato da xl a md
    fontSize: TYPOGRAPHY.fontSize.md.xs,
    '&:disabled': {
      background: '#e0e0e0',
      color: '#a0a0a0'
    }
  }
};

/**
 * Stili per il textfield
 * Campo di input per l'inserimento diretto di testo
 */
export const textInputStyles = {
  container: {
    mb: SPACING.md
  },
  textField: {
    ...TEXT_FIELD_STYLES.base,
    '& .MuiOutlinedInput-root': {
      ...TEXT_FIELD_STYLES.base['& .MuiOutlinedInput-root'],
      borderRadius: BORDERS.radius.md
    }
  }
};

/**
 * Stili per l'intestazione del risultato
 * Header per la sezione di visualizzazione risultati
 */
export const resultHeaderStyles = {
  container: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    mb: SPACING.md,
    pb: SPACING.sm,
    borderBottom: '1px solid rgba(0,0,0,0.06)'
  },
  title: { 
    color: 'primary.main',
    fontWeight: TYPOGRAPHY.fontWeights.semibold
  },
  newAnalysisButton: {
    ...BUTTON_STYLES.base,
    borderRadius: BORDERS.radius.md, // Standardizzato da xl a md
    borderColor: 'primary.main',
    color: 'primary.main',
    textTransform: 'none',
    fontWeight: TYPOGRAPHY.fontWeights.medium,
    '&:hover': {
      ...BUTTON_STYLES.base['&:hover'],
      backgroundColor: 'rgba(240,44,86,0.04)',
      borderColor: 'primary.main'
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