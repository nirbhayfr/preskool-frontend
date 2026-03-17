import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import { SCHOOL_LOGO } from './FeeReceiptPDF'

// const formatDate = (d) => {
//   if (!d) return ''
//   const dt = new Date(d)
//   return `${String(dt.getDate()).padStart(2, '0')}/${String(dt.getMonth() + 1).padStart(2, '0')}/${dt.getFullYear()}`
// }

const S = StyleSheet.create({
  page: { padding: 0, fontFamily: 'Helvetica', backgroundColor: '#fff' },

  outer: { margin: '14 18', border: '1.5pt solid black', padding: 0 },
  logo: { width: 60, height: 60, marginRight: 14 },

  // Header
  hdrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottom: '0.8pt solid black',
  },
  hdrText: { flex: 1, alignItems: 'center' },
  schoolName: { fontSize: 20, fontFamily: 'Helvetica-Bold', letterSpacing: 0.3 },
  tagLine: { fontSize: 9, textAlign: 'center', marginTop: 2, letterSpacing: 0.5 },
  addrBold: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginTop: 2,
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
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: 'white',
    letterSpacing: 1,
  },

  // Body
  body: { paddingHorizontal: 16, paddingBottom: 14 },

  // Cert number row
  certRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 10 },
  certLabel: { fontSize: 9.5, fontFamily: 'Helvetica-Bold', marginRight: 4 },
  certVal: { fontSize: 9.5, marginRight: 4 },

  // Field rows
  fRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 8 },
  fLabel: { fontSize: 9, fontFamily: 'Helvetica-Bold' },
  fColon: { fontSize: 9, fontFamily: 'Helvetica-Bold', marginRight: 3 },
  fVal: { fontSize: 9, flex: 1, borderBottom: '0.7pt solid black', paddingBottom: 1 },

  // Two-column row
  twoCol: { flexDirection: 'row', marginBottom: 8, gap: 10 },
  twoCell: { flex: 1, flexDirection: 'row', alignItems: 'flex-end' },
  twoLabel: { fontSize: 9, fontFamily: 'Helvetica-Bold' },
  twoColon: { fontSize: 9, fontFamily: 'Helvetica-Bold', marginRight: 3 },
  twoVal: { fontSize: 9, flex: 1, borderBottom: '0.7pt solid black', paddingBottom: 1 },

  // Certify para
  certifyWrap: { marginBottom: 10 },
  certifyTxt: { fontSize: 9, lineHeight: 1.6 },
  certifyBold: { fontSize: 9, fontFamily: 'Helvetica-Bold' },

  // Signatures
  sigRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
  },
  sigBlock: { alignItems: 'center' },
  sigLine: { borderBottom: '0.7pt solid black', marginBottom: 3 },
  sigLbl: { fontSize: 9, fontFamily: 'Helvetica-Bold' },
})

const Field = ({ label, value, labelWidth }) => (
  <View style={S.fRow}>
    <Text style={[S.fLabel, labelWidth ? { width: labelWidth } : {}]}>{label}:</Text>
    <Text style={{ width: 6 }} />
    <Text style={S.fVal}>{value || ''}</Text>
  </View>
)

/**
 * <MigrationCertificatePDF data={data} />
 *
 * data = {
 *   certNo:          'MC-001',
 *   pupilName:       'Kunal Rajput',
 *   fatherName:      'Rajesh Rajput',
 *   motherName:      '',
 *   dob:             '15/05/2010',
 *   nationality:     'Indian',
 *   category:        'General',
 *   admissionNo:     'ADM2026-001',
 *   admissionDate:   '15/06/2024',
 *   classAdmitted:   'IX',
 *   lastClassStudied:'X',
 *   lastClassWords:  'Tenth',
 *   board:           'CBSE',
 *   rollNo:          '23',
 *   examYear:        '2025-26',
 *   result:          'Passed',
 *   conduct:         'Good',
 *   reason:          "Parents' Desire",
 *   appDate:         '17/03/2026',
 *   issueDate:       '17/03/2026',
 *   otherRemark:     'No',
 * }
 */
const MigrationCertificatePDF = ({ data: d = {} }) => (
  <Document>
    <Page size="A4" style={S.page}>
      <View style={S.outer}>
        {/* Header */}
        <View style={S.hdrRow}>
          <Image src={SCHOOL_LOGO} style={S.logo} />
          <View style={S.hdrText}>
            <Text style={S.schoolName}>SARVODAYA VIDYALAYA</Text>
            <Text style={S.tagLine}>A Co-educational English Medium School</Text>
            <Text style={S.addrBold}>Kairi Phool Near Shahpur Sukkha</Text>
            <Text style={S.addrBold}>Najibabad Road, Kiratpur-246731 (Bijnor)</Text>
          </View>
        </View>

        {/* Reg / UDISE */}
        <View style={S.regRow}>
          <Text style={S.regTxt}>Registration No. BIJ0903727510</Text>
          <Text style={S.regTxt}>UDISE No. 09030704795</Text>
        </View>

        {/* Title */}
        <View style={S.titleBar}>
          <Text style={S.titleTxt}>MIGRATION CERTIFICATE</Text>
        </View>

        {/* Body */}
        <View style={S.body}>
          {/* Cert No */}
          <View style={S.certRow}>
            <Text style={S.certLabel}>Certificate No :</Text>
            <Text style={S.certVal}>{d?.certNo || ''}</Text>
          </View>

          {/* Fields */}
          <Field label="1. Name of Pupil" value={d?.pupilName} />
          <Field label="2. Father's / Guardian's Name" value={d?.fatherName} />
          <Field label="3. Mother's Name" value={d?.motherName} />

          {/* DOB + Nationality in two columns */}
          <View style={S.twoCol}>
            <View style={S.twoCell}>
              <Text style={S.twoLabel}>4. Date of Birth:</Text>
              <Text style={S.twoColon} />
              <Text style={S.twoVal}>{d?.dob || ''}</Text>
            </View>
            <View style={S.twoCell}>
              <Text style={S.twoLabel}>5. Nationality:</Text>
              <Text style={S.twoColon} />
              <Text style={S.twoVal}>{d?.nationality || ''}</Text>
            </View>
          </View>

          {/* Category + Adm No in two columns */}
          <View style={S.twoCol}>
            <View style={S.twoCell}>
              <Text style={S.twoLabel}>6. Category (SC/ST/OBC/Gen):</Text>
              <Text style={S.twoColon} />
              <Text style={S.twoVal}>{d?.category || ''}</Text>
            </View>
            <View style={S.twoCell}>
              <Text style={S.twoLabel}>7. Admission No:</Text>
              <Text style={S.twoColon} />
              <Text style={S.twoVal}>{d?.admissionNo || ''}</Text>
            </View>
          </View>

          {/* Admission date + class admitted */}
          <View style={S.twoCol}>
            <View style={S.twoCell}>
              <Text style={S.twoLabel}>8. Date of Admission:</Text>
              <Text style={S.twoColon} />
              <Text style={S.twoVal}>{d?.admissionDate || ''}</Text>
            </View>
            <View style={S.twoCell}>
              <Text style={S.twoLabel}>Class Admitted:</Text>
              <Text style={S.twoColon} />
              <Text style={S.twoVal}>{d?.classAdmitted || ''}</Text>
            </View>
          </View>

          {/* Last class */}
          <View style={S.fRow}>
            <Text style={S.fLabel}>9. Class Last Studied (in figure):</Text>
            <Text
              style={{
                fontSize: 9,
                width: 60,
                borderBottom: '0.7pt solid black',
                paddingBottom: 1,
                marginLeft: 4,
                marginRight: 10,
              }}
            >
              {d?.lastClassStudied || ''}
            </Text>
            <Text style={[S.fLabel, { marginRight: 4 }]}>(in words):</Text>
            <Text
              style={{
                fontSize: 9,
                flex: 1,
                borderBottom: '0.7pt solid black',
                paddingBottom: 1,
              }}
            >
              {d?.lastClassWords || ''}
            </Text>
          </View>

          {/* Board + Roll No + Exam Year */}
          <View style={S.twoCol}>
            <View style={S.twoCell}>
              <Text style={S.twoLabel}>10. Board of Examination:</Text>
              <Text style={S.twoColon} />
              <Text style={S.twoVal}>{d?.board || ''}</Text>
            </View>
            <View style={S.twoCell}>
              <Text style={S.twoLabel}>Roll No:</Text>
              <Text style={S.twoColon} />
              <Text style={S.twoVal}>{d?.rollNo || ''}</Text>
            </View>
          </View>

          <View style={S.twoCol}>
            <View style={S.twoCell}>
              <Text style={S.twoLabel}>11. Year of Examination:</Text>
              <Text style={S.twoColon} />
              <Text style={S.twoVal}>{d?.examYear || ''}</Text>
            </View>
            <View style={S.twoCell}>
              <Text style={S.twoLabel}>Result:</Text>
              <Text style={S.twoColon} />
              <Text style={S.twoVal}>{d?.result || ''}</Text>
            </View>
          </View>

          <Field label="12. General Conduct" value={d?.conduct} />
          <Field label="13. Reason for Leaving" value={d?.reason} />
          <Field label="14. Date of Application for Certificate" value={d?.appDate} />
          <Field label="15. Date of Issue of Certificate" value={d?.issueDate} />
          <Field label="16. Any Other Remark" value={d?.otherRemark} />

          {/* Certify paragraph */}
          <View style={[S.certifyWrap, { marginTop: 10 }]}>
            <Text style={S.certifyTxt}>
              {
                'Certified that the above information is correct to the best of my knowledge and belief and that '
              }
              <Text style={S.certifyBold}>{d?.pupilName || '_____________'}</Text>
              {
                ' has been a bonafide student of this institution. He/She is hereby granted this Migration Certificate to seek admission in another Board/University.'
              }
            </Text>
          </View>
        </View>

        {/* Signatures */}
        <View style={S.sigRow}>
          <View style={S.sigBlock}>
            <View style={[S.sigLine, { width: 120 }]} />
            <Text style={S.sigLbl}>Signature of Class Teacher</Text>
          </View>
          <View style={S.sigBlock}>
            <View style={[S.sigLine, { width: 80 }]} />
            <Text style={S.sigLbl}>Checked by</Text>
          </View>
          <View style={S.sigBlock}>
            <View style={[S.sigLine, { width: 120 }]} />
            <Text style={S.sigLbl}>Principal's Signature</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
)

export default MigrationCertificatePDF
