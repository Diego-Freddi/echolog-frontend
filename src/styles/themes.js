import { keyframes } from '@mui/material';

/**
 * Sistema centralizzato di stili e temi per l'applicazione EchoLog
 * Questo file contiene colori, animazioni, e stili di base comuni 
 * che possono essere riutilizzati in tutti i componenti dell'applicazione.
 * 
 * GUIDA ALL'USO:
 * - Importare i valori necessari da questo file
 * - Estendere gli stili base usando lo spread operator (...BUTTON_STYLES.base)
 * - NON sovrascrivere i valori base senza una ragione specifica
 * - Documentare qualsiasi deroga dai valori standard
 */

// ----- COLORI ----- //

/**
 * Colori dell'applicazione
 * - primary: colori principali del brand
 * - secondary: colori complementari del brand
 * - accent: colori per enfasi e contrasto
 * - neutral: scala di grigi e bianchi/neri
 * - state: colori per stati funzionali (successo, errore, ecc.)
 */
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

/**
 * Gradienti predefiniti
 * - primary: gradiente principale del brand
 * - primaryHover: versione più scura per hover
 * - navbar: gradiente speciale per la navbar
 * - background: gradiente sottile per sfondi
 * - card: gradiente per carte con alpha
 */
export const GRADIENTS = {
  primary: `linear-gradient(45deg, ${COLORS.primary.main} 0%, ${COLORS.secondary.main} 100%)`,
  primaryHover: `linear-gradient(45deg, ${COLORS.primary.dark} 0%, ${COLORS.secondary.dark} 100%)`,
  navbar: `linear-gradient(90deg, ${COLORS.primary.main} 0%, ${COLORS.secondary.main} 50%, ${COLORS.accent.blue} 100%)`,
  background: `linear-gradient(145deg, rgba(124,50,255,0.05) 0%, rgba(240,44,86,0.1) 100%)`,
  card: `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)`
};

// ----- ANIMAZIONI ----- //

/**
 * Animazioni keyframe riutilizzabili
 * - pulse: effetto pulsante, usato per elementi attivi/in registrazione
 * - fadeIn: apparizione graduale, usato per transizioni
 * - slideUp: movimento dal basso, usato per elementi che appaiono
 * - breathe: leggero respiro, usato per enfasi sottile
 */
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

/**
 * Sistema di ombre
 * - sm/md/lg/xl: ombre generiche con profondità crescente
 * - inner: ombra interna per elementi incassati
 * - primary*: ombre colorate per elementi primari
 * 
 * Uso:
 * - sm: per elementi leggeri (bottoni, chips)
 * - md: per card e contenitori
 * - lg: per elementi elevati (dialoghi, popovers)
 * - xl: per elementi in primo piano (modali)
 */
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

/**
 * Sistema di bordi
 * - radius: arrotondamento angoli con progressione logica
 * - width: spessori bordo standard
 * - style: stili bordo (solid, dashed)
 * - component: bordi predefiniti per stati componenti
 * 
 * Guida all'uso dei border radius:
 * - none (0px): nessun arrotondamento
 * - xs (1px): minimo arrotondamento (chip, tag piccoli)
 * - sm (2px): arrotondamento leggero (bottoni, input)
 * - md (4px): arrotondamento medio (card piccole, tooltip)
 * - lg (8px): arrotondamento ampio (card, dialoghi)
 * - xl (16px): arrotondamento massimo (container principali)
 * - round: elementi circolari (avatar, badge)
 */
export const BORDERS = {
  radius: {
    none: 0,    // 0px - nessun arrotondamento
    xs: 1,      // 1px - minimo arrotondamento (chip, tag piccoli)
    sm: 2,      // 2px - arrotondamento leggero (bottoni, input)
    md: 4,      // 4px - arrotondamento medio (card piccole, tooltip)
    lg: 8,      // 8px - arrotondamento ampio (card, dialoghi)
    xl: 16,     // 16px - arrotondamento massimo (container principali)
    round: '50%' // per elementi circolari (avatar, badge)
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
  }
};

/**
 * Bordo con gradiente primario in alto
 * Separato dalla definizione di BORDERS per evitare riferimenti circolari
 */
export const TOP_GRADIENT_BORDER = {
  top: `${COLORS.primary.main}`,
  radius: 8,     // Equivalente a BORDERS.radius.lg
  width: 4       // Equivalente a BORDERS.width.thick
};

// ----- SPAZIATURE ----- //

/**
 * Sistema di spaziature responsive
 * La scala è basata su multiple di 4px
 * Ogni dimensione ha varianti per dimensioni schermo xs e sm
 * 
 * Uso:
 * - xs: spaziature minime (padding interno, gap piccoli)
 * - sm: spaziature ridotte (padding bottoni, gap elementi)
 * - md: spaziature standard (margini componenti, padding container)
 * - lg: spaziature ampie (sezioni, card)
 * - xl: spaziature massime (container principali, hero section)
 */
export const SPACING = {
  // Scale: numero * 4px
  xs: { xs: 0.5, sm: 0.75 },  // 2px - 3px
  sm: { xs: 1, sm: 1.5 },     // 4px - 6px
  md: { xs: 2, sm: 3 },       // 8px - 12px
  lg: { xs: 3, sm: 4 },       // 12px - 16px
  xl: { xs: 4, sm: 6 }        // 16px - 24px
};

// ----- TIPOGRAFIA ----- //

/**
 * Sistema tipografico
 * - fontFamily: font stack predefinito
 * - fontWeights: pesi standard da light a bold
 * - fontSize: dimensioni responsive con varianti xs/sm
 * - lineHeight: altezze riga standard
 * 
 * Uso fontSize:
 * - xs: testo molto piccolo (note, label, caption)
 * - sm: testo piccolo (testo secondario, bottoni)
 * - md: testo normale (corpo principale)
 * - lg: testo grande (sottotitoli, intestazioni minori)
 * - xl: titoli piccoli (h3, h4)
 * - xxl: titoli medi (h2)
 * - display: titoli grandi (h1)
 */
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

/**
 * Stili per bottoni
 * 
 * Pattern di estensione corretto:
 * ```
 * const myButton = {
 *   ...BUTTON_STYLES.base,        // Estendi sempre gli stili base
 *   ...BUTTON_STYLES.primary,     // Applica variante se necessario
 *   // Aggiungi proprietà specifiche senza sovrascrivere valori base
 * }
 * ```
 */
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
    borderRadius: BORDERS.radius.lg,
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

/**
 * Stili per card e paper
 * 
 * Uso:
 * - base: stile base per tutte le card
 * - gradient: aggiunge bordo sfumato in alto
 */
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

/**
 * Stili per input e form
 * 
 * Uso:
 * - base: stile base per tutti gli input
 */
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

/**
 * Stili per etichette e chip
 * 
 * Uso:
 * - base: stile base per tutti i chip
 * - primary: variante primaria
 */
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

/**
 * Utilità per campi di testo (MUI specific)
 */
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

/**
 * Stili per contenitori responsive
 * 
 * Uso:
 * - responsiveBox: contenitore base con padding responsive
 * - flexCenter: centralizza contenuto su entrambi gli assi
 * - flexBetween: distribuisce contenuto con spazio
 */
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
  TOP_GRADIENT_BORDER,  // Esportiamo anche il nuovo oggetto
  SPACING,
  TYPOGRAPHY,
  BUTTON_STYLES,
  CARD_STYLES,
  INPUT_STYLES,
  CHIP_STYLES,
  TEXT_FIELD_STYLES,
  CONTAINER_STYLES
}; 