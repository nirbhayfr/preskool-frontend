// components/pdf/ExamResultPDF.jsx
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import { SCHOOL_LOGO } from './FeeReceiptPDF'

const S = StyleSheet.create({
  page: { padding: 0, fontFamily: 'Helvetica', backgroundColor: '#fff' },

  outer: { margin: '14 18', border: '1.5pt solid black' },

  // Header
  hdrRow: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottom: '0.8pt solid black',
  },
  schoolName: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  tagLine: { fontSize: 9, textAlign: 'center', marginTop: 2 },
  addrBold: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginTop: 2,
  },
  logo: {
    width: 52,
    height: 52,
    marginRight: 10,
    borderRadius: 26,
  },

  // Reg row
  regRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderBottom: '0.8pt solid black',
  },
  regTxt: { fontSize: 8.5, fontFamily: 'Helvetica-Bold' },

  // Title bar
  titleBar: {
    backgroundColor: 'black',
    marginHorizontal: 50,
    marginTop: 10,
    marginBottom: 10,
    paddingVertical: 5,
    alignItems: 'center',
  },
  titleTxt: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: 'white',
    letterSpacing: 1,
  },

  // Student info grid
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 10,
    gap: 6,
  },
  infoCell: { width: '48%', flexDirection: 'row' },
  infoLabel: { fontSize: 8.5, fontFamily: 'Helvetica-Bold', width: 80 },
  infoColon: { fontSize: 8.5, marginRight: 3 },
  infoVal: { fontSize: 8.5, flex: 1 },

  // Table
  tableWrap: { paddingHorizontal: 16, marginBottom: 10 },
  tableHead: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    paddingVertical: 5,
    paddingHorizontal: 6,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderBottom: '0.5pt solid #e5e7eb',
  },
  tableRowAlt: { backgroundColor: '#f9fafb' },

  colSubject: { flex: 3, fontSize: 8.5 },
  colNum: { flex: 1.5, fontSize: 8.5, textAlign: 'center' },
  colResult: { flex: 1.5, fontSize: 8.5, textAlign: 'center' },

  thTxt: { fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: '#fff' },

  passClr: { color: '#059669' },
  failClr: { color: '#dc2626' },

  // Summary box
  summaryOuter: {
    marginHorizontal: 16,
    marginBottom: 14,
    border: '0.8pt solid #e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  summaryTitle: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderBottom: '0.8pt solid #e5e7eb',
  },
  summaryTitleTxt: { fontSize: 8.5, fontFamily: 'Helvetica-Bold' },
  summaryRow: { flexDirection: 'row' },
  summaryCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRight: '0.5pt solid #e5e7eb',
  },
  summaryCellLast: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  summaryNum: { fontSize: 13, fontFamily: 'Helvetica-Bold' },
  summaryLabel: { fontSize: 7, color: '#6b7280', marginTop: 2 },

  // Signatures
  sigRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTop: '0.8pt solid black',
  },
  sigBlock: { alignItems: 'center' },
  sigLine: { borderBottom: '0.7pt solid black', marginBottom: 3 },
  sigLbl: { fontSize: 8.5, fontFamily: 'Helvetica-Bold' },
})

const ExamResultPDF = ({
  student = {},
  examType = '',
  examData = [],
  totalMarks = 0,
  marksObtained = 0,
  percentage = '0.00',
  finalResult = 'Fail',
}) => (
  <Document>
    <Page size="A4" style={S.page}>
      <View style={S.outer}>
        {/* Header */}
        <View style={S.hdrRow}>
          <Image src={SCHOOL_LOGO} style={S.logo} />
          <Text style={S.schoolName}>SARVODAYA VIDYALAYA</Text>
          <Text style={S.tagLine}>A Co-educational English Medium School</Text>
          <Text style={S.addrBold}>
            Kairi Phool Near Shahpur Sukkha, Najibabad Road, Kiratpur-246731 (Bijnor)
          </Text>
        </View>

        {/* Reg / UDISE */}
        <View style={S.regRow}>
          <Text style={S.regTxt}>Registration No. BIJ0903727510</Text>
          <Text style={S.regTxt}>UDISE No. 09030704795</Text>
        </View>

        {/* Title */}
        <View style={S.titleBar}>
          <Text style={S.titleTxt}>{examType?.toUpperCase()} EXAMINATION RESULT</Text>
        </View>

        {/* Student Info */}
        <View style={S.infoGrid}>
          {[
            { label: 'Student Name', value: student?.FullName || '' },
            { label: 'Admission No', value: student?.AdmissionNo || '' },
            {
              label: 'Class',
              value: `${student?.ClassID || ''} - ${student?.SectionID || ''}`,
            },
            { label: 'Roll No', value: student?.RollNo || '' },
            {
              label: 'Father Name',
              value: student?.GuardianRelation === 'Father' ? student?.GuardianName : '',
            },
            { label: 'Session', value: '2025-26' },
          ].map(({ label, value }) => (
            <View key={label} style={S.infoCell}>
              <Text style={S.infoLabel}>{label}</Text>
              <Text style={S.infoColon}>:</Text>
              <Text style={S.infoVal}>{value}</Text>
            </View>
          ))}
        </View>

        {/* Table */}
        <View style={S.tableWrap}>
          {/* Head */}
          <View style={S.tableHead}>
            <Text style={[S.thTxt, S.colSubject]}>Subject</Text>
            <Text style={[S.thTxt, S.colNum]}>Max Marks</Text>
            <Text style={[S.thTxt, S.colNum]}>Min Marks</Text>
            <Text style={[S.thTxt, S.colNum]}>Obtained</Text>
            <Text style={[S.thTxt, S.colResult]}>Result</Text>
          </View>

          {/* Rows */}
          {examData.map((row, i) => {
            const isPass = row.MarksObtained >= row.MinMarks
            return (
              <View key={i} style={[S.tableRow, i % 2 !== 0 && S.tableRowAlt]}>
                <Text style={S.colSubject}>{row.Subject}</Text>
                <Text style={S.colNum}>{row.MaxMarks}</Text>
                <Text style={S.colNum}>{row.MinMarks}</Text>
                <Text style={S.colNum}>{row.MarksObtained}</Text>
                <Text style={[S.colResult, isPass ? S.passClr : S.failClr]}>
                  {isPass ? 'Pass' : 'Fail'}
                </Text>
              </View>
            )
          })}
        </View>

        {/* Summary */}
        <View style={S.summaryOuter}>
          <View style={S.summaryTitle}>
            <Text style={S.summaryTitleTxt}>Examination Summary</Text>
          </View>
          <View style={S.summaryRow}>
            {[
              { num: totalMarks, label: 'Total Marks' },
              { num: marksObtained, label: 'Marks Obtained' },
              { num: `${percentage}%`, label: 'Percentage' },
            ].map(({ num, label }) => (
              <View key={label} style={S.summaryCell}>
                <Text style={S.summaryNum}>{num}</Text>
                <Text style={S.summaryLabel}>{label}</Text>
              </View>
            ))}
            <View style={S.summaryCellLast}>
              <Text
                style={[S.summaryNum, finalResult === 'Pass' ? S.passClr : S.failClr]}
              >
                {finalResult}
              </Text>
              <Text style={S.summaryLabel}>Final Result</Text>
            </View>
          </View>
        </View>

        {/* Signatures */}
        <View style={S.sigRow}>
          <View style={S.sigBlock}>
            <View style={[S.sigLine, { width: 110 }]} />
            <Text style={S.sigLbl}>Class Teacher</Text>
          </View>
          <View style={S.sigBlock}>
            <View style={[S.sigLine, { width: 80 }]} />
            <Text style={S.sigLbl}>Checked by</Text>
          </View>
          <View style={S.sigBlock}>
            <View style={[S.sigLine, { width: 110 }]} />
            <Text style={S.sigLbl}>Principal's Signature</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
)

export default ExamResultPDF
