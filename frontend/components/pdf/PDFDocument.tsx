'use client';

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import { GeneratedPaper } from '@/types/question.types';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#111827',
    marginHorizontal: -40,
    marginTop: -40,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
  },
  headerSubject: {
    fontSize: 8,
    color: '#9CA3AF',
    letterSpacing: 2,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  headerMetaText: {
    fontSize: 9,
    color: '#D1D5DB',
  },
  headerMetaBold: {
    fontSize: 9,
    color: '#FFFFFF',
    fontFamily: 'Helvetica-Bold',
  },
  studentInfo: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  studentField: {
    flex: 1,
  },
  studentLabel: {
    fontSize: 7,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  studentLine: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#9CA3AF',
    height: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
    marginTop: 12,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
  },
  sectionTitle: {
    fontSize: 11,
    color: '#374151',
    fontFamily: 'Helvetica-Bold',
  },
  sectionInstruction: {
    fontSize: 8,
    color: '#6B7280',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  questionRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
    padding: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
  },
  questionNumber: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  questionNumberText: {
    fontSize: 7,
    color: '#FFFFFF',
    fontFamily: 'Helvetica-Bold',
  },
  questionContent: {
    flex: 1,
  },
  questionText: {
    fontSize: 9,
    color: '#111827',
    lineHeight: 1.5,
    marginBottom: 4,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 4,
  },
  option: {
    fontSize: 8,
    color: '#4B5563',
    width: '48%',
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 3,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
  },
  badgeEasy: { backgroundColor: '#DCFCE7', color: '#15803D' },
  badgeMedium: { backgroundColor: '#FEF9C3', color: '#A16207' },
  badgeHard: { backgroundColor: '#FEE2E2', color: '#DC2626' },
  badgeType: { backgroundColor: '#F3F4F6', color: '#374151' },
  marks: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
    flexShrink: 0,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginVertical: 8,
  },
});

interface PDFDocumentProps {
  paper: GeneratedPaper;
  title?: string;
}

export default function PDFDocument({ paper, title }: PDFDocumentProps) {
  const { studentInfo, sections, metadata } = paper;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerSubject}>{metadata.subject}</Text>
          <Text style={styles.headerTitle}>{title || 'Question Paper'}</Text>
          <View style={styles.headerMeta}>
            <Text style={styles.headerMetaText}>Total Marks: <Text style={styles.headerMetaBold}>{metadata.totalMarks}</Text></Text>
            <Text style={styles.headerMetaText}>  |  </Text>
            <Text style={styles.headerMetaText}>Questions: <Text style={styles.headerMetaBold}>{metadata.totalQuestions}</Text></Text>
            <Text style={styles.headerMetaText}>  |  </Text>
            <Text style={styles.headerMetaText}>Time: <Text style={styles.headerMetaBold}>{metadata.estimatedTime} mins</Text></Text>
          </View>
        </View>

        {/* Student Info */}
        <View style={styles.studentInfo}>
          {['Name', 'Roll Number', 'Section'].map((label) => (
            <View key={label} style={styles.studentField}>
              <Text style={styles.studentLabel}>{label}</Text>
              <View style={styles.studentLine} />
            </View>
          ))}
        </View>

        {/* Sections */}
        {sections.map((section, sIdx) => (
          <View key={sIdx}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>{section.sectionLabel}</Text>
              <Text style={styles.sectionTitle}> — {section.title}</Text>
            </View>
            <Text style={styles.sectionInstruction}>{section.instruction}</Text>

            {section.questions.map((q, qIdx) => (
              <View key={qIdx} style={styles.questionRow} wrap={false}>
                <View style={styles.questionNumber}>
                  <Text style={styles.questionNumberText}>{q.questionNumber}</Text>
                </View>
                <View style={styles.questionContent}>
                  <Text style={styles.questionText}>{q.questionText}</Text>
                  {q.type === 'MCQ' && q.options && q.options.length > 0 && (
                    <View style={styles.optionsGrid}>
                      {q.options.map((opt, oIdx) => (
                        <Text key={oIdx} style={styles.option}>
                          {String.fromCharCode(65 + oIdx)}. {opt}
                        </Text>
                      ))}
                    </View>
                  )}
                  <View style={styles.tagsRow}>
                    <Text
                      style={[
                        styles.badge,
                        q.difficulty === 'Easy'
                          ? styles.badgeEasy
                          : q.difficulty === 'Hard'
                          ? styles.badgeHard
                          : styles.badgeMedium,
                      ]}
                    >
                      {q.difficulty}
                    </Text>
                    <Text style={[styles.badge, styles.badgeType]}>{q.type}</Text>
                  </View>
                </View>
                <Text style={styles.marks}>[{q.marks}M]</Text>
              </View>
            ))}

            {sIdx < sections.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </Page>
    </Document>
  );
}
