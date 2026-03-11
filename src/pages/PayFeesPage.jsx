import { useParams } from 'react-router-dom'
import { CircleLoader } from '@/components/layout/RouteLoader'
import { useStudent } from '@/hooks/useStudents'

import StudentDetailsPayFees from '@/components/pay-fees/StudentDetailsPayFees'
import PreviousFeesRecords from '@/components/pay-fees/PreviousFeesRecord'
import PayFeesSection from '@/components/pay-fees/PayFeesSection'
import { useFeeSubmissionsByStudent } from '@/hooks/useFeeSubmissions'

function PayFeesPage() {
  const { id } = useParams()
  const { data: student, isLoading, isError } = useStudent(id)
  const { data: feesData, isLoading: isFeeLoading } = useFeeSubmissionsByStudent(id)

  if (isLoading || isFeeLoading) return <CircleLoader />
  if (isError) return <p className="text-sm text-destructive">Failed to load student</p>
  if (!student) return null

  return (
    <section className="p-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Fees Portal</h1>
        <p className="text-sm text-muted-foreground">Manage and collect student fees</p>
      </div>

      <StudentDetailsPayFees student={student} />
      <PreviousFeesRecords feesData={feesData} isLoading={isFeeLoading} />
      <PayFeesSection student={student} feesData={feesData} />
    </section>
  )
}

export default PayFeesPage
