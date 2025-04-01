import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Definizione degli stili PDF
const styles = StyleSheet.create({
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
    color: '#f02c56'
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#7c32ff'
  },
  paragraph: {
    fontSize: 12,
    lineHeight: 1.5,
    marginBottom: 10
  },
  tone: {
    fontSize: 12,
    padding: 5,
    backgroundColor: '#f5f5f7',
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
    backgroundColor: '#f5f5f7',
    padding: 5,
    margin: 2,
    borderRadius: 4
  },
  accordion: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 4
  },
  header: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f02c56',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    fontSize: 16,
    color: '#f02c56',
    fontWeight: 'bold'
  },
  date: {
    fontSize: 10,
    color: '#666'
  }
});

/**
 * Componente PDF professionale per la visualizzazione dell'analisi
 */
const AnalysisPDF = ({ analysis }) => {
  // Formatta la data corrente
  const currentDate = new Date().toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Intestazione */}
        <View style={styles.header}>
          <Text style={styles.logo}>EchoLog</Text>
          <Text style={styles.date}>{currentDate}</Text>
        </View>
        
        {/* Titolo documento */}
        <View style={styles.section}>
          <Text style={[styles.title, { fontSize: 18 }]}>Analisi del testo</Text>
        </View>
        
        {/* Riepilogo */}
        <View style={styles.section}>
          <Text style={styles.title}>Riepilogo</Text>
          <Text style={styles.paragraph}>{analysis.summary}</Text>
        </View>
        
        {/* Tono */}
        {analysis.tone && (
          <View style={styles.section}>
            <Text style={styles.title}>Tono</Text>
            <Text style={styles.tone}>{analysis.tone}</Text>
          </View>
        )}
        
        {/* Parole chiave */}
        {analysis.keywords && analysis.keywords.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.title}>Parole chiave</Text>
            <View style={styles.keywordsContainer}>
              {analysis.keywords.map((keyword, i) => (
                <Text key={i} style={styles.keyword}>{keyword}</Text>
              ))}
            </View>
          </View>
        )}
        
        {/* Sezioni tematiche */}
        {analysis.sections && analysis.sections.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.title}>Sezioni tematiche</Text>
            {analysis.sections.map((section, i) => (
              <View key={i} style={styles.accordion}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Text style={styles.paragraph}>{section.content}</Text>
                {section.keywords && section.keywords.length > 0 && (
                  <View style={styles.keywordsContainer}>
                    {section.keywords.map((keyword, j) => (
                      <Text key={j} style={styles.keyword}>{keyword}</Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Footer */}
        <Text style={{ fontSize: 8, color: '#999', position: 'absolute', bottom: 30, left: 30 }}>
          Generato con EchoLog - Documento PDF vettoriale
        </Text>
      </Page>
    </Document>
  );
};

export default AnalysisPDF; 