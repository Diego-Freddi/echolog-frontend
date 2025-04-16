import { COLORS } from './themes';

/**
 * File di stili per il componente AnalysisPDF
 * Contiene tutti gli stili necessari per la generazione del PDF di analisi,
 * utilizzando le costanti di stile definite nel file themes.js
 * 
 * NOTA: I valori di borderRadius sono numeri diretti anziché riferimenti a BORDERS.radius
 * perché il componente PDF (@react-pdf/renderer) richiede valori numerici primitivi
 * e non supporta l'uso di oggetti o riferimenti complessi.
 */

// Adattamento dei colori dal tema globale al formato richiesto da @react-pdf/renderer
const PDF_COLORS = {
  primary: COLORS.primary.main,
  secondary: COLORS.secondary.main,
  background: COLORS.neutral.lightGray,
  backgroundDark: '#f9f9f9', // Leggera variazione per la leggibilità
  text: COLORS.neutral.darkGray,
  lightText: COLORS.neutral.gray,
  border: COLORS.primary.main
};

// Definizione degli stili PDF 
export const pdfStyles = {
  page: {
    padding: 30,
    fontFamily: 'Helvetica'
  },
  section: {
    marginBottom: 20
  },
  title: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
    color: PDF_COLORS.primary
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: 'bold',
    color: PDF_COLORS.secondary
  },
  paragraph: {
    fontSize: 12,
    lineHeight: 1.5,
    marginBottom: 10
  },
  tone: {
    fontSize: 12,
    padding: 5,
    backgroundColor: PDF_COLORS.background,
    borderRadius: 4,
    marginBottom: 10,
    alignSelf: 'flex-start'
  },
  keywordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10
  },
  keyword: {
    fontSize: 10,
    backgroundColor: PDF_COLORS.background,
    padding: 5,
    margin: 2,
    borderRadius: 4
  },
  accordion: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: PDF_COLORS.backgroundDark,
    borderRadius: 4
  },
  header: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: PDF_COLORS.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    fontSize: 16,
    color: PDF_COLORS.primary,
    fontWeight: 'bold'
  },
  date: {
    fontSize: 10,
    color: PDF_COLORS.text
  },
  footer: {
    fontSize: 8,
    color: PDF_COLORS.lightText,
    marginTop: 20,
    textAlign: 'center'
  }
};

// Helper per verificare se un array è valido e non vuoto
export const isValidArray = (arr) => Array.isArray(arr) && arr.length > 0;

export default pdfStyles; 