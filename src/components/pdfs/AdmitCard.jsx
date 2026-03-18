import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'
import { SCHOOL_LOGO } from './FeeReceiptPDF'

// ─── STYLES ───────────────────────────────────────────────────────────────────
const S = StyleSheet.create({
  page: {
    padding: 0,
    fontFamily: 'Helvetica',
    backgroundColor: '#fff',
  },

  // ── Outer card border ──────────────────────────────────────────────────────
  cardOuter: {
    margin: '14 18',
    border: '1.2pt solid black',
    padding: 0,
  },

  // ── Header row: logo + school info + affiliation ───────────────────────────
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 8,
    borderBottom: '0.8pt solid black',
  },
  logo: { width: 54, height: 54, marginRight: 12 },
  schoolBlock: { flex: 1 },
  schoolName: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 0.4,
  },
  schoolAddr: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    marginTop: 2,
  },
  affiliationTxt: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#cc0000',
    textAlign: 'right',
    marginBottom: 6,
  },

  // ── ADMIT CARD title box ───────────────────────────────────────────────────
  titleBox: {
    border: '1.2pt solid black',
    alignSelf: 'center',
    paddingHorizontal: 30,
    paddingVertical: 4,
    marginTop: 8,
    marginBottom: 4,
  },
  titleTxt: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  examTxt: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginTop: 3,
    marginBottom: 6,
  },

  // ── Body: fields (left) + photo (right) ───────────────────────────────────
  bodyRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 8,
  },
  fieldsCol: { flex: 1 },

  // ── Field rows ────────────────────────────────────────────────────────────
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  fieldLabel: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    width: 130,
  },
  fieldColon: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    marginRight: 4,
  },
  fieldVal: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
  },
  dotLine: {
    flex: 1,
    borderBottom: '0.8pt dotted black',
    paddingBottom: 1,
  },

  // ── Photo box ─────────────────────────────────────────────────────────────
  photoCol: {
    width: 90,
    marginLeft: 10,
    marginTop: 4,
  },
  photoBox: {
    width: 85,
    height: 100,
    border: '1pt dashed black',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  photoImg: { width: '100%', height: '100%' },
  photoTxt: { fontSize: 7.5, color: '#777' },
  photoLabel: {
    fontSize: 7,
    textAlign: 'center',
    marginTop: 2,
  },

  // ── Note ──────────────────────────────────────────────────────────────────
  noteTxt: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    paddingHorizontal: 12,
    paddingBottom: 8,
    lineHeight: 1.4,
  },

  // ── Footer: signatures ────────────────────────────────────────────────────
  footer: {
    borderTop: '1.2pt solid black',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 6,
  },
  footerSigBlock: { alignItems: 'center' },
  footerSigLine: {
    borderBottom: '0.8pt solid black',
    width: 90,
    marginBottom: 3,
  },
  footerSigLabel: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
  },

  // ── Dashed cut line ───────────────────────────────────────────────────────
  cutLine: {
    borderBottom: '1pt dashed black',
    marginHorizontal: 0,
    marginTop: 8,
  },
})

// ─── FIELD ROW ────────────────────────────────────────────────────────────────

const Field = ({ label, value }) => (
  <View style={S.fieldRow}>
    <Text style={S.fieldLabel}>{label}</Text>
    <Text style={S.fieldColon}>:-</Text>
    <View style={S.dotLine}>
      <Text style={S.fieldVal}>{value || ''}</Text>
    </View>
  </View>
)

const AdmitCardPDF = ({ student = {} }) => (
  <Document>
    <Page size="A4" style={S.page}>
      <View style={S.cardOuter}>
        {/* ── Header ── */}
        <View style={S.headerRow}>
          <Image src={SCHOOL_LOGO} style={S.logo} />
          <View style={S.schoolBlock}>
            <Text style={S.affiliationTxt}>
              Affiliation No.- {student?.affiliationNo || '2134266'}
            </Text>
            <Text style={S.schoolName}>SARVODAYA VIDYALAYA</Text>
            <Text style={S.schoolAddr}>
              VILL-KAIRI PHOOL , NEAR SHAHPUR SUKKHA, BASI KIRATPUR , KIRATPUR
            </Text>
          </View>
        </View>

        {/* ── Title ── */}
        <View style={S.titleBox}>
          <Text style={S.titleTxt}>ADMIT CARD</Text>
        </View>
        <Text style={S.examTxt}>
          {student?.examTitle || 'ANNUAL EXAMINATION (2025-26)'}
        </Text>

        {/* ── Body: fields + photo ── */}
        <View style={S.bodyRow}>
          <View style={S.fieldsCol}>
            <Field label="SR. NO." value={student?.srNo} />
            <Field label="STUDENT'S NAME" value={student?.fullName} />
            <Field label="FATHER'S NAME" value={student?.fatherName} />
            <Field label="CLASS" value={student?.className} />
            <Field label="DUES PENDING" value={student?.duesPending} />
            <Field label="AVAIL TRANSPORT" value={student?.availTransport} />
          </View>

          {/* Photo box */}
          <View style={S.photoCol}>
            <View style={S.photoBox}>
              {student?.photo ? (
                <Image src={student.photo} style={S.photoImg} />
              ) : (
                <Text style={S.photoTxt}>Photo</Text>
              )}
            </View>
            {student?.photoLabel ? (
              <Text style={S.photoLabel}>{student.photoLabel}</Text>
            ) : null}
          </View>
        </View>

        {/* ── Note ── */}
        <Text style={S.noteTxt}>
          Note:- Keep this card safely and must bring to the exam venue on every exam
          date.
        </Text>

        {/* ── Footer signatures ── */}
        <View style={S.footer}>
          {['CLASS TEACHER', 'CLERK', 'PRINCIPAL'].map((label) => (
            <View key={label} style={S.footerSigBlock}>
              <View style={S.footerSigLine} />
              <Text style={S.footerSigLabel}>{label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Cut line at bottom */}
      <View style={S.cutLine} />
    </Page>
  </Document>
)

export default AdmitCardPDF
