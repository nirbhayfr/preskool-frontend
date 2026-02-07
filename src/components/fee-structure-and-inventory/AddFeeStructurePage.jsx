import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import {
  useFeeStructureByClass,
  useCreateFeeStructure,
  useUpdateFeeStructure,
} from '@/hooks/useFeeStructure'

const MONTHS = [
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
  'jan',
  'feb',
  'mar',
]

export default function AddFeeStructurePage() {
  const { classId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const academicYear = location.state?.academic_year
  const isEdit = Boolean(classId)

  // Safety check
  useEffect(() => {
    if (isEdit && !academicYear) {
      toast.error('Academic year missing')
      navigate(-1)
    }
  }, [isEdit, academicYear])

  const {
    data: structure,
    isLoading,
    isError,
  } = useFeeStructureByClass({
    classId,
    academicYear,
    enabled: isEdit && !!academicYear,
  })

  const { mutate: createStructure, isPending: creating } = useCreateFeeStructure()
  const { mutate: updateStructure, isPending: updating } = useUpdateFeeStructure()
  const form = useForm({
    defaultValues: {
      structure_id: '',
      class: '',
      academic_year: '',
      admission_fee: '',
      annual_fee: '',
      exam_fee: '',
      library_fee: '',
      computer_fee: '',
      sports_fee: '',
      lab_fee: '',
      misc_fee: '',
      ...Object.fromEntries(MONTHS.map((m) => [`${m}_tuition_fee`, ''])),
    },
  })

  // Populate on EDIT
  useEffect(() => {
    if (structure && isEdit) {
      form.reset(structure)
    }
  }, [structure, isEdit])

  const onSubmit = (values) => {
    console.log(values)
    if (isEdit) {
      updateStructure(
        {
          id: structure.structure_id,
          data: values,
        },
        {
          onSuccess: () => {
            toast.success('Fee structure updated')
            navigate('/fee-structure')
          },
          onError: () => toast.error('Update failed'),
        }
      )
    } else {
      createStructure(values, {
        onSuccess: () => {
          toast.success('Fee structure created')
          navigate('/fee-structure')
        },
        onError: () => toast.error('Creation failed'),
      })
    }
  }

  if (isLoading) return 'Loading...'
  if (isError) return 'Failed to load fee structure'

  return (
    <section className="p-6 max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? 'Edit' : 'Add'} Fee Structure</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* BASIC INFO */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Structure ID</Label>
                <Input
                  {...form.register('structure_id', { required: true })}
                  placeholder="FS002"
                  readOnly={isEdit}
                />
              </div>
              <div>
                <Label>Class</Label>
                <Input
                  {...form.register('class', { required: true })}
                  readOnly={isEdit}
                />
              </div>

              <div>
                <Label>Academic Year</Label>
                <Input
                  {...form.register('academic_year', { required: true })}
                  placeholder="2025-2026"
                  readOnly={isEdit}
                />
              </div>
            </div>

            {/* FIXED FEES */}
            <Section title="Fixed Fees">
              <FeeInput form={form} name="admission_fee" label="Admission Fee" />
              <FeeInput form={form} name="annual_fee" label="Annual Fee" />
              <FeeInput form={form} name="exam_fee" label="Exam Fee" />
              <FeeInput form={form} name="library_fee" label="Library Fee" />
              <FeeInput form={form} name="computer_fee" label="Computer Fee" />
              <FeeInput form={form} name="sports_fee" label="Sports Fee" />
              <FeeInput form={form} name="lab_fee" label="Lab Fee" />
              <FeeInput form={form} name="misc_fee" label="Misc Fee" />
            </Section>

            {/* MONTHLY FEES */}
            <Section title="Monthly Tuition Fees">
              {MONTHS.map((m) => (
                <FeeInput
                  key={m}
                  form={form}
                  name={`${m}_tuition_fee`}
                  label={`${m.toUpperCase()} Tuition Fee`}
                />
              ))}
            </Section>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 pt-6">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>

              <Button type="submit" disabled={creating || updating}>
                {creating || updating ? 'Saving...' : 'Save Fee Structure'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div className="grid grid-cols-2 gap-4">{children}</div>
    </div>
  )
}

function FeeInput({ form, name, label }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input
        type="number"
        min="0"
        {...form.register(name, {
          required: true,
          valueAsNumber: true, // ✅ KEY FIX
        })}
      />
    </div>
  )
}
