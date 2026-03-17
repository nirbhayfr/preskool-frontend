// components/pdf/SalarySlipPDF.jsx

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
  schoolName: {
    fontSize: 15,
    fontFamily: 'Helvetica-Bold',
  },
  schoolLine: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
  },
  receiptTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    marginTop: 3,
  },
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
  infoText: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
  },
  copyLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
  },
  sectionHeading: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    backgroundColor: '#111111',
    color: 'white',
    padding: '3 6',
    marginTop: 6,
    marginBottom: 2,
  },
  table: {
    border: '0.7pt solid black',
    marginBottom: 4,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#111111',
  },
  tableDataRow: {
    flexDirection: 'row',
  },
  thText: {
    color: 'white',
    fontFamily: 'Helvetica-Bold',
    fontSize: 7.5,
    textAlign: 'center',
  },
  tdText: {
    fontFamily: 'Helvetica',
    fontSize: 8.5,
    textAlign: 'center',
  },
  tdTextBold: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8.5,
    textAlign: 'center',
  },
  cell25: {
    width: '25%',
    borderRight: '0.7pt solid black',
    borderBottom: '0.7pt solid black',
    padding: 3,
  },
  cell25Last: {
    width: '25%',
    borderBottom: '0.7pt solid black',
    padding: 3,
  },
  cell33: {
    width: '33.33%',
    borderRight: '0.7pt solid black',
    borderBottom: '0.7pt solid black',
    padding: 3,
  },
  cell33Last: {
    width: '33.33%',
    borderBottom: '0.7pt solid black',
    padding: 3,
  },
  cell50: {
    width: '50%',
    borderRight: '0.7pt solid black',
    borderBottom: '0.7pt solid black',
    padding: 3,
  },
  cell50Last: {
    width: '50%',
    borderBottom: '0.7pt solid black',
    padding: 3,
  },
  summaryBox: {
    border: '0.7pt solid black',
    marginTop: 4,
    marginBottom: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    borderBottom: '0.7pt solid black',
  },
  summaryRowLast: {
    flexDirection: 'row',
  },
  summaryCell: {
    flex: 1,
    borderRight: '0.7pt solid black',
    padding: 4,
    fontFamily: 'Helvetica-Bold',
    fontSize: 8.5,
    textAlign: 'center',
  },
  summaryCellLast: {
    flex: 1,
    padding: 4,
    fontFamily: 'Helvetica-Bold',
    fontSize: 8.5,
    textAlign: 'center',
  },
  netSalaryBox: {
    border: '1pt solid black',
    padding: 5,
    marginTop: 4,
    marginBottom: 5,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  netSalaryText: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 12,
  },
  netSalaryWords: {
    fontFamily: 'Helvetica',
    fontSize: 8.5,
    marginTop: 2,
  },
  signatures: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 22,
  },
  signText: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
  },
  paidByRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 4,
  },
  paidByText: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
  },
})

// ─── HELPERS ────────────────────────────────────────────────────────────────
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

function formatMonth(salaryMonth) {
  if (!salaryMonth) return ''
  const [year, month] = salaryMonth.split('-')
  const date = new Date(Number(year), Number(month) - 1, 1)
  return date.toLocaleString('en-IN', { month: 'long', year: 'numeric' })
}

// ─── SLIP BLOCK ─────────────────────────────────────────────────────────────
const SalarySlipBlock = ({ teacher, salary, copyLabel }) => {
  const basicSalary = Number(salary?.BasicSalary ?? 0)
  const allowances = Number(salary?.Allowances ?? 0)
  const deductions = Number(salary?.Deductions ?? 0)
  const netSalary = Number(salary?.NetSalary ?? basicSalary + allowances - deductions)
  const paymentDate = salary?.PaymentDate
    ? new Date(salary.PaymentDate).toLocaleDateString('en-GB')
    : 'Not Paid'
  const today = new Date().toLocaleDateString('en-GB')

  return (
    <View style={styles.receiptBlock}>
      {/* Header */}
      <View style={styles.header}>
        <Image src={SCHOOL_LOGO} style={styles.logo} />
        <View style={styles.headerText}>
          <Text style={styles.schoolName}>Sarvodaya Vidyalaya</Text>
          <Text style={styles.schoolLine}>Shahpur Sukkha, Kiratpur</Text>
          <Text style={styles.receiptTitle}>SALARY SLIP</Text>
        </View>
      </View>

      <View style={styles.dividerLine} />

      {/* Meta */}
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>Salary ID : #{salary?.SalaryID || ''}</Text>
        <Text style={styles.infoText}>Generated On : {today}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>
          Salary Month : {formatMonth(salary?.SalaryMonth)}
        </Text>
        <Text style={styles.copyLabel}>{copyLabel}</Text>
      </View>

      <View style={styles.dividerLine} />

      {/* Teacher Details */}
      <Text style={styles.sectionHeading}>EMPLOYEE DETAILS</Text>
      <View style={styles.table}>
        <View style={styles.tableDataRow}>
          <View style={styles.cell50}>
            <Text style={styles.tdText}>
              Employee ID : TCH-{teacher?.TeacherID || ''}
            </Text>
          </View>
          <View style={styles.cell50Last}>
            <Text style={styles.tdText}>Name : {teacher?.FullName || ''}</Text>
          </View>
        </View>
        <View style={styles.tableDataRow}>
          <View style={styles.cell50}>
            <Text style={styles.tdText}>Subject : {teacher?.Subject || ''}</Text>
          </View>
          <View style={styles.cell50Last}>
            <Text style={styles.tdText}>
              Class : {teacher?.Class || ''}
              {teacher?.Section ? ` - ${teacher.Section}` : ''}
            </Text>
          </View>
        </View>
        <View style={styles.tableDataRow}>
          <View style={styles.cell50}>
            <Text style={styles.tdText}>
              Qualification : {teacher?.Qualification || ''}
            </Text>
          </View>
          <View style={styles.cell50Last}>
            <Text style={styles.tdText}>
              Date of Joining :{' '}
              {teacher?.DateOfJoining
                ? new Date(teacher.DateOfJoining).toLocaleDateString('en-GB')
                : ''}
            </Text>
          </View>
        </View>
      </View>

      {/* Salary Breakdown */}
      <Text style={styles.sectionHeading}>SALARY BREAKDOWN</Text>
      <View style={styles.table}>
        <View style={styles.tableHeaderRow}>
          <View style={styles.cell33}>
            <Text style={styles.thText}>EARNINGS</Text>
          </View>
          <View style={styles.cell33}>
            <Text style={styles.thText}>AMOUNT (₹)</Text>
          </View>
          <View style={styles.cell33Last}>
            <Text style={styles.thText}></Text>
          </View>
        </View>

        <View style={styles.tableDataRow}>
          <View style={styles.cell33}>
            <Text style={styles.tdText}>Basic Salary</Text>
          </View>
          <View style={styles.cell33}>
            <Text style={styles.tdText}>
              {basicSalary.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </Text>
          </View>
          <View style={styles.cell33Last}>
            <Text style={styles.tdText}></Text>
          </View>
        </View>

        {allowances > 0 && (
          <View style={styles.tableDataRow}>
            <View style={styles.cell33}>
              <Text style={styles.tdText}>Allowances</Text>
            </View>
            <View style={styles.cell33}>
              <Text style={styles.tdText}>
                {allowances.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </Text>
            </View>
            <View style={styles.cell33Last}>
              <Text style={styles.tdText}></Text>
            </View>
          </View>
        )}

        {deductions > 0 && (
          <View style={styles.tableDataRow}>
            <View style={styles.cell33}>
              <Text style={styles.tdText}>Deductions</Text>
            </View>
            <View style={styles.cell33}>
              <Text style={styles.tdText}>
                - {deductions.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </Text>
            </View>
            <View style={styles.cell33Last}>
              <Text style={styles.tdText}></Text>
            </View>
          </View>
        )}
      </View>

      {/* Summary */}
      <View style={styles.summaryBox}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryCell}>
            Basic Salary : ₹
            {basicSalary.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </Text>
          <Text style={styles.summaryCell}>
            Allowances : ₹
            {allowances.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </Text>
          <Text style={styles.summaryCellLast}>
            Deductions : ₹
            {deductions.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </Text>
        </View>
        <View style={styles.summaryRowLast}>
          <Text style={styles.summaryCell}>
            Payment Status : {salary?.IsPaid ? 'PAID' : 'PENDING'}
          </Text>
          <Text style={styles.summaryCellLast}>Payment Date : {paymentDate}</Text>
        </View>
      </View>

      {/* Net Salary */}
      <View style={styles.netSalaryBox}>
        <Text style={styles.netSalaryText}>
          Net Payable Salary : ₹
          {netSalary.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </Text>
        <Text style={styles.netSalaryWords}>{amountInWords(netSalary)}</Text>
      </View>

      {/* Signatures */}
      <View style={styles.signatures}>
        <Text style={styles.signText}>Accountant Sign.</Text>
        <Text style={styles.signText}>Employee Sign.</Text>
        <Text style={styles.signText}>Principal Sign.</Text>
      </View>
    </View>
  )
}

const SalarySlipPDF = ({ teacher = {}, salary = {} }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <SalarySlipBlock teacher={teacher} salary={salary} copyLabel="Employee Copy" />
      <View style={styles.dashedLine} />
      <SalarySlipBlock teacher={teacher} salary={salary} copyLabel="School Copy" />
    </Page>
  </Document>
)

export default SalarySlipPDF
