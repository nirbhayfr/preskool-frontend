import StaffDetailsAndInfoCard from '@/components/staff-details/StaffDetailsAndInfo'
import StaffDetailsTabsLayout from '@/components/staff-details/StaffDetailsTabs'
import { Button } from '@/components/ui/button'
import { PenBoxIcon } from 'lucide-react'
import { Outlet } from 'react-router-dom'

function StaffDetails() {
  return (
    <section className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Staff Details</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Dashboard
            <span className="mx-1">{'>'}</span>
            <span className="font-medium text-foreground">Staff Details</span>
          </p>
        </div>

        <Button>
          <PenBoxIcon />
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-6 mt-6">
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
          <StaffDetailsAndInfoCard />
        </div>

        <div className="col-span-12 lg:col-span-9 flex flex-col gap-6">
          <StaffDetailsTabsLayout />
          <Outlet />
        </div>
      </div>
    </section>
  )
}

export default StaffDetails
