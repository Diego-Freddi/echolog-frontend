import React from 'react';
import PropTypes from 'prop-types';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { pdfStyles, isValidArray } from '../../styles/analysisPDFStyles';

/**
 * Componente per la generazione del PDF dell'analisi
 * Utilizza @react-pdf/renderer per la creazione del documento PDF
 */
const AnalysisPDF = ({ analysis, locale = 'it-IT' }) => {
  // Formatta la data nel formato locale
  const formattedDate = new Date().toLocaleDateString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        {/* Header con logo e data */}
        <View style={pdfStyles.header}>
          <Text style={pdfStyles.logo}>EchoLog Analysis</Text>
          <Text style={pdfStyles.date}>{formattedDate}</Text>
        </View>

        {/* Titolo del documento */}
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.title}>{analysis?.title || 'Analisi audio'}</Text>
        </View>

        {/* Riepilogo */}
        {analysis?.summary && (
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionTitle}>Riepilogo</Text>
            <Text style={pdfStyles.paragraph}>{analysis.summary}</Text>
          </View>
        )}

        {/* Tono */}
        {analysis?.tone && (
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionTitle}>Tono</Text>
            <Text style={pdfStyles.tone}>{analysis.tone}</Text>
          </View>
        )}

        {/* Parole Chiave */}
        {isValidArray(analysis?.keywords) && (
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionTitle}>Parole Chiave</Text>
            <View style={pdfStyles.keywordsContainer}>
              {analysis.keywords.map((keyword, index) => (
                <Text key={`keyword-${index}`} style={pdfStyles.keyword}>
                  {keyword}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Sezioni tematiche */}
        {isValidArray(analysis?.sections) && (
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionTitle}>Sezioni Tematiche</Text>
            {analysis.sections.map((section, index) => (
              <View key={`section-${index}`} style={pdfStyles.accordion}>
                <Text style={[pdfStyles.paragraph, { fontWeight: 'bold' }]}>
                  {section.title}
                </Text>
                <Text style={pdfStyles.paragraph}>{section.content}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Footer */}
        <Text style={pdfStyles.footer}>
          Generato con EchoLog - {formattedDate}
        </Text>
      </Page>
    </Document>
  );
};

// Validazione delle props
AnalysisPDF.propTypes = {
  analysis: PropTypes.shape({
    title: PropTypes.string,
    summary: PropTypes.string,
    tone: PropTypes.string,
    keywords: PropTypes.arrayOf(PropTypes.string),
    sections: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired
      })
    )
  }).isRequired,
  locale: PropTypes.string
};

export default AnalysisPDF; 