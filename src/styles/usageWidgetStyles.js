import { 
  COLORS, SHADOWS, BORDERS, SPACING, 
  TYPOGRAPHY, GRADIENTS, CARD_STYLES 
} from './themes';

/**
 * Stili centralizzati per il widget di utilizzo dell'applicazione EchoLog
 * Visualizza l'utilizzo dei crediti, servizi e giorni rimanenti
 */

/**
 * Palette colori per il grafico a torta
 * Colori coordinati con il design system dell'applicazione
 */
export const CHART_COLORS = [
  COLORS.primary.main, 
  COLORS.secondary.main, 
  COLORS.accent.blue, 
  '#44d7b6', 
  '#ffc658', 
  '#9c71f7', 
  '#fa8231', 
  '#4b7bec'
];

/**
 * Stili base del componente
 * Layout e formattazione generale del widget
 */
export const styles = {
  // Container principale
  container: {
    p: SPACING.md.xs, 
    borderRadius: BORDERS.radius.md, 
    boxShadow: SHADOWS.lg, 
    mb: SPACING.md.xs
  },
  
  // Card comuni
  card: {
    ...CARD_STYLES.base,
    borderRadius: BORDERS.radius.sm,
    borderColor: 'transparent',
    height: '100%'
  },
  
  cardHeader: {
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    marginBottom: SPACING.sm.xs
  },
  
  // Box per elementi in lista
  itemBox: {
    p: SPACING.sm.xs,
    borderRadius: BORDERS.radius.sm,
    bgcolor: 'rgba(0,0,0,0.02)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  
  // Container errori
  errorContainer: {
    p: SPACING.md.xs, 
    borderRadius: BORDERS.radius.md, 
    boxShadow: SHADOWS.lg, 
    mb: SPACING.md.xs,
    bgcolor: 'rgba(240, 44, 86, 0.05)'
  },
  
  // Titolo principale
  mainTitle: {
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    mb: SPACING.sm.xs,
    fontSize: { xs: TYPOGRAPHY.fontSize.xl.xs, sm: TYPOGRAPHY.fontSize.lg.sm },
    textAlign: { xs: 'center', sm: 'left' },
    background: { xs: GRADIENTS.navbar, sm: 'none' },
    WebkitBackgroundClip: { xs: 'text', sm: 'none' },
    WebkitTextFillColor: { xs: 'transparent', sm: 'inherit' },
    p: { xs: SPACING.xs.xs, sm: 0 }
  }
};

/**
 * Indicatore di caricamento
 * Stili per la visualizzazione durante il caricamento dei dati
 */
export const loadingSpinnerStyles = {
  container: { 
    display: 'flex', 
    justifyContent: 'center', 
    p: SPACING.md.xs 
  },
  spinner: { 
    color: COLORS.primary.main 
  }
};

/**
 * Card Crediti
 * Visualizza i crediti disponibili e i giorni rimanenti
 */
export const creditCardStyles = {
  creditAmount: {
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    fontSize: { xs: '2.2rem', sm: '2rem' }
  },
  
  daysChip: {
    bgcolor: 'rgba(124, 50, 255, 0.1)',
    color: COLORS.secondary.main,
    border: 'none',
    fontSize: { xs: '0.8rem', sm: '0.75rem' },
    alignSelf: 'flex-start'
  },
  
  progressBar: {
    height: { xs: 12, sm: 10 },
    borderRadius: BORDERS.radius.sm,
    mb: SPACING.xs.xs,
    bgcolor: 'rgba(240, 44, 86, 0.1)',
    '& .MuiLinearProgress-bar': {
      background: GRADIENTS.primary
    }
  },
  
  progressText: {
    fontSize: { xs: '0.85rem', sm: 'inherit' }
  },
  
  cardContent: { 
    p: { xs: SPACING.md.xs, sm: SPACING.sm.sm } 
  }
};

/**
 * Grafico Servizi
 * Visualizza la distribuzione dei costi per servizio
 */
export const serviceChartStyles = {
  container: {
    height: 350,
    position: 'relative',
    mx: 'auto',
    width: 350
  },
  
  noDataContainer: {
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
    height: 300,
    bgcolor: 'rgba(0,0,0,0.02)',
    borderRadius: BORDERS.radius.sm,
    p: SPACING.md.xs
  },
  
  percentageLabel: {
    fill: "#333333",
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    fontSize: "14"
  },
  
  tooltipStyle: {
    borderRadius: BORDERS.radius.md,
    boxShadow: SHADOWS.md,
    border: 'none'
  }
};

/**
 * Dettagli Servizi
 * Mostra il dettaglio dei costi per ciascun servizio
 */
export const serviceDetailStyles = {
  container: {
    flex: 1, 
    display: 'flex', 
    flexDirection: 'column',
    p: { xs: SPACING.md.xs, sm: SPACING.sm.sm }
  },
  
  list: {
    flex: 1, 
    overflow: 'auto', 
    maxHeight: { xs: 'none', sm: 350 }
  },
  
  itemBox: {
    p: { xs: SPACING.sm.xs, sm: SPACING.sm.xs },
    borderRadius: { xs: BORDERS.radius.sm, sm: BORDERS.radius.sm }
  },
  
  colorDot: {
    width: { xs: 14, sm: 12 },
    height: { xs: 14, sm: 12 },
    borderRadius: BORDERS.radius.round,
    mr: SPACING.xs.sm,
    flexShrink: 0
  },
  
  serviceName: {
    fontWeight: TYPOGRAPHY.fontWeights.medium,
    fontSize: { xs: TYPOGRAPHY.fontSize.sm.sm, sm: 'inherit' }
  },
  
  serviceCost: {
    fontWeight: TYPOGRAPHY.fontWeights.semibold, 
    ml: SPACING.xs.xs,
    fontSize: { xs: TYPOGRAPHY.fontSize.sm.sm, sm: 'inherit' }
  },
  
  noDataBox: {
    p: SPACING.md.xs,
    borderRadius: BORDERS.radius.sm,
    bgcolor: 'rgba(0,0,0,0.02)',
    display: 'flex',
    justifyContent: 'center',
    flex: 1
  }
};

export default styles; 