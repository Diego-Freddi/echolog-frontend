import { styled } from '@mui/material/styles';
import { Paper, Card, Button } from '@mui/material';
import { 
  COLORS, 
  GRADIENTS, 
  SHADOWS, 
  BORDERS,
  TOP_GRADIENT_BORDER,
  CARD_STYLES,
  TYPOGRAPHY,
  BUTTON_STYLES,
  SPACING,
  CONTAINER_STYLES
} from './themes';

/**
 * Stili centralizzati per le pagine dell'applicazione EchoLog
 * Questo file contiene componenti stilizzati e oggetti di stile comuni
 * che vengono utilizzati nelle diverse pagine dell'applicazione.
 */

// ---------- COMPONENTI STILIZZATI ---------- //

/**
 * ApplePaper - Paper stilizzato con design Apple-like
 * Utilizzato nelle pagine come contenitore principale con bordo sfumato in alto
 */
export const ApplePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
  borderRadius: BORDERS.radius.xl,
  backgroundColor: theme.palette.mode === 'dark' ? '#1c1c1e' : COLORS.neutral.white,
  boxShadow: '0px 10px 38px -10px rgba(0, 0, 0, 0.1), 0px 10px 20px -15px rgba(0, 0, 0, 0.05)',
  backdropFilter: 'blur(10px)',
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: TOP_GRADIENT_BORDER.width,
    background: GRADIENTS.navbar,
  }
}));

/**
 * AppleCard - Card stilizzata con design Apple-like
 * Utilizzata nelle dashboard per mostrare widget e statistiche
 */
export const AppleCard = styled(Card)(({ theme }) => ({
  ...CARD_STYLES.base,
  height: '100%',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    ...CARD_STYLES.base['&:hover'],
    transform: 'translateY(-4px)',
  }
}));

/**
 * GradientButton - Bottone con sfondo sfumato
 * Estende correttamente gli stili base dei bottoni
 */
export const GradientButton = styled(Button)(({ theme }) => ({
  ...BUTTON_STYLES.primary,
  fontSize: '0.9rem',
  padding: theme.spacing(1, 3),
}));

// ---------- OGGETTI DI STILE ---------- //

/**
 * pageTitleStyles - Stili per i titoli delle pagine
 */
export const pageTitleStyles = {
  fontWeight: TYPOGRAPHY.fontWeights.semibold,
  fontSize: { 
    xs: TYPOGRAPHY.fontSize.xl.xs, 
    sm: TYPOGRAPHY.fontSize.xl.sm, 
    md: TYPOGRAPHY.fontSize.xxl.xs 
  },
  background: GRADIENTS.navbar,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  mb: { xs: 2, sm: 3 },
  textAlign: 'center'
};

/**
 * pageSubtitleStyles - Stili per i sottotitoli delle pagine
 */
export const pageSubtitleStyles = {
  color: 'text.secondary',
  mb: 4,
  textAlign: 'center'
};

/**
 * containerStyles - Stili per i contenitori di pagina
 */
export const containerStyles = {
  ...CONTAINER_STYLES.responsiveBox,
  width: { xs: '100%', md: '90%', lg: '80%' },
  maxWidth: '1200px',
  mx: 'auto',
};

/**
 * headerStyles - Stili per intestazioni con icona e titolo
 */
export const headerStyles = {
  display: 'flex',
  alignItems: 'center',
  mb: 2,
  icon: {
    mr: 1,
    color: COLORS.primary.main
  },
  title: {
    fontWeight: TYPOGRAPHY.fontWeights.semibold
  }
};

/**
 * buttonStyles - Stili per vari tipi di bottoni
 * Estende correttamente gli stili base
 */
export const buttonStyles = {
  // Stile bottone primario
  primary: {
    ...BUTTON_STYLES.base,
    ...BUTTON_STYLES.primary,
    px: 3,
    py: 1.5
  },
  
  // Stile bottone secondario
  secondary: {
    ...BUTTON_STYLES.base,
    borderRadius: BORDERS.radius.sm,
    px: 3, 
    py: 1.5,
    fontWeight: TYPOGRAPHY.fontWeights.medium,
    border: '1px solid transparent',
    '&:hover': {
      ...BUTTON_STYLES.base['&:hover'],
      backgroundColor: 'rgba(240,44,86,0.05)'
    }
  },
  
  // Stile bottone per tab
  tab: {
    ...BUTTON_STYLES.tab,
    color: 'text.secondary',
    '&.active': {
      backgroundColor: 'background.paper',
      color: 'text.primary',
      boxShadow: SHADOWS.sm
    }
  }
};

/**
 * dropZoneStyles - Stili per la zona di drag & drop dei file
 */
export const dropZoneStyles = (isDragActive, hasFile, theme) => ({
  border: `2px dashed ${isDragActive ? COLORS.primary.main : hasFile ? COLORS.state.success : '#ccc'}`,
  borderRadius: BORDERS.radius.md,
  padding: theme.spacing(4),
  textAlign: 'center',
  backgroundColor: isDragActive 
    ? 'rgba(240, 44, 86, 0.08)' 
    : hasFile 
      ? 'rgba(76, 175, 80, 0.08)' 
      : theme.palette.background.paper,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  marginBottom: theme.spacing(3),
  '&:hover': {
    backgroundColor: isDragActive 
      ? 'rgba(240, 44, 86, 0.12)' 
      : hasFile 
        ? 'rgba(76, 175, 80, 0.12)' 
        : theme.palette.action.hover,
    borderColor: isDragActive 
      ? COLORS.primary.main 
      : hasFile 
        ? COLORS.state.success 
        : COLORS.primary.light
  }
});

/**
 * tableStyles - Stili per tabelle dati
 */
export const tableStyles = {
  container: { 
    mb: 3, 
    p: 0, 
    overflow: { xs: 'auto', sm: 'hidden' },
    borderRadius: BORDERS.radius.xl
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
  row: {
    '&:last-child td, &:last-child th': { border: 0 },
    '&:hover': { 
      backgroundColor: 'action.hover',
      transition: 'all 0.2s'
    }
  },
  pagination: {
    mt: 3,
    display: 'flex',
    justifyContent: 'center',
    '& .MuiPaginationItem-root': {
      borderRadius: BORDERS.radius.md,
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

/**
 * dialogStyles - Stili per dialoghi e modal
 */
export const dialogStyles = {
  paper: {
    borderRadius: BORDERS.radius.xl,
    padding: 1,
    boxShadow: SHADOWS.xl,
  },
  title: { 
    fontWeight: TYPOGRAPHY.fontWeights.semibold 
  },
  buttons: { 
    padding: 2 
  },
  cancelButton: {
    ...BUTTON_STYLES.base,
    borderRadius: BORDERS.radius.md,
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
    borderRadius: BORDERS.radius.md,
    textTransform: 'none',
  }
};

// Esporto tutti gli stili
export default {
  pageTitleStyles,
  pageSubtitleStyles,
  containerStyles,
  headerStyles,
  buttonStyles,
  dropZoneStyles,
  tableStyles,
  dialogStyles
}; 