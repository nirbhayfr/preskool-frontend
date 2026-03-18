import { CircleLoader } from '@/components/layout/RouteLoader'
import PayStaffSalarySection from '@/components/pay-staff-salary/PayStaffSalarySection'
import StaffAdvancePaymentList from '@/components/pay-staff-salary/StaffAdvancePaymentList'
import StaffAdvancePaymentModal from '@/components/pay-staff-salary/StaffAdvancePaymentModal'
import StaffAttendanceSummaryCard from '@/components/pay-staff-salary/StaffAttendanceSummary'
import StaffDetailCard from '@/components/pay-staff-salary/StaffDetailCard'
import StaffPreviousSalaryRecords from '@/components/pay-staff-salary/StaffPreviousSalaryRecords'
import StaffSalaryCalculationCard from '@/components/pay-staff-salary/StaffSalaryCalculationCard'
import StaffSalaryMonthGrid from '@/components/pay-staff-salary/StaffSalaryMonthGrid'
import { useStaffById } from '@/hooks/useStaff'
import { useParams } from 'react-router-dom'

function PaySalaryPage() {
  const { id } = useParams()
  const { data: staff, isLoading, isError } = useStaffById(id)

  if (isLoading) return <CircleLoader />
  if (isError) return <p className="text-sm text-destructive p-6">Failed to load Staff</p>
  if (!staff) return null

  console.log(staff)

  return (
    <section className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Salary Portal</h1>
          <p className="text-sm text-muted-foreground">Manage and collect staff salary</p>
        </div>
        <StaffAdvancePaymentModal staffId={staff.StaffID} staff={staff} />
      </div>

      <StaffDetailCard staff={staff} />
      <StaffAttendanceSummaryCard staffId={staff.StaffID} />
      <StaffSalaryCalculationCard staffId={staff.StaffID} baseSalary={staff.Salary} />
      <StaffAdvancePaymentList staffId={staff.StaffID} staff={staff} />
      <StaffPreviousSalaryRecords staffId={staff.StaffID} staff={staff} />
      <PayStaffSalarySection staffId={staff.StaffID} staff={staff} />
      <StaffSalaryMonthGrid staffId={staff.StaffID} />
    </section>
  )
}

export default PaySalaryPage
