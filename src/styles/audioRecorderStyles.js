import {
  ANIMATIONS,
  COLORS,
  SHADOWS,
  BUTTON_STYLES,
  BORDERS,
  SPACING,
  TYPOGRAPHY
} from './themes';

// Animazione di pulsazione per il microfono attivo
export const pulse = ANIMATIONS.pulse;

// Stili per i bottoni con design Apple-Like
export const buttonStyles = {
  base: {
    ...BUTTON_STYLES.base,
    ...BUTTON_STYLES.filled,
    borderRadius: BORDERS.radius.sm,
    fontSize: { xs: '0.8rem', sm: '0.85rem' },
    py: { xs: 0.6, sm: 0.8 },
    px: { xs: 1.8, sm: 2.5 },
    minWidth: { xs: '45%', sm: 'auto' }
  },
  selected: BUTTON_STYLES.tabSelected,
  sourceSelector: {
    borderRadius: BORDERS.radius.sm,
    transition: 'all 0.2s ease-in-out',
    fontSize: { xs: '0.75rem', sm: '0.8rem' },
    py: { xs: 0.4, sm: 0.8 },
    px: { xs: 1.2, sm: 1.8 },
    minWidth: { xs: '45%', sm: 'auto' }
  },
  disabled: BUTTON_STYLES.disabled
};

// Stili per il container onde audio
export const audioWaveContainerStyles = {
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  height: { xs: 60, sm: 80 },
  width: '100%',
  position: 'relative',
  gap: { xs: 2, sm: 3 }
};

// Stili per il componente onde audio
export const audioWaveStyles = {
  barContainer: {
    position: 'relative',
    width: 8,
    height: '100%',
    display: 'flex',
    alignItems: 'flex-end'
  },
  bar: (isRecording, level) => ({
    height: `${isRecording ? level : 3}px`,
    minHeight: '3px',
    opacity: isRecording ? (level > 5 ? 1 : 0.7) : 0.3,
    transition: 'height 0.1s ease-in-out, opacity 0.2s ease, background-color 0.3s ease'
  })
};

// Stili per il player audio
export const audioPlayerStyles = {
  width: '100%',
  borderRadius: BORDERS.radius.lg,
  height: { xs: 32, sm: 40 },
  '&::-webkit-media-controls-panel': {
    backgroundColor: COLORS.neutral.lightGray,
    borderRadius: BORDERS.radius.lg,
    p: { xs: 0.5, sm: 1 }
  },
  '&::-webkit-media-controls-play-button': {
    backgroundColor: COLORS.primary.main,
    borderRadius: BORDERS.radius.round,
    color: COLORS.neutral.white
  },
  '&::-webkit-media-controls-timeline': {
    backgroundColor: COLORS.neutral.mediumGray,
    borderRadius: BORDERS.radius.xs,
    height: 4
  }
};

// Stili per il timer
export const timerStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  mt: SPACING.xs,
  chip: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    height: { xs: 28, sm: 36 },
    fontWeight: TYPOGRAPHY.fontWeights.medium,
    boxShadow: SHADOWS.primarySm
  }
};

// Stili per indicatori e messaggi
export const statusIndicatorStyles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.xs,
    mt: SPACING.xs
  },
  text: {
    fontSize: TYPOGRAPHY.fontSize.xs
  }
}; 