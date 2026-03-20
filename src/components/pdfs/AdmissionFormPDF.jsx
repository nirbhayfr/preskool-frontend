import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'
import { SCHOOL_LOGO } from './FeeReceiptPDF'

// ─── STYLES ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 18,
    paddingRight: 18,
    fontSize: 8.5,
    fontFamily: 'Helvetica',
  },

  // Header
  hdrCenter: { alignItems: 'center', marginBottom: 5 },
  logo: { width: 46, height: 46, marginBottom: 2 },
  school: { fontSize: 16, fontFamily: 'Helvetica-Bold', letterSpacing: 0.5 },
  addr: { fontSize: 7.5, fontFamily: 'Helvetica-Bold', marginTop: 1 },
  title: { fontSize: 12, fontFamily: 'Helvetica-Bold', letterSpacing: 0.5, marginTop: 3 },

  // Photo box — absolute top-right
  photo: {
    position: 'absolute',
    top: 14,
    right: 18,
    width: 84,
    height: 100,
    border: '1pt solid black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoImg: { width: '100%', height: '100%' },
  photoTxt: { fontSize: 8, color: '#555' },

  // Horizontal line
  hr: { borderBottom: '0.6pt solid black', marginTop: 3, marginBottom: 4 },

  // ── Inline label + underline value row ──────────────────────────────────
  row: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 4 },
  bold: { fontFamily: 'Helvetica-Bold' },
  uline: { borderBottom: '0.5pt dotted black', paddingBottom: 1 },

  // ── DOB digit box ────────────────────────────────────────────────────────
  digitBox: {
    width: 16,
    height: 15,
    border: '0.7pt solid black',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 1,
  },
  digitTxt: { fontSize: 8.5 },

  // ── Checkbox ─────────────────────────────────────────────────────────────
  chk: {
    width: 13,
    height: 13,
    border: '0.7pt solid black',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 3,
    marginRight: 1,
  },
  chkTxt: { fontSize: 9 },

  // ── Category row ─────────────────────────────────────────────────────────
  catRow: { flexDirection: 'row', marginBottom: 3, marginLeft: 20 },
  catItem: { alignItems: 'center', marginRight: 14 },
  catBox: {
    width: 13,
    height: 13,
    border: '0.7pt solid black',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 1,
  },
  catLbl: { fontSize: 7 },

  // ── Parents table ─────────────────────────────────────────────────────────
  ptWrap: { marginLeft: 20, border: '0.7pt solid black', marginBottom: 4 },
  ptRow: { flexDirection: 'row' },
  ptTopBdr: { borderTop: '0.5pt solid black' },
  ptC0: { width: '34%', padding: '3 4', borderRight: '0.5pt solid black' },
  ptC1: { width: '33%', padding: '3 4', borderRight: '0.5pt solid black' },
  ptC2: { width: '33%', padding: '3 4' },
  ptH: { fontSize: 8, fontFamily: 'Helvetica-Bold' },
  ptV: { fontSize: 8 },

  // ── Subjects grid ─────────────────────────────────────────────────────────
  subjWrap: { flexDirection: 'row', flexWrap: 'wrap', marginLeft: 20, marginTop: 2 },
  subjRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '31%',
    marginRight: '2%',
    marginBottom: 3,
  },
  subjNum: { fontSize: 8, fontFamily: 'Helvetica-Bold', marginRight: 2 },
  subjLine: {
    flex: 1,
    borderBottom: '0.5pt dotted black',
    paddingBottom: 1,
    fontSize: 8,
  },

  // ── Declaration ──────────────────────────────────────────────────────────
  declTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 3,
  },
  declText: { fontSize: 7.5, lineHeight: 1.4 },

  // ── Signature row ────────────────────────────────────────────────────────
  sigRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 },
  sigBlock: { alignItems: 'center' },
  sigLine: { borderBottom: '0.7pt solid black', marginBottom: 3 },
  sigLbl: { fontSize: 7.5 },

  // ── PAGE 2 ───────────────────────────────────────────────────────────────
  p2Title: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  p2Para: { fontSize: 7.5, lineHeight: 1.4, marginBottom: 5 },
  p2Row: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 4 },
  p2Lbl: { fontSize: 8 },
  p2Val: {
    fontSize: 8,
    borderBottom: '0.5pt dotted black',
    paddingBottom: 1,
    marginLeft: 3,
  },

  // ── PAGE 3 card ──────────────────────────────────────────────────────────
  cardOuter: { border: '1.5pt solid black', margin: '30 40', padding: '16 20' },
  cardTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginBottom: 14,
  },
  cardRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 9 },
  cardLbl: { fontSize: 9, fontFamily: 'Helvetica-Bold', width: 130 },
  cardVal: { flex: 1, fontSize: 9, borderBottom: '0.5pt solid black', paddingBottom: 1 },
})

// ─── TINY HELPERS ─────────────────────────────────────────────────────────────
const HR = () => <View style={s.hr} />

/** Render individual digit boxes for DOB / age fields */
const DigitBoxes = ({ value = '', length = 2 }) => {
  const chars = String(value || '')
    .replace(/\D/g, '')
    .padStart(length, ' ')
    .slice(-length)
    .split('')
  return (
    <View style={{ flexDirection: 'row', marginLeft: 2 }}>
      {chars.map((c, i) => (
        <View key={i} style={s.digitBox}>
          <Text style={s.digitTxt}>{c.trim()}</Text>
        </View>
      ))}
    </View>
  )
}

/** A checkbox — shows tick if checked===true */
const Chk = ({ checked }) => (
  <View style={s.chk}>
    <Text style={s.chkTxt}>{checked ? '✓' : ''}</Text>
  </View>
)

// ─── PAGE 1 ──────────────────────────────────────────────────────────────────
const AdmPage1 = ({ d }) => {
  // Parse dob → day, month, year strings
  let day = '',
    mon = '',
    yr = ''
  if (d?.dob) {
    const dt = new Date(d.dob)
    if (!isNaN(dt)) {
      day = String(dt.getDate()).padStart(2, '0')
      mon = String(dt.getMonth() + 1).padStart(2, '0')
      yr = String(dt.getFullYear())
    }
  }
  const isMale = (d?.gender || '').toLowerCase() === 'male'
  const isFemale = (d?.gender || '').toLowerCase() === 'female'
  const cat = (d?.category || '').toUpperCase()

  return (
    <Page size="A4" style={s.page}>
      {/* Photo box */}
      <View style={s.photo}>
        {d?.photo ? (
          <Image src={d.photo} style={s.photoImg} />
        ) : (
          <Text style={s.photoTxt}>Photo</Text>
        )}
      </View>

      {/* ── Header ── */}
      <View style={s.hdrCenter}>
        <Image src={SCHOOL_LOGO} style={s.logo} />
        <Text style={s.school}>SARVODAYA VIDYALAYA</Text>
        <Text style={s.addr}>
          KAIRI PHOOL, SHAHPUR SUKKHA, NAJIBABAD ROAD, KIRATPUR-246731
        </Text>
        <Text style={s.title}>ADMISSION FORM</Text>
      </View>

      {/* Sr.No */}
      <View style={[s.row, { paddingRight: 100 }]}>
        <Text style={s.bold}>Sr.No.</Text>
        <Text style={[s.uline, { flex: 1, marginLeft: 4 }]}>{d?.srNo || ''}</Text>
      </View>

      {/* Class / Session */}
      <View style={[s.row, { paddingRight: 100 }]}>
        <Text style={s.bold}>Class in which admission is sought for</Text>
        <Text style={[s.uline, { width: 80, marginLeft: 4, marginRight: 14 }]}>
          {d?.classAdmission || ''}
        </Text>
        <Text style={s.bold}>Session</Text>
        <Text style={[s.uline, { width: 70, marginLeft: 4 }]}>{d?.session || ''}</Text>
      </View>

      {/* Name of Student */}
      <View style={s.row}>
        <Text style={s.bold}>Name of Student</Text>
        <Text style={[s.uline, { flex: 1, marginLeft: 4 }]}>{d?.fullName || ''}</Text>
      </View>

      <HR />

      {/* 1A — Name of Child */}
      <View style={s.row}>
        <Text style={[s.bold, { width: 16 }]}>1.</Text>
        <Text style={s.bold}>A) Name of the Child in full (in capital letters)</Text>
        <Text style={[s.uline, { flex: 1, marginLeft: 4 }]}>{d?.fullName || ''}</Text>
      </View>

      {/* 1B — Sex */}
      <View style={[s.row, { marginLeft: 20, marginBottom: 5 }]}>
        <Text style={s.bold}>B) Sex</Text>
        <Text style={[s.bold, { marginLeft: 10 }]}>Male</Text>
        <Chk checked={isMale} />
        <Text style={[s.bold, { marginLeft: 8 }]}>Female</Text>
        <Chk checked={isFemale} />
      </View>

      {/* 2 — DOB */}
      <View style={[s.row, { flexWrap: 'wrap' }]}>
        <Text style={[s.bold, { width: 16 }]}>2.</Text>
        <Text style={s.bold}>Date of Birth</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 6 }}>
          <Text style={[s.bold, { fontSize: 7.5, marginRight: 2 }]}>Day</Text>
          <DigitBoxes value={day} length={2} />
          <Text style={{ marginHorizontal: 3 }}>/</Text>
          <Text style={[s.bold, { fontSize: 7.5, marginRight: 2 }]}>Month</Text>
          <DigitBoxes value={mon} length={2} />
          <Text style={{ marginHorizontal: 3 }}>/</Text>
          <Text style={[s.bold, { fontSize: 7.5, marginRight: 2 }]}>Year</Text>
          <DigitBoxes value={yr} length={4} />
        </View>
      </View>

      {/* In words */}
      <View style={[s.row, { marginLeft: 20 }]}>
        <Text style={s.bold}>In words</Text>
        <Text style={[s.uline, { flex: 1, marginLeft: 4 }]}>{d?.dobWords || ''}</Text>
      </View>

      {/* Age on 31 March */}
      <View style={[s.row, { marginLeft: 20, marginBottom: 5 }]}>
        <Text style={s.bold}>Age of the student as on 31st March :</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 6 }}>
          <Text style={[s.bold, { fontSize: 7.5, marginRight: 2 }]}>Year</Text>
          <DigitBoxes value={d?.ageYear || ''} length={2} />
          <Text style={[s.bold, { fontSize: 7.5, marginLeft: 3, marginRight: 2 }]}>
            Month
          </Text>
          <DigitBoxes value={d?.ageMonth || ''} length={2} />
          <Text style={[s.bold, { fontSize: 7.5, marginLeft: 3, marginRight: 2 }]}>
            Day
          </Text>
          <DigitBoxes value={d?.ageDay || ''} length={2} />
        </View>
      </View>

      {/* 3 — Blood Group */}
      <View style={s.row}>
        <Text style={[s.bold, { width: 16 }]}>3.</Text>
        <Text style={s.bold}>Blood Group of the child</Text>
        <Text style={[s.uline, { flex: 1, marginLeft: 4 }]}>{d?.bloodGroup || ''}</Text>
      </View>

      {/* 4 — Category */}
      <View style={s.row}>
        <Text style={[s.bold, { width: 16 }]}>4.</Text>
        <Text style={s.bold}>
          Do you belong to Gen./SC/ST/OBC/EWS/Disabled/S.G. Child? attach certificate
        </Text>
      </View>
      <View style={s.catRow}>
        {[
          { label: 'Gen. Cat', key: 'GEN' },
          { label: 'SC', key: 'SC' },
          { label: 'ST', key: 'ST' },
          { label: 'OBC', key: 'OBC' },
          { label: 'EWS', key: 'EWS' },
          { label: 'Disabled', key: 'DISABLED' },
          { label: 'SG Child', key: 'SG' },
        ].map(({ label, key }) => (
          <View key={key} style={s.catItem}>
            <View style={s.catBox}>
              <Text style={{ fontSize: 9 }}>{cat === key ? '✓' : ''}</Text>
            </View>
            <Text style={s.catLbl}>{label}</Text>
          </View>
        ))}
      </View>

      {/* 5 — Parents */}
      <View style={s.row}>
        <Text style={[s.bold, { width: 16 }]}>5.</Text>
        <Text style={s.bold}>Details of Parents</Text>
      </View>
      <View style={s.ptWrap}>
        {/* Header */}
        <View style={s.ptRow}>
          <View style={s.ptC0}>
            <Text style={s.ptH}>Details of Mother/Father</Text>
          </View>
          <View style={s.ptC1}>
            <Text style={s.ptH}>Mother</Text>
          </View>
          <View style={s.ptC2}>
            <Text style={s.ptH}>Father</Text>
          </View>
        </View>
        {[
          { label: 'Name (in capital letters)', mKey: 'motherName', fKey: 'fatherName' },
          {
            label: 'Nationality & Occupation',
            mKey: 'motherNationality',
            fKey: 'fatherNationality',
          },
          {
            label: 'Name of Office & Full Address with Tele. No.',
            mKey: 'motherOffice',
            fKey: 'fatherOffice',
          },
          {
            label: 'Full Residential Address with Tele. No.',
            mKey: 'motherAddress',
            fKey: 'fatherAddress',
          },
          { label: 'Permanent Address', mKey: 'motherPermAddr', fKey: 'fatherPermAddr' },
          { label: 'Annual Income (Rs.)', mKey: 'motherIncome', fKey: 'fatherIncome' },
        ].map(({ label, mKey, fKey }) => (
          <View key={label} style={[s.ptRow, s.ptTopBdr]}>
            <View style={s.ptC0}>
              <Text style={s.ptV}>{label}</Text>
            </View>
            <View style={s.ptC1}>
              <Text style={s.ptV}>{d?.[mKey] || ''}</Text>
            </View>
            <View style={s.ptC2}>
              <Text style={s.ptV}>{d?.[fKey] || ''}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* 6 – 10, 12 – 13  */}
      {[
        {
          num: '6.',
          label: 'Name & Address of Local guardian (if any)',
          key: 'localGuardian',
        },
        {
          num: '7.',
          label: 'Name & Address of the School last attended with class',
          key: 'lastSchool',
        },
        {
          num: '8.',
          label: 'Whether last School was CBSE affiliated',
          key: 'cbseAffiliated',
        },
        {
          num: '9.',
          label: 'If not affiliated with CBSE, specify name of the Board',
          key: 'otherBoard',
        },
        {
          num: '10.',
          label: 'Result of last examination          Percentage',
          key: 'lastResult',
        },
        {
          num: '12.',
          label: 'Whether the transfer certificate is attached  Yes/No',
          key: 'tcAttached',
        },
        {
          num: '13.',
          label: 'Mother Tongue                    Home Town',
          key: 'motherTongue',
        },
      ].map(({ num, label, key }) => (
        <View key={key} style={s.row}>
          <Text style={[s.bold, { width: 18 }]}>{num}</Text>
          <Text style={s.bold}>{label}</Text>
          <Text style={[s.uline, { flex: 1, marginLeft: 4 }]}>{d?.[key] || ''}</Text>
        </View>
      ))}

      {/* 11 — Subjects */}
      <View style={s.row}>
        <Text style={[s.bold, { width: 18 }]}>11.</Text>
        <Text style={s.bold}>Subject proposed to offer</Text>
      </View>
      <View style={s.subjWrap}>
        {Array.from({ length: 7 }).map((_, i) => (
          <View key={i} style={s.subjRow}>
            <Text style={s.subjNum}>{i + 1}.</Text>
            <Text style={s.subjLine}>{(d?.subjects || [])[i] || ''}</Text>
          </View>
        ))}
      </View>

      <HR />

      {/* Declaration */}
      <Text style={s.declTitle}>DECLARATION BY THE PARENTS</Text>
      <Text style={s.declText}>
        I hereby declare that the above information furnished by me is correct to the best
        of my knowledge & belief.{'\n'}I shall abide by the rules of the Vidyalaya.
      </Text>

      {/* Signatures */}
      <View style={s.sigRow}>
        <View style={s.sigBlock}>
          <View style={[s.sigLine, { width: 90 }]} />
          <Text style={s.sigLbl}>Date</Text>
        </View>
        <View style={s.sigBlock}>
          <View style={[s.sigLine, { width: 160 }]} />
          <Text style={s.sigLbl}>Signature of Parents</Text>
        </View>
      </View>
    </Page>
  )
}

// ─── PAGE 2 — Office Use Only ─────────────────────────────────────────────────
const AdmPage2 = ({ d }) => (
  <Page size="A4" style={s.page}>
    <Text style={s.p2Title}>FOR THE OFFICE USE ONLY</Text>

    <Text style={s.p2Para}>
      1. Certified that I have checked the application form and the relevant papers are
      found in order.
    </Text>
    <View style={{ alignItems: 'flex-end', marginBottom: 10 }}>
      <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold' }}>
        Admission incharge
      </Text>
    </View>

    <Text style={s.p2Para}>
      2. Please admit to Class ________________ Section ______________ after checking the
      relevant papers and realise the dues.
    </Text>

    {/* Date row */}
    <View style={s.p2Row}>
      <Text style={[s.p2Lbl, s.bold, { width: 36 }]}>Date</Text>
      <Text style={[s.p2Val, { width: 100 }]}>{d?.admissionDate || ''}</Text>
    </View>

    {/* Admitted to class row */}
    <View style={[s.p2Row, { flexWrap: 'wrap' }]}>
      {[
        { label: 'Admitted to Class', key: 'classAdmission', w: 90 },
        { label: 'Section', key: 'section', w: 50 },
        { label: 'Fee Receipt No.', key: 'feeReceiptNo', w: 80 },
        { label: 'Dated', key: 'feeReceiptDate', w: 80 },
      ].map(({ label, key, w }) => (
        <View
          key={key}
          style={{ flexDirection: 'row', alignItems: 'flex-end', marginRight: 8 }}
        >
          <Text style={[s.p2Lbl, s.bold]}>{label}</Text>
          <Text style={[s.p2Val, { width: w }]}>{d?.[key] || ''}</Text>
        </View>
      ))}
    </View>

    {/* Fee details */}
    <Text style={[s.p2Lbl, s.bold, { marginTop: 6, marginBottom: 3 }]}>
      Details of amount received
    </Text>
    {[
      { label: 'Admission Fee :', key: 'admissionFee' },
      { label: 'Tuition Fee :', key: 'tuitionFee' },
      { label: 'Any other Fee :', key: 'otherFee' },
      { label: 'Computer Fee :', key: 'computerFee' },
      { label: 'TOTAL', key: 'totalFee' },
    ].map(({ label, key }) => (
      <View key={key} style={s.p2Row}>
        <Text style={[s.p2Lbl, { width: 110 }]}>{label}</Text>
        <Text style={[s.p2Val, { width: 120 }]}>{d?.[key] || ''}</Text>
      </View>
    ))}

    <View style={[s.p2Row, { marginTop: 4 }]}>
      <Text style={s.p2Lbl}>Name has been entered in the Class Attendance Register</Text>
      <Text style={[s.p2Val, { width: 50 }]}>Yes / No</Text>
    </View>

    <Text style={[s.p2Para, { marginTop: 6 }]}>
      Certified that all the entries have been made in the Scholar's Register and the dues
      have been received.
    </Text>

    <View style={s.p2Row}>
      <Text style={s.p2Lbl}>
        Registration No. of the student in Admission Withdrawal Register is
      </Text>
      <Text style={[s.p2Val, { width: 70 }]}>{d?.awrNo || ''}</Text>
      <Text style={[s.p2Lbl, { marginLeft: 6 }]}>Vol.</Text>
      <Text style={[s.p2Val, { width: 50 }]}>{d?.awrVol || ''}</Text>
    </View>

    <View style={s.p2Row}>
      <Text style={[s.p2Lbl, s.bold, { width: 36 }]}>Date</Text>
      <Text style={[s.p2Val, { width: 100 }]}>{d?.admissionDate || ''}</Text>
      <Text style={[s.p2Lbl, s.bold, { marginLeft: 10 }]}>Office Sup.</Text>
      <Text style={[s.p2Val, { flex: 1 }]}></Text>
    </View>

    <Text style={[s.p2Para, { marginTop: 8 }]}>
      Admission considered by the school is in accordance with the provision to the Board
      & approved.
    </Text>

    <View style={s.sigRow}>
      <View style={s.sigBlock}>
        <View style={[s.sigLine, { width: 90 }]} />
        <Text style={s.sigLbl}>Date</Text>
      </View>
      <View style={s.sigBlock}>
        <View style={[s.sigLine, { width: 180 }]} />
        <Text style={s.sigLbl}>Sign. Principal / Official Stamp</Text>
      </View>
    </View>
  </Page>
)

// ─── PAGE 3 — Transport / Non-Transport Card ──────────────────────────────────
const AdmPage3 = ({ d }) => {
  const isTransport = (d?.transportStatus || '').toLowerCase() !== 'non-transport'
  return (
    <Page size="A4" style={s.page}>
      <View style={{ alignItems: 'center', marginBottom: 8 }}>
        <Image src={SCHOOL_LOGO} style={{ width: 44, height: 44, marginBottom: 4 }} />
        <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold' }}>
          SARVODAYA VIDYALAYA
        </Text>
      </View>

      <View style={s.cardOuter}>
        <Text style={s.cardTitle}>
          {isTransport ? "DRIVER'S DETAILS" : `NON-TRANSPORT CARD (${d?.session || ''})`}
        </Text>

        {[
          { label: 'NAME :-', val: d?.fullName },
          { label: 'CLASS :-', val: d?.classAdmission },
          { label: 'VILLAGE :-', val: d?.village },
          { label: 'MOBILE NO :-', val: d?.guardianContact },
          ...(isTransport
            ? [
                { label: 'ROUTE NAME :-', val: d?.route },
                { label: "DRIVER'S NAME :-", val: d?.driverName },
                { label: "DRIVER'S MOBILE NO :-", val: d?.driverMobile },
              ]
            : []),
        ].map(({ label, val }) => (
          <View key={label} style={s.cardRow}>
            <Text style={s.cardLbl}>{label}</Text>
            <Text style={s.cardVal}>{val || ''}</Text>
          </View>
        ))}
      </View>
    </Page>
  )
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
/**
 * <AdmissionFormPDF student={student} />
 *
 * student = {
 *   srNo, classAdmission, session, fullName, gender, photo (base64/url),
 *   dob (ISO date string e.g. "2018-08-01"), dobWords,
 *   ageYear, ageMonth, ageDay (2-digit strings),
 *   bloodGroup,
 *   category: "GEN" | "SC" | "ST" | "OBC" | "EWS" | "DISABLED" | "SG",
 *
 *   motherName, motherNationality, motherOffice, motherAddress, motherPermAddr, motherIncome,
 *   fatherName, fatherNationality, fatherOffice, fatherAddress, fatherPermAddr, fatherIncome,
 *
 *   localGuardian, lastSchool, cbseAffiliated, otherBoard,
 *   lastResult, subjects (string[], up to 7), tcAttached, motherTongue,
 *
 *   admissionDate, section, feeReceiptNo, feeReceiptDate,
 *   admissionFee, tuitionFee, otherFee, computerFee, totalFee,
 *   awrNo, awrVol,
 *
 *   transportStatus: "transport" | "non-transport",
 *   village, guardianContact, route, driverName, driverMobile
 * }
 */
const AdmissionFormPDF = ({ student = {} }) => (
  <Document>
    <AdmPage1 d={student} />
    <AdmPage2 d={student} />
    <AdmPage3 d={student} />
  </Document>
)

export default AdmissionFormPDF

// ─── USAGE EXAMPLE ────────────────────────────────────────────────────────────
// import { pdf } from '@react-pdf/renderer'
// import AdmissionFormPDF from './AdmissionFormPDF'
//
// const blob = await pdf(<AdmissionFormPDF student={{
//   srNo: 'JR-762', classAdmission: 'NC-A', session: '2024-25',
//   fullName: 'KUNAL SINGH RAJPUT', gender: 'Male',
//   dob: '2026-03-03', dobWords: 'Third March Two Thousand Twenty Six',
//   ageYear: '00', ageMonth: '00', ageDay: '00',
//   bloodGroup: 'B+', category: 'GEN',
//   motherName: 'CHANDNI', motherNationality: 'INDIAN / NA',
//   motherAddress: 'VILL-SHAHPUR SUKKHA', motherPermAddr: 'VILL-SHAHPUR SUKKHA', motherIncome: '0',
//   fatherName: 'GIRVAR', fatherNationality: 'INDIAN / NA',
//   fatherAddress: 'VILL-SHAHPUR SUKKHA, 9548641846', fatherPermAddr: 'VILL-SHAHPUR SUKKHA', fatherIncome: '0',
//   subjects: ['ENGLISH', 'HINDI', 'MATHS', 'DRAWING'],
//   cbseAffiliated: 'No', tcAttached: 'No',
//   transportStatus: 'transport', guardianContact: '1545465654',
//   route: 'route 3', village: 'SHAHPUR SUKKHA',
// }} />).toBlob()
