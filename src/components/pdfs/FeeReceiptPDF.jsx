import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
  },

  border: {
    border: '1px solid black',
    padding: 8,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  logo: {
    width: 55,
    height: 55,
  },

  headerText: {
    flex: 1,
    textAlign: 'center',
  },

  schoolName: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  schoolLine: {
    fontSize: 12,
  },

  receiptTitle: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: 'bold',
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },

  studentRow: {
    marginTop: 3,
  },

  table: {
    marginTop: 8,
    border: '1px solid black',
  },

  tableRow: {
    flexDirection: 'row',
  },

  cellHeader: {
    flex: 1,
    borderRight: '1px solid black',
    borderBottom: '1px solid black',
    padding: 4,
    fontWeight: 'bold',
  },

  cell: {
    flex: 1,
    borderRight: '1px solid black',
    borderBottom: '1px solid black',
    padding: 4,
  },

  summaryRow: {
    flexDirection: 'row',
    borderTop: '1px solid black',
  },

  summaryCell: {
    flex: 1,
    borderRight: '1px solid black',
    padding: 5,
  },

  signatures: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
  },
})

const FeeReceiptPDF = ({ student = {}, submissions = [], receiptNo }) => {
  if (!submissions || submissions.length === 0) {
    return null
  }

  const totalPaid = submissions.reduce((sum, s) => sum + Number(s?.PaidAmount || 0), 0)

  const totalDue = submissions.reduce((sum, s) => sum + Number(s?.OriginalAmount || 0), 0)

  const balance = totalDue - totalPaid

  const paymentMode = submissions[0]?.PaymentMode?.toUpperCase() || 'N/A'

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.border}>
          {/* HEADER */}

          <View style={styles.header}>
            {/* <Image src="/logo.png" style={styles.logo} /> */}

            <View style={styles.headerText}>
              <Text style={styles.schoolName}>Sarvodaya Vidyalaya</Text>
              <Text style={styles.schoolLine}>Shahpur Sukkha</Text>
              <Text style={styles.schoolLine}>Kiratpur</Text>
              <Text style={styles.receiptTitle}>FEE RECEIPT (2025-26)</Text>
            </View>
          </View>

          {/* RECEIPT INFO */}

          <View style={styles.infoRow}>
            <Text>Receipt No.: {receiptNo}</Text>
            <Text>Date: {new Date().toLocaleDateString()}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text>SR No.: {student?.AdmissionNo || ''}</Text>
            <Text>
              Class: {student?.ClassID || ''}-{student?.SectionID || ''}
            </Text>
          </View>

          <View style={styles.studentRow}>
            <Text>Student Name : {student?.FullName || ''}</Text>
          </View>

          <View style={styles.studentRow}>
            <Text>Father's Name : {student?.GuardianName || ''}</Text>
          </View>

          {/* TABLE */}

          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.cellHeader}>Duration</Text>
              <Text style={styles.cellHeader}>Particulars</Text>
              <Text style={styles.cellHeader}>Original</Text>
              <Text style={styles.cellHeader}>Discount</Text>
              <Text style={styles.cellHeader}>Paid</Text>
              <Text style={styles.cellHeader}>Balance</Text>
            </View>

            {submissions.map((s, index) => {
              const feeType = s?.FeeType || ''
              const original = Number(s?.OriginalAmount || 0)
              const paid = Number(s?.PaidAmount || 0)
              const discount = Number(s?.DiscountAmount || 0)

              const balanceRow = original - paid

              const duration = feeType ? feeType.split('_')[0] : ''

              const particulars = feeType.includes('TUITION')
                ? 'Tuition Fee'
                : feeType.includes('TRANSPORT')
                  ? 'Transport Fee'
                  : 'Fee'

              return (
                <View key={s?.SubmissionID || index} style={styles.tableRow}>
                  <Text style={styles.cell}>{duration}</Text>

                  <Text style={styles.cell}>{particulars}</Text>

                  <Text style={styles.cell}>{original}</Text>

                  <Text style={styles.cell}>{discount}</Text>

                  <Text style={styles.cell}>{paid}</Text>

                  <Text style={styles.cell}>{balanceRow}</Text>
                </View>
              )
            })}
          </View>

          {/* SUMMARY */}

          <View style={styles.summaryRow}>
            <Text style={styles.summaryCell}>Total Due Amount : {totalDue}</Text>

            <Text style={styles.summaryCell}>Total Paid Amount : {totalPaid}</Text>

            <Text style={styles.summaryCell}>Balance : {balance}</Text>
          </View>

          {/* PAYMENT MODE */}

          <View style={{ marginTop: 6 }}>
            <Text>Paid By : {paymentMode}</Text>
          </View>

          {/* SIGNATURES */}

          <View style={styles.signatures}>
            <Text>Cashier Sign.</Text>
            <Text>Depositor Sign.</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default FeeReceiptPDF
