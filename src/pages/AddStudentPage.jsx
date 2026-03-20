import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import { User, Shield, Book, UserPlus } from 'lucide-react'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useCreateStudent, useStudent } from '@/hooks/useStudents'
import { toast } from 'sonner'
import { Section } from './AddTeacherPage'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { decryptData } from '@/utils/crypto'
import { classes, sections } from '@/data/basicData'
import { pdf } from '@react-pdf/renderer'
import AdmissionFormPDF from '@/components/pdfs/AdmissionFormPDF'

const STUDENT_FIELDS = [
  { name: 'fullName', required: true },
  { name: 'dob', required: true },
  { name: 'gender', required: true },
  { name: 'class', required: true },
  { name: 'section', required: true },

  { name: 'rollNo' },
  { name: 'admissionNo' },
  { name: 'joiningDate', required: true },
  { name: 'identificationNumber' },
  { name: 'enrollmentNumber' },

  { name: 'program' },
  { name: 'yearSemester' },
  { name: 'previousRecord' },

  { name: 'gpa' },
  { name: 'attendance' },
  { name: 'subjects' },
  { name: 'status' },

  { name: 'houseName' },
  { name: 'caste' },

  { name: 'address', required: true },
  { name: 'contact', required: true },
  { name: 'email' },
  { name: 'nationality' },

  { name: 'photo' },
  { name: 'fatherPhoto' },
  { name: 'motherPhoto' },
  { name: 'guardianPhoto' },

  { name: 'guardianName' },
  { name: 'guardianRelation' },
  { name: 'guardianContact' },
  { name: 'guardianOccupation' },
  { name: 'guardianAddress' },

  { name: 'pendingFee', required: true },
  { name: 'discountAmount', required: true },
  { name: 'route' },
  { name: 'transportStatus' },
  { name: 'vehicleNo' },
]

const REQUIRED_FIELDS = STUDENT_FIELDS.filter((f) => f.required).map((f) => f.name)

const EMPTY_DEFAULTS = STUDENT_FIELDS.reduce(
  (acc, field) => {
    acc[field.name] = ''
    return acc
  },
  { studentId: '' }
)

const studentSchema = z.object({
  studentId: z.string().optional(),
  fullName: z.string().min(1),
  dob: z.string().min(1),
  gender: z.string().min(1),
  class: z.string().min(1, 'Class is required'),
  section: z.string().min(1, 'Section is required'),

  rollNo: z.string().optional(),
  admissionNo: z.string().optional(),
  joiningDate: z.string().optional(),
  identificationNumber: z.string().optional(),
  enrollmentNumber: z.string().optional(),

  program: z.string().optional(),
  yearSemester: z.string().optional(),
  previousRecord: z.string().optional(),

  gpa: z.string().optional(),
  attendance: z.string().optional(),
  subjects: z.string().optional(),
  status: z.string().min(1),

  houseName: z.string().optional(),
  caste: z.string().optional(),

  address: z.string().min(1),
  contact: z.string().min(1),
  email: z.string().optional(),
  nationality: z.string().optional(),

  photo: z.string().optional(),
  fatherPhoto: z.string().optional(),
  motherPhoto: z.string().optional(),
  guardianPhoto: z.string().optional(),

  guardianName: z.string().optional(),
  guardianRelation: z.string().optional(),
  guardianContact: z.string().optional(),
  guardianOccupation: z.string().optional(),
  guardianAddress: z.string().optional(),

  pendingFee: z.string().optional(),
  discountAmount: z.string().optional(),
  route: z.string().optional(),
  transportStatus: z.string().optional(),
  vehicleNo: z.string().optional(),
})

function InputField({ form, name, type = 'text', colSpan, options }) {
  const isSelect = Array.isArray(options)
  const label = name.replace(/([A-Z])/g, ' $1').trim()
  const required = REQUIRED_FIELDS.includes(name)
  const fieldId = `field-${name}`

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={colSpan ? 'col-span-full' : ''}>
          <FormLabel
            htmlFor={isSelect ? undefined : fieldId}
            id={`${fieldId}-label`}
            className="flex items-center gap-1 capitalize"
          >
            {label}
            {required && <span className="text-red-500">*</span>}
          </FormLabel>

          <FormControl>
            {isSelect ? (
              <Select
                key={field.value} // <-- force remount when value changes
                value={field.value ?? ''}
                onValueChange={(val) => field.onChange(String(val))}
              >
                <SelectTrigger aria-labelledby={`${fieldId}-label`}>
                  <SelectValue placeholder={`Select ${label}`} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((opt) => (
                    <SelectItem key={opt} value={String(opt)}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                {...field}
                type={type}
                id={fieldId}
                onChange={(e) => field.onChange(e.target.value)}
              />
            )}
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function formatDateForInput(date) {
  if (!date) return ''
  return date.split('T')[0]
}

export default function StudentFormPage({ defaultValues }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const encryptedUser = localStorage.getItem('user')
  const user = encryptedUser ? decryptData(encryptedUser) : null

  const form = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      ...EMPTY_DEFAULTS,
      status: 'Active',
      ...defaultValues,
    },
  })

  const { data: student } = useStudent(id, { enabled: isEdit })
  const { mutate: saveStudent, isLoading } = useCreateStudent()

  useEffect(() => {
    if (user?.Role !== 'Admin' && user?.LinkedID !== Number(id)) {
      toast.error("You are not authorized to edit this student's details.")
      navigate(-1)
      return
    }

    if (student) {
      const mappedStudent = {
        studentId: String(student.StudentID ?? ''),
        fullName: student.FullName ?? '',
        dob: formatDateForInput(student.DOB),
        gender: student.Gender ?? '',
        class: String(student.ClassID ?? ''),
        section: String(student.SectionID ?? ''),
        rollNo: String(student.RollNo ?? ''),
        admissionNo: student.AdmissionNo ?? '',
        joiningDate: formatDateForInput(student.JoiningDate),
        identificationNumber: student.IdentificationNumber ?? '',
        enrollmentNumber: student.EnrollmentNumber ?? '',
        program: student.Program ?? '',
        yearSemester: student.YearSemester ?? '',
        previousRecord: student.PreviousRecord ?? '',
        gpa: String(student.GPA ?? ''),
        attendance: String(student.Attendance ?? ''),
        subjects: student.Subjects ?? '',
        status: student.Status ?? 'Active',
        houseName: student.HouseName ?? '',
        caste: student.Cast ?? '',
        address: student.Address ?? '',
        contact: String(student.ContactNumber ?? ''),
        email: student.EmailAddress ?? '',
        nationality: student.Nationality ?? '',
        photo: student.PhotoUrl ?? '',
        fatherPhoto: student.FatherPhoto ?? '',
        motherPhoto: student.MotherPhoto ?? '',
        guardianPhoto: student.GuardianPhoto ?? '',
        guardianName: student.GuardianName ?? '',
        guardianRelation: student.GuardianRelation ?? '',
        guardianContact: String(student.GuardianContact ?? ''),
        guardianOccupation: student.GuardianOccupation ?? '',
        guardianAddress: student.GuardianAddress ?? '',
        pendingFee: String(student.PendingFee ?? ''),
        discountAmount: String(student.DiscountAmount ?? ''),
        route: student.Route ?? '',
        transportStatus: (student.TransportStatus ?? '').trim(),
        vehicleNo: student.VehicleNo ?? '',
      }

      console.log(mappedStudent)

      form.reset({
        ...EMPTY_DEFAULTS,
        ...mappedStudent,
      })
    }
  }, [student])

  const avatar =
    form.watch('photo') ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(form.watch('fullName') || 'Student')}`

  const onSubmit = (values) => {
    saveStudent(
      {
        ...values,
        studentId: isEdit ? String(id) : undefined,
      },
      {
        onSuccess: async () => {
          toast.success(
            isEdit ? 'Student updated successfully' : 'Student saved successfully'
          )

          if (!isEdit) {
            try {
              const pdfData = {
                srNo: values.admissionNo || '',
                classAdmission: values.class,
                session: '', // not in student form — hardcode or pull from context if available

                fullName: values.fullName,
                gender: values.gender,
                dob: values.dob,
                dobWords: '', // not in student form — leave blank or compute if needed
                ageYear: '', // not in student form — leave blank or compute if needed
                ageMonth: '',
                ageDay: '',

                bloodGroup: '', // not in student form — add field if needed
                category: values.caste || '', // closest match; rename if you have a dedicated category field

                motherName: '', // not in student form
                motherNationality: '',
                motherOffice: '',
                motherAddress: values.address,
                motherPermAddr: values.address,
                motherIncome: '',

                fatherName:
                  values.guardianRelation?.toLowerCase() === 'father'
                    ? values.guardianName
                    : '',
                fatherNationality: values.nationality || '',
                fatherOffice: '',
                fatherAddress: values.guardianAddress || values.address,
                fatherPermAddr: values.guardianAddress || values.address,
                fatherIncome: '',

                localGuardian: values.guardianName
                  ? `${values.guardianName}, ${values.guardianAddress || ''}`
                  : '',
                lastSchool: values.previousRecord || '',
                cbseAffiliated: '',
                otherBoard: '',
                lastResult: values.gpa || '',
                subjects: values.subjects
                  ? values.subjects.split(',').map((s) => s.trim().toUpperCase())
                  : [],
                tcAttached: '',
                motherTongue: '',

                admissionDate: values.joiningDate || '',
                section: values.section,
                feeReceiptNo: '',
                feeReceiptDate: '',
                admissionFee: '',
                tuitionFee: '',
                otherFee: '',
                computerFee: '',
                totalFee: values.pendingFee || '',
                awrNo: '',
                awrVol: '',

                transportStatus: values.transportStatus || 'non-transport',
                village: '', // not in student form — add field if needed
                guardianContact: values.guardianContact || values.contact,
                route: values.route || '',
                driverName: '', // not in student form
                driverMobile: '',

                photo: values.photo || '',
              }

              const blob = await pdf(<AdmissionFormPDF student={pdfData} />).toBlob()
              const url = URL.createObjectURL(blob)

              const win = window.open(url, '_blank')
              if (win) {
                win.addEventListener('load', () => {
                  win.focus()
                  win.print()
                  setTimeout(() => URL.revokeObjectURL(url), 60_000)
                })
              } else {
                // Fallback if popup was blocked
                toast.warning('Allow popups to auto-print the admission form')
                const a = document.createElement('a')
                a.href = url
                a.target = '_blank'
                a.click()
              }
            } catch (err) {
              console.error('PDF generation failed:', err)
              toast.error('Could not generate admission form PDF')
            }
          }

          navigate('/student-list')
        },
      }
    )
  }

  return (
    <section className="w-full p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <UserPlus className="h-6 w-6" />
          {isEdit ? 'Edit Student' : 'Add Student'}
        </h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img
              src={avatar}
              alt="Profile"
              className="h-28 w-28 rounded-xl border object-cover"
            />
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField form={form} name="photo" />
              <InputField form={form} name="fatherPhoto" />
              <InputField form={form} name="motherPhoto" />
              <InputField form={form} name="guardianPhoto" />
            </div>
          </div>

          <Section title="Personal Information" icon={User}>
            <InputField form={form} name="fullName" />
            <InputField form={form} name="dob" type="date" />
            <InputField form={form} name="gender" />
            <InputField form={form} name="class" options={classes.map(String)} />
            <InputField form={form} name="section" options={sections.map(String)} />
            <InputField form={form} name="houseName" />
            <InputField form={form} name="caste" />
          </Section>

          <Section title="Academic Information" icon={Book}>
            <InputField form={form} name="rollNo" />
            <InputField form={form} name="admissionNo" />
            <InputField form={form} name="joiningDate" type="date" />
            <InputField form={form} name="identificationNumber" />
            <InputField form={form} name="enrollmentNumber" />
            <InputField form={form} name="program" />
            <InputField form={form} name="yearSemester" />
            <InputField form={form} name="previousRecord" />
            <InputField form={form} name="gpa" />
            <InputField form={form} name="attendance" />
            <InputField form={form} name="subjects" colSpan />
            <InputField form={form} name="status" options={['Active', 'Inactive']} />
          </Section>

          <Section title="Contact Information" icon={Shield}>
            <InputField form={form} name="address" colSpan />
            <InputField form={form} name="contact" />
            <InputField form={form} name="email" />
            <InputField form={form} name="nationality" />
          </Section>

          <Section title="Guardian Information" icon={User}>
            <InputField form={form} name="guardianName" />
            <InputField form={form} name="guardianRelation" />
            <InputField form={form} name="guardianContact" />
            <InputField form={form} name="guardianOccupation" />
            <InputField form={form} name="guardianAddress" colSpan />
          </Section>

          <Section title="Transport & Fees" icon={Shield}>
            <InputField form={form} name="pendingFee" />
            <InputField form={form} name="discountAmount" />
            <InputField form={form} name="route" />
            <InputField form={form} name="transportStatus" options={['Yes', 'No']} />
            <InputField form={form} name="vehicleNo" />
          </Section>

          <div className="flex justify-end pt-6">
            <Button type="submit" disabled={isLoading}>
              {isEdit ? 'Update Student' : 'Save Student'}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  )
}
