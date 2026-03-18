// components/pdf/AdvanceSlipPDF.jsx

import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'
import { SCHOOL_LOGO } from './FeeReceiptPDF'

const styles = StyleSheet.create({
  page: {
    padding: 14,
    fontSize: 9,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  receiptBlock: {
    border: '1.2pt solid black',
    padding: 8,
    marginBottom: 6,
  },
  dashedLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#555555',
    borderBottomStyle: 'dashed',
    marginVertical: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  logo: {
    width: 52,
    height: 52,
    marginRight: 10,
    borderRadius: 26,
  },
  headerText: {
    flex: 1,
    alignItems: 'center',
  },
  schoolName: { fontSize: 15, fontFamily: 'Helvetica-Bold' },
  schoolLine: { fontSize: 11, fontFamily: 'Helvetica-Bold' },
  receiptTitle: { fontSize: 12, fontFamily: 'Helvetica-Bold', marginTop: 3 },
  dividerLine: {
    borderBottomWidth: 0.5,
    borderBottomColor: 'black',
    marginBottom: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  infoText: { fontFamily: 'Helvetica-Bold', fontSize: 9 },
  copyLabel: { fontFamily: 'Helvetica-Bold', fontSize: 9 },
  table: { border: '0.7pt solid black', marginBottom: 4 },
  tableHeaderRow: { flexDirection: 'row', backgroundColor: '#111111' },
  tableDataRow: { flexDirection: 'row' },
  thText: {
    color: 'white',
    fontFamily: 'Helvetica-Bold',
    fontSize: 7.5,
    textAlign: 'center',
  },
  tdText: { fontFamily: 'Helvetica', fontSize: 8.5, textAlign: 'center' },
  cell25: {
    width: '25%',
    borderRight: '0.7pt solid black',
    borderBottom: '0.7pt solid black',
    padding: 3,
  },
  cell25Last: { width: '25%', borderBottom: '0.7pt solid black', padding: 3 },
  cell50: {
    width: '50%',
    borderRight: '0.7pt solid black',
    borderBottom: '0.7pt solid black',
    padding: 3,
  },
  cell50Last: { width: '50%', borderBottom: '0.7pt solid black', padding: 3 },
  cell33: {
    width: '33.33%',
    borderRight: '0.7pt solid black',
    borderBottom: '0.7pt solid black',
    padding: 3,
  },
  cell33Last: { width: '33.33%', borderBottom: '0.7pt solid black', padding: 3 },
  amountBox: {
    border: '1pt solid black',
    padding: 5,
    marginTop: 4,
    marginBottom: 5,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  amountText: { fontFamily: 'Helvetica-Bold', fontSize: 12 },
  amountWords: { fontFamily: 'Helvetica', fontSize: 8.5, marginTop: 2 },
  statusBadge: {
    border: '0.7pt solid black',
    padding: '3 8',
    marginTop: 4,
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  statusText: { fontFamily: 'Helvetica-Bold', fontSize: 9 },
  signatures: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 22,
  },
  signText: { fontFamily: 'Helvetica-Bold', fontSize: 9 },
  remarksRow: { marginTop: 4, marginBottom: 4 },
  remarksText: { fontFamily: 'Helvetica', fontSize: 9 },
})

const ones = [
  '',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
  'Thirteen',
  'Fourteen',
  'Fifteen',
  'Sixteen',
  'Seventeen',
  'Eighteen',
  'Nineteen',
]
const tens = [
  '',
  '',
  'Twenty',
  'Thirty',
  'Forty',
  'Fifty',
  'Sixty',
  'Seventy',
  'Eighty',
  'Ninety',
]

function numberToWords(n) {
  if (n === 0) return 'Zero'
  if (n < 20) return ones[n]
  if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? '-' + ones[n % 10] : '')
  if (n < 1000)
    return (
      ones[Math.floor(n / 100)] +
      ' Hundred' +
      (n % 100 ? ' ' + numberToWords(n % 100) : '')
    )
  if (n < 100000)
    return (
      numberToWords(Math.floor(n / 1000)) +
      ' Thousand' +
      (n % 1000 ? ' ' + numberToWords(n % 1000) : '')
    )
  if (n < 10000000)
    return (
      numberToWords(Math.floor(n / 100000)) +
      ' Lakh' +
      (n % 100000 ? ' ' + numberToWords(n % 100000) : '')
    )
  return (
    numberToWords(Math.floor(n / 10000000)) +
    ' Crore' +
    (n % 10000000 ? ' ' + numberToWords(n % 10000000) : '')
  )
}

function amountInWords(amount) {
  const n = Math.round(Number(amount) || 0)
  return `Rupees ${numberToWords(n)} Only`
}

const AdvanceSlipBlock = ({ teacher, payment, copyLabel }) => {
  const amount = Number(payment?.TotalAmount ?? 0)
  const paymentDate = payment?.PaymentDate
    ? new Date(payment.PaymentDate).toLocaleDateString('en-GB')
    : ''
  const today = new Date().toLocaleDateString('en-GB')

  // const statusColors = {
  //   Pending: '#f59e0b',
  //   Settled: '#3b82f6',
  //   Paid: '#10b981',
  //   Cancelled: '#ef4444',
  // }

  return (
    <View style={styles.receiptBlock}>
      {/* Header */}
      <View style={styles.header}>
        <Image src={SCHOOL_LOGO} style={styles.logo} />
        <View style={styles.headerText}>
          <Text style={styles.schoolName}>Sarvodaya Vidyalaya</Text>
          <Text style={styles.schoolLine}>Shahpur Sukkha, Kiratpur</Text>
          <Text style={styles.receiptTitle}>ADVANCE PAYMENT SLIP</Text>
        </View>
      </View>

      <View style={styles.dividerLine} />

      {/* Meta */}
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>Payment ID : #{payment?.PaymentID || ''}</Text>
        <Text style={styles.infoText}>Generated On : {today}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>Reference No : {payment?.ReferenceNo || '—'}</Text>
        <Text style={styles.copyLabel}>{copyLabel}</Text>
      </View>

      <View style={styles.dividerLine} />

      {/* Employee Details */}
      <View style={styles.table}>
        <View style={styles.tableHeaderRow}>
          <View style={styles.cell50}>
            <Text style={styles.thText}>EMPLOYEE DETAILS</Text>
          </View>
          <View style={styles.cell50Last}>
            <Text style={styles.thText}>PAYMENT DETAILS</Text>
          </View>
        </View>
        <View style={styles.tableDataRow}>
          <View style={styles.cell50}>
            <Text style={styles.tdText}>ID : TCH-{teacher?.TeacherID || ''}</Text>
          </View>
          <View style={styles.cell50Last}>
            <Text style={styles.tdText}>
              Category : {payment?.PaymentCategory || 'Advance'}
            </Text>
          </View>
        </View>
        <View style={styles.tableDataRow}>
          <View style={styles.cell50}>
            <Text style={styles.tdText}>Name : {teacher?.FullName || ''}</Text>
          </View>
          <View style={styles.cell50Last}>
            <Text style={styles.tdText}>Method : {payment?.PaymentMethod || ''}</Text>
          </View>
        </View>
        <View style={styles.tableDataRow}>
          <View style={styles.cell50}>
            <Text style={styles.tdText}>Payment Date : {paymentDate}</Text>
          </View>
          <View style={styles.cell50Last}>
            <Text style={styles.tdText}>Status : {payment?.PaymentStatus || ''}</Text>
          </View>
        </View>
        {/* <View style={styles.tableDataRow}>
          <View style={styles.cell50}>
            <Text style={styles.tdText}>
              Class : {teacher?.Class || ''}
              {teacher?.Section ? ` - ${teacher.Section}` : ''}
            </Text>
          </View>
          <View style={styles.cell50}>
            <Text style={styles.tdText}>Subject : {teacher?.Subject || ''}</Text>
          </View>
        </View> */}
      </View>

      {/* Amount Box */}
      <View style={styles.amountBox}>
        <Text style={styles.amountText}>
          Advance Amount : ₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </Text>
        <Text style={styles.amountWords}>{amountInWords(amount)}</Text>
      </View>

      {/* Remarks */}
      {payment?.Remarks && (
        <View style={styles.remarksRow}>
          <Text style={styles.remarksText}>Remarks : {payment.Remarks}</Text>
        </View>
      )}

      {/* Signatures */}
      <View style={styles.signatures}>
        <Text style={styles.signText}>Accountant Sign.</Text>
        <Text style={styles.signText}>Employee Sign.</Text>
        <Text style={styles.signText}>Principal Sign.</Text>
      </View>
    </View>
  )
}

const AdvanceSlipPDF = ({ teacher = {}, payment = {} }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <AdvanceSlipBlock teacher={teacher} payment={payment} copyLabel="Employee Copy" />
      <View style={styles.dashedLine} />
      <AdvanceSlipBlock teacher={teacher} payment={payment} copyLabel="School Copy" />
    </Page>
  </Document>
)

export default AdvanceSlipPDF
