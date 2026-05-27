'use client';

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';
import { GeneratedPaper } from '@/types/question.types';

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
    color: '#000000',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  schoolName: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 6,
  },
  subHeader: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
  },
  instruction: {
    fontSize: 10,
    marginBottom: 20,
  },
  studentLines: {
    marginBottom: 24,
  },
  studentRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-end',
  },
  studentLabel: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginRight: 4,
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    flex: 1,
  },
  shortLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    width: 60,
  },
  sectionContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  sectionInstruction: {
    fontSize: 9,
    fontStyle: 'italic',
    color: '#4B5563',
    marginBottom: 12,
  },
  questionRow: {
    marginBottom: 10,
  },
  questionText: {
    fontSize: 10,
    lineHeight: 1.5,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
    marginLeft: 16,
  },
  option: {
    fontSize: 10,
    width: '48%',
    marginBottom: 4,
  }
});

interface PDFDocumentProps {
  paper: GeneratedPaper;
  title?: string;
}

export default function PDFDocument({ paper }: PDFDocumentProps) {
  const { sections, metadata } = paper;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.schoolName}>Delhi Public School, Sector-4, Bokaro</Text>
          <Text style={styles.subHeader}>Subject: {metadata.subject || 'English'}</Text>
          <Text style={styles.subHeader}>Class: 5th</Text>
        </View>

        {/* Info Row */}
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>Time Allowed: {metadata.estimatedTime} minutes</Text>
          <Text style={styles.infoText}>Maximum Marks: {metadata.totalMarks}</Text>
        </View>

        {/* Instruction */}
        <Text style={styles.instruction}>All questions are compulsory unless stated otherwise.</Text>

        {/* Student Lines */}
        <View style={styles.studentLines}>
          <View style={styles.studentRow}>
            <Text style={styles.studentLabel}>Name:</Text>
            <View style={styles.line} />
          </View>
          <View style={styles.studentRow}>
            <Text style={styles.studentLabel}>Roll Number:</Text>
            <View style={styles.line} />
          </View>
          <View style={styles.studentRow}>
            <Text style={styles.studentLabel}>Class: 5th    Section:</Text>
            <View style={styles.shortLine} />
          </View>
        </View>

        {/* Sections */}
        {sections.map((section, sIdx) => (
          <View key={sIdx} style={styles.sectionContainer}>
            <Text style={styles.sectionLabel}>{section.sectionLabel}</Text>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionInstruction}>{section.instruction}</Text>

            {section.questions.map((q, qIdx) => (
              <View key={qIdx} style={styles.questionRow} wrap={false}>
                <Text style={styles.questionText}>
                  {q.questionNumber}. {q.questionText}
                </Text>
                
                {q.type === 'MCQ' && q.options && q.options.length > 0 && (
                  <View style={styles.optionsGrid}>
                    {q.options.map((opt, oIdx) => (
                      <Text key={oIdx} style={styles.option}>
                        {String.fromCharCode(65 + oIdx)}. {opt}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        ))}

      </Page>
    </Document>
  );
}
