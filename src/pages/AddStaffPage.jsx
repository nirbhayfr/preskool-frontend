import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { User, Briefcase, Phone, Shield, Car, ChevronRight, UserPlus } from 'lucide-react'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { useUpsertStaff, useStaffById } from '@/hooks/useStaff'
import { toast } from 'sonner'
import { useNavigate, useParams } from 'react-router-dom'

// ─── Constants ────────────────────────────────────────────────────────────────
const genders = ['Male', 'Female', 'Other']
const maritalStatuses = ['Single', 'Married', 'Divorced', 'Widowed']

// ─── Schema ───────────────────────────────────────────────────────────────────
const staffSchema = z.object({
  staffId: z.number().optional(),

  fullName: z.string().min(1, 'Full name is required'),
  role: z.string().min(1, 'Role is required'),
  email: z.string().email('Invalid email'),
  contactNumber: z.string().min(1, 'Contact number is required'),
  gender: z.string().min(1, 'Gender is required'),

  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  dateOfJoining: z.string().min(1, 'Date of joining is required'),

  address: z.string().min(1, 'Address is required'),

  profilePictureUrl: z.string().optional(),
  profilePhoto: z.string().optional(),
  idProofPhoto: z.string().optional(),

  qualification: z.string().optional(),
  experienceYears: z.coerce.number().optional(),

  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  nationality: z.string().optional(),
  maritalStatus: z.string().optional(),
  caste: z.string().optional(),

  salary: z.coerce.number().optional(),
  previousSalary: z.coerce.number().optional(),

  emergencyContactName: z.string().optional(),
  emergencyContactNumber: z.string().optional(),

  vehicleNumber: z.string().optional(),
  transportNumber: z.string().optional(),
})

// ─── Field config (drives REQUIRED_FIELDS + EMPTY_DEFAULTS) ──────────────────
const STAFF_FIELDS = [
  { name: 'fullName', required: true },
  { name: 'role', required: true },
  { name: 'email', required: true },
  { name: 'contactNumber', required: true },
  { name: 'gender', required: true },
  { name: 'dateOfBirth', required: true },
  { name: 'dateOfJoining', required: true },
  { name: 'address', required: true },

  { name: 'profilePictureUrl' },
  { name: 'profilePhoto' },
  { name: 'idProofPhoto' },

  { name: 'qualification' },
  { name: 'experienceYears' },

  { name: 'city' },
  { name: 'state' },
  { name: 'postalCode' },
  { name: 'nationality' },
  { name: 'maritalStatus' },
  { name: 'caste' },

  { name: 'salary' },
  { name: 'previousSalary' },

  { name: 'emergencyContactName' },
  { name: 'emergencyContactNumber' },

  { name: 'vehicleNumber' },
  { name: 'transportNumber' },
]

const REQUIRED_FIELDS = STAFF_FIELDS.filter((f) => f.required).map((f) => f.name)

const EMPTY_DEFAULTS = STAFF_FIELDS.reduce(
  (acc, field) => {
    acc[field.name] = ''
    return acc
  },
  { staffId: undefined }
)

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDateForInput(date) {
  if (!date) return ''
  return date.split('T')[0]
}

// ─── Reusable InputField ──────────────────────────────────────────────────────
export function InputField({ form, name, type = 'text', colSpan, options }) {
  const label = name.replace(/([A-Z])/g, ' $1').trim()

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={colSpan ? 'col-span-full' : ''}>
          <FormLabel className="flex items-center gap-1 capitalize">
            {label}
            {REQUIRED_FIELDS.includes(name) && (
              <span className="text-red-500 font-medium">*</span>
            )}
          </FormLabel>

          <FormControl>
            {options ? (
              <Select
                key={field.value ?? 'empty'}
                value={String(field.value ?? '')}
                onValueChange={(val) => field.onChange(val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${label}`} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                {...field}
                type={type}
                value={field.value ?? ''}
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

// ─── Section wrapper ──────────────────────────────────────────────────────────
export function Section({ title, icon, children }) {
  const Icon = icon
  return (
    <div className="rounded-xl border border-border">
      <div className="flex items-center gap-3 px-6 py-4 rounded-t-xl bg-muted/50 border-b border-border">
        <div className="h-10 w-10 rounded-lg bg-background border border-border flex items-center justify-center">
          <Icon className="h-5 w-5 text-foreground" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {children}
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function StaffFormPage({ defaultValues }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const form = useForm({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      ...EMPTY_DEFAULTS,
      ...defaultValues,
    },
  })

  const { data: staff } = useStaffById(id, { enabled: isEdit })
  const { mutate: saveStaff, isLoading } = useUpsertStaff()

  // ── Populate form when editing ──────────────────────────────────────────
  useEffect(() => {
    if (!staff) return

    form.reset({
      ...EMPTY_DEFAULTS,
      staffId: staff.StaffID ?? undefined,
      fullName: staff.FullName ?? '',
      role: staff.Role ?? '',
      email: staff.Email ?? '',
      contactNumber: staff.ContactNumber ?? '',
      gender: (staff.Gender ?? '').trim(),

      dateOfBirth: formatDateForInput(staff.DateOfBirth),
      dateOfJoining: formatDateForInput(staff.DateOfJoining),

      address: staff.Address ?? '',
      city: staff.City ?? '',
      state: staff.State ?? '',
      postalCode: staff.PostalCode ?? '',
      nationality: staff.Nationality ?? '',
      maritalStatus: (staff.MaritalStatus ?? '').trim(),
      caste: staff.Caste ?? '',

      profilePictureUrl: staff.ProfilePictureUrl ?? '',
      profilePhoto: staff.ProfilePhoto ?? '',
      idProofPhoto: staff.IDProofPhoto ?? '',

      qualification: staff.Qualification ?? '',
      experienceYears: staff.ExperienceYears ?? '',

      salary: staff.Salary ?? '',
      previousSalary: staff.PreviousSalary ?? '',

      emergencyContactName: staff.EmergencyContactName ?? '',
      emergencyContactNumber: staff.EmergencyContactNumber ?? '',

      vehicleNumber: staff.VehicleNumber ?? '',
      transportNumber: staff.TransportNumber ?? '',
    })
  }, [staff])

  // ── Auto-fill previousSalary when salary changes ────────────────────────
  const currentSalary = form.watch('salary')

  useEffect(() => {
    if (!isEdit || !staff) return
    const existingSalary = staff.Salary ? Number(staff.Salary) : 0
    const newSalary = Number(currentSalary)
    if (newSalary && newSalary !== existingSalary) {
      form.setValue('previousSalary', existingSalary)
    }
  }, [currentSalary])

  // ── Avatar preview ──────────────────────────────────────────────────────
  const avatar =
    form.watch('profilePhoto') ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      form.watch('fullName') || 'Staff'
    )}`

  // ── Submit ──────────────────────────────────────────────────────────────
  const onSubmit = (values) => {
    saveStaff(
      { ...values, staffId: isEdit ? Number(id) : undefined },
      {
        onSuccess: () => {
          toast.success(
            isEdit ? 'Staff updated successfully' : 'Staff saved successfully'
          )
          navigate('/staff-list')
        },
        onError: () => {
          toast.error('Failed to save staff')
        },
      }
    )
  }

  return (
    <section className="w-full p-6 space-y-8 text-foreground">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <UserPlus className="h-6 w-6" />
          {isEdit ? 'Edit Staff' : 'Add Staff'}
        </h1>
        <div className="mt-2 flex items-center text-sm text-muted-foreground gap-1">
          <span>Dashboard</span>
          <ChevronRight className="h-4 w-4" />
          <span>Staff</span>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-foreground">
            {isEdit ? 'Edit Staff' : 'Add Staff'}
          </span>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Profile images */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img
              src={avatar}
              alt="Profile"
              className="h-28 w-28 rounded-xl border border-border object-cover bg-muted"
            />
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 md:mt-0">
              <InputField form={form} name="profilePhoto" />
              <InputField form={form} name="idProofPhoto" />
            </div>
          </div>

          <Section title="Personal Information" icon={User}>
            <InputField form={form} name="fullName" />
            <InputField form={form} name="role" />
            <InputField form={form} name="gender" options={genders} />
            <InputField form={form} name="dateOfBirth" type="date" />
            <InputField form={form} name="maritalStatus" options={maritalStatuses} />
            <InputField form={form} name="nationality" />
            <InputField form={form} name="caste" />
          </Section>

          <Section title="Professional Information" icon={Briefcase}>
            <InputField form={form} name="qualification" />
            <InputField form={form} name="experienceYears" />
            <InputField form={form} name="dateOfJoining" type="date" />
            <InputField form={form} name="salary" type="number" />
            <InputField form={form} name="previousSalary" type="number" />
          </Section>

          <Section title="Contact Information" icon={Phone}>
            <InputField form={form} name="email" />
            <InputField form={form} name="contactNumber" />
            <InputField form={form} name="address" colSpan />
            <InputField form={form} name="city" />
            <InputField form={form} name="state" />
            <InputField form={form} name="postalCode" />
          </Section>

          <Section title="Emergency Contact" icon={Shield}>
            <InputField form={form} name="emergencyContactName" />
            <InputField form={form} name="emergencyContactNumber" />
          </Section>

          <Section title="Transportation" icon={Car}>
            <InputField form={form} name="vehicleNumber" />
            <InputField form={form} name="transportNumber" />
          </Section>

          <div className="flex justify-end gap-3 pt-6">
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? isEdit
                  ? 'Updating…'
                  : 'Saving…'
                : isEdit
                  ? 'Update Staff'
                  : 'Save Staff'}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  )
}
