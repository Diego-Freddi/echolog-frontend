import { keyframes } from '@mui/material';

/**
 * Sistema centralizzato di stili e temi per l'applicazione EchoLog
 * Questo file contiene colori, animazioni, e stili di base comuni 
 * che possono essere riutilizzati in tutti i componenti dell'applicazione.
 */

// ----- COLORI ----- //
export const COLORS = {
  // Colori primari
  primary: {
    main: '#f02c56',
    light: '#ff5983',
    dark: '#d01c46',
    contrastText: '#ffffff'
  },
  // Colori secondari
  secondary: {
    main: '#7c32ff',
    light: '#9958ff',
    dark: '#6822ef',
    contrastText: '#ffffff'
  },
  // Colori di accent
  accent: {
    blue: '#35a0ee',
    purple: '#9933cc',
    teal: '#33cccc'
  },
  // Colori neutrali
  neutral: {
    white: '#ffffff',
    lightGray: '#f5f5f7',
    mediumGray: '#e5e5e7',
    gray: '#c5c5c7',
    darkGray: '#666666',
    black: '#000000'
  },
  // Colori di stato
  state: {
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  }
};

// ----- GRADIENTI ----- //
export const GRADIENTS = {
  primary: `linear-gradient(45deg, ${COLORS.primary.main} 0%, ${COLORS.secondary.main} 100%)`,
  primaryHover: `linear-gradient(45deg, ${COLORS.primary.dark} 0%, ${COLORS.secondary.dark} 100%)`,
  navbar: `linear-gradient(90deg, ${COLORS.primary.main} 0%, ${COLORS.secondary.main} 50%, ${COLORS.accent.blue} 100%)`,
  background: `linear-gradient(145deg, rgba(124,50,255,0.05) 0%, rgba(240,44,86,0.1) 100%)`,
  card: `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)`
};

// ----- ANIMAZIONI ----- //
export const ANIMATIONS = {
  // Animazione di pulsazione
  pulse: keyframes`
    0% {
      box-shadow: 0 0 0 0 rgba(240, 44, 86, 0.7);
      transform: scale(1);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(240, 44, 86, 0);
      transform: scale(1.05);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(240, 44, 86, 0);
      transform: scale(1);
    }
  `,
  // Fade in
  fadeIn: keyframes`
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  `,
  // Slide up
  slideUp: keyframes`
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  `,
  // Breathe (per elementi che devono "respirare")
  breathe: keyframes`
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.03);
    }
    100% {
      transform: scale(1);
    }
  `
};

// ----- OMBRE ----- //
export const SHADOWS = {
  sm: '0 2px 4px rgba(0,0,0,0.1)',
  md: '0 4px 8px rgba(0,0,0,0.12)',
  lg: '0 8px 24px rgba(0,0,0,0.14)',
  xl: '0 12px 48px rgba(0,0,0,0.16)',
  inner: 'inset 0 2px 4px rgba(0,0,0,0.05)',
  primarySm: `0 2px 8px rgba(240,44,86,0.2)`,
  primaryMd: `0 4px 12px rgba(240,44,86,0.3)`,
  primaryLg: `0 8px 24px rgba(240,44,86,0.4)`
};

// ----- BORDI ----- //
export const BORDERS = {
  radius: {
    xs: 2,  // 2px
    sm: 2,  // 2px
    md: 4,  // 4px
    lg: 8,  // 8px
    xl: 16, // 16px
    round: '50%'
  },
  width: {
    thin: 1,   // 1px
    medium: 2, // 2px
    thick: 4   // 4px
  },
  // Border styles
  style: {
    solid: 'solid',
    dashed: 'dashed'
  },
  // Bordo base per componenti
  component: {
    default: '1px solid rgba(240,44,86,0.1)',
    hover: '1px solid rgba(240,44,86,0.2)',
    focus: '1px solid rgba(240,44,86,0.4)'
  },
  // Bordo con gradiente primario in alto
  topGradient: {
    top: `${COLORS.primary.main}`,
    radius: 8,
    width: 4
  }
};

// ----- SPAZIATURE ----- //
export const SPACING = {
  // Scale: numero * 4px
  xs: { xs: 0.5, sm: 0.75 },  // 2px - 3px
  sm: { xs: 1, sm: 1.5 },     // 4px - 6px
  md: { xs: 2, sm: 3 },       // 8px - 12px
  lg: { xs: 3, sm: 4 },       // 12px - 16px
  xl: { xs: 4, sm: 6 }        // 16px - 24px
};

// ----- TIPOGRAFIA ----- //
export const TYPOGRAPHY = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontWeights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },
  fontSize: {
    xs: { xs: '0.75rem', sm: '0.875rem' },    // 12px - 14px
    sm: { xs: '0.875rem', sm: '1rem' },       // 14px - 16px
    md: { xs: '1rem', sm: '1.125rem' },       // 16px - 18px
    lg: { xs: '1.125rem', sm: '1.25rem' },    // 18px - 20px
    xl: { xs: '1.25rem', sm: '1.5rem' },      // 20px - 24px
    xxl: { xs: '1.5rem', sm: '2rem' },        // 24px - 32px
    display: { xs: '2rem', sm: '2.5rem' }     // 32px - 40px
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75
  }
};

// ----- STILI COMPONENTI COMUNI ----- //

// Stili per bottoni apple-like
export const BUTTON_STYLES = {
  // Stile di base per tutti i bottoni
  base: {
    borderRadius: BORDERS.radius.sm,
    transition: 'all 0.2s ease-in-out',
    fontWeight: TYPOGRAPHY.fontWeights.medium,
    '&:hover': {
      transform: 'translateY(-1px)'
    },
    '&:active': {
      transform: 'translateY(0px)'
    }
  },
  
  // Bottone filled style
  filled: {
    backgroundColor: COLORS.neutral.lightGray,
    color: COLORS.neutral.black,
    boxShadow: SHADOWS.sm,
    fontSize: TYPOGRAPHY.fontSize.sm,
    py: SPACING.sm,
    px: SPACING.md,
    '&:hover': {
      backgroundColor: COLORS.neutral.mediumGray,
      boxShadow: SHADOWS.md
    }
  },
  
  // Bottone per l'upload file
  upload: {
    backgroundColor: COLORS.neutral.lightGray,
    color: COLORS.neutral.black,
    boxShadow: SHADOWS.sm,
    fontSize: TYPOGRAPHY.fontSize.sm,
    py: SPACING.sm,
    px: SPACING.md,
    '&:hover': {
      backgroundColor: COLORS.neutral.mediumGray,
      boxShadow: SHADOWS.md
    }
  },
  
  // Bottone primary
  primary: {
    background: GRADIENTS.primary,
    color: COLORS.primary.contrastText,
    boxShadow: SHADOWS.primarySm,
    '&:hover': {
      background: GRADIENTS.primaryHover,
      boxShadow: SHADOWS.primaryMd
    }
  },
  
  // Bottone disabilitato
  disabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
    '&:hover': {
      transform: 'none',
      boxShadow: SHADOWS.sm
    }
  },
  
  // Bottone per tab selector
  tab: {
    borderRadius: BORDERS.radius.sm,
    transition: 'all 0.2s ease-in-out',
    fontSize: TYPOGRAPHY.fontSize.sm,
    py: { xs: 0.5, sm: 1 },
    px: { xs: 1.5, sm: 2 },
    minWidth: { xs: '45%', sm: 'auto' }
  },
  
  // Selezione tab attiva/inattiva
  tabSelected: (isSelected) => ({
    backgroundColor: isSelected ? COLORS.neutral.white : 'transparent',
    color: isSelected ? COLORS.neutral.black : COLORS.neutral.darkGray,
    boxShadow: isSelected ? SHADOWS.sm : 'none',
    '&:hover': {
      backgroundColor: isSelected ? COLORS.neutral.white : 'rgba(0,0,0,0.04)',
      boxShadow: isSelected ? SHADOWS.md : 'none'
    }
  })
};

// Stili per card e paper
export const CARD_STYLES = {
  base: {
    borderRadius: BORDERS.radius.lg,
    boxShadow: SHADOWS.md,
    border: BORDERS.component.default,
    padding: SPACING.lg,
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      boxShadow: SHADOWS.lg,
      border: BORDERS.component.hover
    }
  },
  
  gradient: {
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: BORDERS.width.thick,
      background: GRADIENTS.primary
    }
  }
};

// Stili per input e form
export const INPUT_STYLES = {
  base: {
    borderRadius: BORDERS.radius.sm,
    border: BORDERS.component.default,
    transition: 'all 0.2s ease-in-out',
    '&:focus': {
      borderColor: COLORS.primary.main,
      boxShadow: SHADOWS.primarySm
    }
  }
};

// Stili per etichette e chip
export const CHIP_STYLES = {
  base: {
    borderRadius: BORDERS.radius.sm,
    fontSize: TYPOGRAPHY.fontSize.xs,
    height: { xs: 24, sm: 32 },
    fontWeight: TYPOGRAPHY.fontWeights.medium,
    transition: 'all 0.2s ease'
  },
  
  primary: {
    backgroundColor: 'rgba(240,44,86,0.1)',
    color: COLORS.primary.main,
    '&:hover': {
      backgroundColor: 'rgba(240,44,86,0.2)'
    }
  }
};

// Utilità per campi di testo
export const TEXT_FIELD_STYLES = {
  base: {
    '& .MuiOutlinedInput-root': {
      borderRadius: BORDERS.radius.sm,
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: COLORS.primary.main
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: COLORS.primary.main,
        borderWidth: 2
      }
    }
  }
};

// Stili per contenitori responsive
export const CONTAINER_STYLES = {
  responsiveBox: {
    width: '100%',
    px: SPACING.md,
    py: SPACING.lg
  },
  
  flexCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  
  flexBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
};

export default {
  COLORS,
  GRADIENTS,
  ANIMATIONS,
  SHADOWS,
  BORDERS,
  SPACING,
  TYPOGRAPHY,
  BUTTON_STYLES,
  CARD_STYLES,
  INPUT_STYLES,
  CHIP_STYLES,
  TEXT_FIELD_STYLES,
  CONTAINER_STYLES
}; 