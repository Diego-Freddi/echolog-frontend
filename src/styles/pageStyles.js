import { styled } from '@mui/material/styles';
import { Paper, Card, Button } from '@mui/material';
import { 
  COLORS, 
  GRADIENTS, 
  SHADOWS, 
  BORDERS, 
  CARD_STYLES,
  TYPOGRAPHY,
  BUTTON_STYLES
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
    height: BORDERS.width.thick,
    background: 'linear-gradient(90deg, #f02c56 0%, #7c32ff 50%, #35a0ee 100%)',
  }
}));

/**
 * AppleCard - Card stilizzata con design Apple-like
 * Utilizzata nelle dashboard per mostrare widget e statistiche
 */
export const AppleCard = styled(Card)(({ theme }) => ({
  borderRadius: BORDERS.radius.xl,
  boxShadow: SHADOWS.md,
  height: '100%',
  transition: 'transform 0.2s ease-in-out',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: SHADOWS.lg,
  }
}));

/**
 * GradientButton - Bottone con sfondo sfumato
 */
export const GradientButton = styled(Button)(({ theme }) => ({
  borderRadius: BORDERS.radius.lg,
  background: GRADIENTS.primary,
  textTransform: 'none',
  color: COLORS.neutral.white,
  fontSize: '0.9rem',
  fontWeight: TYPOGRAPHY.fontWeights.medium,
  padding: theme.spacing(1, 3),
  boxShadow: SHADOWS.primarySm,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    background: GRADIENTS.primaryHover,
    boxShadow: SHADOWS.primaryMd,
    transform: 'translateY(-2px)'
  },
  '&:disabled': {
    background: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled
  }
}));

// ---------- OGGETTI DI STILE ---------- //

/**
 * pageTitleStyles - Stili per i titoli delle pagine
 */
export const pageTitleStyles = {
  fontWeight: 600,
  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
  background: 'linear-gradient(90deg, #f02c56 0%, #7c32ff 50%, #35a0ee 100%)',
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
  width: { xs: '100%', md: '90%', lg: '80%' },
  maxWidth: '1200px',
  mx: 'auto',
  p: { xs: 2, md: 3 },
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
    fontWeight: 600
  }
};

/**
 * buttonStyles - Stili per vari tipi di bottoni
 */
export const buttonStyles = {
  // Stile bottone primario
  primary: {
    borderRadius: BORDERS.radius.lg,
    textTransform: 'none',
    px: 3,
    py: 1.5,
    background: 'linear-gradient(90deg, #f02c56 0%, #7c32ff 100%)',
    fontWeight: 500,
    boxShadow: '0 4px 12px rgba(240,44,86,0.2)',
    '&:hover': {
      background: 'linear-gradient(90deg, #e02951 0%, #6c2be0 100%)',
      boxShadow: '0 6px 16px rgba(240,44,86,0.3)',
      transform: 'translateY(-2px)'
    }
  },
  
  // Stile bottone secondario
  secondary: {
    borderRadius: BORDERS.radius.sm,
    textTransform: 'none',
    px: 3, 
    py: 1.5,
    fontWeight: 500,
    border: '1px solid transparent',
    '&:hover': {
      backgroundColor: 'rgba(240,44,86,0.05)',
      transform: 'translateY(-1px)'
    }
  },
  
  // Stile bottone per tab
  tab: {
    borderRadius: BORDERS.radius.md,
    backgroundColor: 'transparent',
    color: 'text.secondary',
    textTransform: 'none',
    px: 3,
    py: 1,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0.04)'
    },
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
      fontWeight: 600, 
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
      borderRadius: BORDERS.radius.lg,
      margin: '0 4px'
    },
    '& .Mui-selected': {
      background: 'linear-gradient(90deg, rgba(240, 44, 86, 0.1) 0%, rgba(124, 50, 255, 0.1) 100%)',
      borderColor: 'transparent',
      fontWeight: 600
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
    boxShadow: '0px 10px 38px -10px rgba(0, 0, 0, 0.2), 0px 10px 20px -15px rgba(0, 0, 0, 0.15)',
  },
  title: { 
    fontWeight: 600 
  },
  buttons: { 
    padding: 2 
  },
  cancelButton: {
    borderRadius: BORDERS.radius.lg,
    textTransform: 'none',
    borderColor: COLORS.primary.main,
    color: COLORS.primary.main,
    '&:hover': {
      borderColor: COLORS.primary.main,
      backgroundColor: 'rgba(240, 44, 86, 0.05)'
    }
  },
  confirmButton: {
    borderRadius: BORDERS.radius.lg,
    textTransform: 'none',
    backgroundColor: COLORS.primary.main,
    '&:hover': {
      backgroundColor: COLORS.primary.dark
    }
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