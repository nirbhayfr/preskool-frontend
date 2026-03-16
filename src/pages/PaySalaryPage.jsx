import { CircleLoader } from '@/components/layout/RouteLoader'
import AdvancePaymentModal from '@/components/pay-salary/AdvancePaymentModal'
import AttendanceSummaryCard from '@/components/pay-salary/AttendanceSummaryCard'
import SalaryCalculationCard from '@/components/pay-salary/SalaryCalculationCard'
import TeacherDetailCard from '@/components/pay-salary/TeacherDetailsCardPS'
import { useTeacher } from '@/hooks/useTeacher'
import { useParams } from 'react-router-dom'

function PaySalaryPage() {
  const { id } = useParams()
  const { data: teacher, isLoading, isError } = useTeacher(id)

  if (isLoading) return <CircleLoader />
  if (isError)
    return <p className="text-sm text-destructive p-6">Failed to load Teacher</p>
  if (!teacher) return null

  console.log(teacher)

  return (
    <section className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Salary Portal</h1>
          <p className="text-sm text-muted-foreground">
            Manage and collect teacher salary
          </p>
        </div>
        <AdvancePaymentModal teacherId={teacher.TeacherID} />
      </div>

      <TeacherDetailCard teacher={teacher} />
      <AttendanceSummaryCard teacherId={teacher.TeacherID} />
      <SalaryCalculationCard teacherId={teacher.TeacherID} baseSalary={teacher.Salary} />
    </section>
  )
}

export default PaySalaryPage
