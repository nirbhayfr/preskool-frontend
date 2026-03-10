import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const day = d.getDate().toString().padStart(2, '0')
  const month = d.toLocaleString('en-US', { month: 'long' })
  const year = d.getFullYear()
  return `${day} ${month} ${year}`
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    lineHeight: 1.5,
  },

  header: {
    textAlign: 'center',
    marginBottom: 15,
  },

  schoolName: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  address: {
    fontSize: 10,
    marginTop: 5,
  },

  formTitle: {
    marginTop: 5,
    fontSize: 13,
    fontWeight: 'bold',
  },

  photoBox: {
    position: 'absolute',
    right: 30,
    top: 20,
    width: 90,
    height: 110,
    border: '1px solid black',
    justifyContent: 'center',
    alignItems: 'center',
  },

  photo: {
    width: '100%',
    height: '100%',
  },

  section: {
    marginTop: 10,
  },

  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 6,
  },

  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },

  label: {
    width: 170,
  },

  value: {
    flex: 1,
    borderBottom: '1px solid black',
  },

  table: {
    border: '1px solid black',
    marginTop: 6,
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

  declaration: {
    marginTop: 10,
    textAlign: 'justify',
  },

  signatures: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },

  signBox: {
    width: 180,
    textAlign: 'center',
  },

  signLine: {
    borderBottom: '1px solid black',
    marginBottom: 4,
  },

  officeBox: {
    border: '1px solid black',
    padding: 8,
    marginTop: 30,
  },
})

const ProfessionalAdmissionFormPDF = ({ student }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* HEADER */}

      <View style={styles.header}>
        <Text style={styles.schoolName}>ABC PUBLIC SCHOOL</Text>
        <Text style={styles.address}>123 Education Road, New Delhi</Text>
        <Text style={styles.address}>Phone: +91 9876543210</Text>
        <Text style={styles.formTitle}>STUDENT ADMISSION APPLICATION FORM</Text>
      </View>

      {/* PHOTO */}

      <View style={styles.photoBox}>
        {student.photo ? (
          <Image src={student.photo} style={styles.photo} />
        ) : (
          <Text>Photo</Text>
        )}
      </View>

      {/* STUDENT DETAILS */}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Student Information</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Full Name of Student</Text>
          <Text style={styles.value}>{student.fullName}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Date of Birth</Text>
          <Text style={styles.value}>{formatDate(student.dob)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Gender</Text>
          <Text style={styles.value}>{student.gender}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Class for Admission</Text>
          <Text style={styles.value}>{student.class}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Section</Text>
          <Text style={styles.value}>{student.section}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Nationality</Text>
          <Text style={styles.value}>{student.nationality}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Residential Address</Text>
          <Text style={styles.value}>{student.address}</Text>
        </View>
      </View>

      {/* PARENT DETAILS TABLE */}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Parent / Guardian Details</Text>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.cellHeader}>Field</Text>
            <Text style={styles.cellHeader}>Details</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.cell}>Guardian Name</Text>
            <Text style={styles.cell}>{student.guardianName}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.cell}>Relation with Student</Text>
            <Text style={styles.cell}>{student.guardianRelation}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.cell}>Contact Number</Text>
            <Text style={styles.cell}>{student.guardianContact}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.cell}>Occupation</Text>
            <Text style={styles.cell}>{student.guardianOccupation}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.cell}>Email Address</Text>
            <Text style={styles.cell}>{student.parentEmail}</Text>
          </View>
        </View>
      </View>

      {/* ACADEMIC */}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Academic Information</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Previous Academic Record</Text>
          <Text style={styles.value}>{student.previousAcademicRecord}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>GPA / Marks</Text>
          <Text style={styles.value}>{student.gpaOrMarks}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Subjects Previously Taken</Text>
          <Text style={styles.value}>{student.subjectsTaken}</Text>
        </View>
      </View>

      {/* TRANSPORT */}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Transport Details</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Transport Required</Text>
          <Text style={styles.value}>{student.transportStatus}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Route / Pickup Location</Text>
          <Text style={styles.value}>{student.route}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Vehicle Number</Text>
          <Text style={styles.value}>{student.vehicleNo}</Text>
        </View>
      </View>

      {/* DECLARATION */}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5. Declaration</Text>

        <Text style={styles.declaration}>
          I hereby declare that the information provided in this admission application
          form is true and correct to the best of my knowledge and belief. I understand
          that any false or misleading information may lead to cancellation of admission.
          I also agree to abide by all the rules, regulations, and policies of the school.
        </Text>
      </View>

      {/* SIGNATURES */}

      <View style={styles.signatures}>
        <View style={styles.signBox}>
          <View style={styles.signLine} />
          <Text>Signature of Parent / Guardian</Text>
        </View>

        <View style={styles.signBox}>
          <View style={styles.signLine} />
          <Text>Signature of Student</Text>
        </View>

        <View style={styles.signBox}>
          <View style={styles.signLine} />
          <Text>Date</Text>
        </View>
      </View>

      {/* OFFICE USE */}

      <View style={styles.officeBox}>
        <Text style={styles.sectionTitle}>For Office Use Only</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Admission Number</Text>
          <Text style={styles.value}>{student.admissionNo}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Roll Number</Text>
          <Text style={styles.value}>{student.rollNo}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Admission Date</Text>
          <Text style={styles.value}>{formatDate(student.admissionDate)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Approved By</Text>
          <Text style={styles.value}></Text>
        </View>
      </View>
    </Page>
  </Document>
)

export default ProfessionalAdmissionFormPDF
