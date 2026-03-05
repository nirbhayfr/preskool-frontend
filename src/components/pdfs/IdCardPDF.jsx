import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'

const formatDOB = (dob) => {
  if (!dob) return ''
  const date = new Date(dob)

  const day = date.getDate().toString().padStart(2, '0')
  const month = date.toLocaleString('en-US', { month: 'short' })
  const year = date.getFullYear()

  return `${day} ${month} ${year}`
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  card: {
    width: 340,
    height: 200,
    borderRadius: 10,
    border: '1px solid #dcdcdc',
    backgroundColor: '#fff',
    overflow: 'hidden',
    flexDirection: 'column',
  },

  header: {
    backgroundColor: '#2563eb',
    paddingVertical: 6,
    textAlign: 'center',
    color: '#fff',
  },

  schoolName: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  cardTitle: {
    fontSize: 9,
    marginTop: 2,
  },

  body: {
    flexDirection: 'row',
    padding: 12,
    gap: 12,
  },

  photo: {
    width: 70,
    height: 80,
    borderRadius: 4,
    border: '1px solid #ccc',
  },

  info: {
    flex: 1,
    fontSize: 10,
    gap: 5,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  label: {
    width: 85,
    fontWeight: 'bold',
  },

  value: {
    flex: 1,
  },

  footer: {
    marginTop: 'auto',
    borderTop: '1px solid #eee',
    paddingVertical: 4,
    textAlign: 'center',
    fontSize: 8,
    color: '#555',
  },
})

const IdCardPDF = ({ student, photo }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.schoolName}>ABC PUBLIC SCHOOL</Text>
          <Text style={styles.cardTitle}>STUDENT IDENTITY CARD</Text>
        </View>

        {/* Body */}
        <View style={styles.body}>
          <Image style={styles.photo} src={photo} />

          <View style={styles.info}>
            <View style={styles.row}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>{student.FullName}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Class</Text>
              <Text style={styles.value}>{student.ClassID}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Section</Text>
              <Text style={styles.value}>{student.SectionID}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Roll No</Text>
              <Text style={styles.value}>{student.RollNo}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>DOB</Text>
              <Text style={styles.value}>{formatDOB(student.DOB)}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>ABC Public School • New Delhi</Text>
        </View>
      </View>
    </Page>
  </Document>
)

export default IdCardPDF
