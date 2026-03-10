import { useState } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import AdmissionFormPDF from '@/components/pdfs/AdmissionFormPDF'

export default function AdmissionFormPage() {
  const [student, setStudent] = useState({
    fullName: '',
    dob: '',
    gender: '',
    class: '',
    section: '',
    rollNo: '',
    admissionNo: '',
    admissionDate: '',
    joiningDate: '',
    address: '',
    contact: '',
    email: '',
    nationality: '',
    guardianName: '',
    guardianRelation: '',
    guardianContact: '',
    guardianOccupation: '',
    guardianAddress: '',
    parentEmail: '',
    route: '',
    vehicleNo: '',
    transportStatus: '',
    houseName: '',
    cast: '',
    photo: '',
  })

  const handleChange = (field, value) => {
    setStudent((prev) => ({ ...prev, [field]: value }))
  }

  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => handleChange('photo', reader.result)
    reader.readAsDataURL(file)
  }

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Student Admission Form</h1>

        <PDFDownloadLink
          document={<AdmissionFormPDF student={student} />}
          fileName="admission-form.pdf"
        >
          {({ loading }) => (
            <Button>{loading ? 'Preparing PDF...' : 'Print Admission Form'}</Button>
          )}
        </PDFDownloadLink>
      </div>

      {/* Photos */}
      <Card>
        <CardHeader>
          <CardTitle>Student Photo</CardTitle>
        </CardHeader>

        <CardContent className="flex gap-6 items-center">
          {student.photo && (
            <img
              src={student.photo}
              alt="student"
              className="w-24 h-28 object-cover border rounded-md"
            />
          )}

          <div>
            <Label>Upload Photo</Label>
            <Input type="file" onChange={handlePhoto} />
          </div>
        </CardContent>
      </Card>

      {/* Admission Details */}
      <Card>
        <CardHeader>
          <CardTitle>Admission Information</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-4 gap-4">
          <div>
            <Label>Admission No</Label>
            <Input
              value={student.admissionNo}
              onChange={(e) => handleChange('admissionNo', e.target.value)}
            />
          </div>

          <div>
            <Label>Roll No</Label>
            <Input
              value={student.rollNo}
              onChange={(e) => handleChange('rollNo', e.target.value)}
            />
          </div>

          <div>
            <Label>Admission Date</Label>
            <Input
              type="date"
              value={student.admissionDate}
              onChange={(e) => handleChange('admissionDate', e.target.value)}
            />
          </div>

          <div>
            <Label>Joining Date</Label>
            <Input
              type="date"
              value={student.joiningDate}
              onChange={(e) => handleChange('joiningDate', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Student Info */}
      <Card>
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-4 gap-4">
          <div>
            <Label>Full Name</Label>
            <Input
              value={student.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
            />
          </div>

          <div>
            <Label>Date of Birth</Label>
            <Input
              type="date"
              value={student.dob}
              onChange={(e) => handleChange('dob', e.target.value)}
            />
          </div>

          <div>
            <Label>Gender</Label>
            <Select onValueChange={(v) => handleChange('gender', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Nationality</Label>
            <Input
              value={student.nationality}
              onChange={(e) => handleChange('nationality', e.target.value)}
            />
          </div>

          <div>
            <Label>Class</Label>
            <Input
              value={student.class}
              onChange={(e) => handleChange('class', e.target.value)}
            />
          </div>

          <div>
            <Label>Section</Label>
            <Input
              value={student.section}
              onChange={(e) => handleChange('section', e.target.value)}
            />
          </div>

          <div>
            <Label>Contact Number</Label>
            <Input
              value={student.contact}
              onChange={(e) => handleChange('contact', e.target.value)}
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              value={student.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>

          <div className="col-span-4">
            <Label>Address</Label>
            <Textarea
              value={student.address}
              onChange={(e) => handleChange('address', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Guardian */}
      <Card>
        <CardHeader>
          <CardTitle>Guardian Details</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-4 gap-4">
          <div>
            <Label>Guardian Name</Label>
            <Input
              value={student.guardianName}
              onChange={(e) => handleChange('guardianName', e.target.value)}
            />
          </div>

          <div>
            <Label>Relation</Label>
            <Input
              value={student.guardianRelation}
              onChange={(e) => handleChange('guardianRelation', e.target.value)}
            />
          </div>

          <div>
            <Label>Contact</Label>
            <Input
              value={student.guardianContact}
              onChange={(e) => handleChange('guardianContact', e.target.value)}
            />
          </div>

          <div>
            <Label>Occupation</Label>
            <Input
              value={student.guardianOccupation}
              onChange={(e) => handleChange('guardianOccupation', e.target.value)}
            />
          </div>

          <div className="col-span-2">
            <Label>Guardian Address</Label>
            <Textarea
              value={student.guardianAddress}
              onChange={(e) => handleChange('guardianAddress', e.target.value)}
            />
          </div>

          <div className="col-span-2">
            <Label>Parent Email</Label>
            <Input
              value={student.parentEmail}
              onChange={(e) => handleChange('parentEmail', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Transport */}
      <Card>
        <CardHeader>
          <CardTitle>Transport & Other</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-4 gap-4">
          <div>
            <Label>Route</Label>
            <Input
              value={student.route}
              onChange={(e) => handleChange('route', e.target.value)}
            />
          </div>

          <div>
            <Label>Vehicle No</Label>
            <Input
              value={student.vehicleNo}
              onChange={(e) => handleChange('vehicleNo', e.target.value)}
            />
          </div>

          <div>
            <Label>Transport Status</Label>
            <Select onValueChange={(v) => handleChange('transportStatus', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>House</Label>
            <Input
              value={student.houseName}
              onChange={(e) => handleChange('houseName', e.target.value)}
            />
          </div>

          <div>
            <Label>Caste</Label>
            <Input
              value={student.cast}
              onChange={(e) => handleChange('cast', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
