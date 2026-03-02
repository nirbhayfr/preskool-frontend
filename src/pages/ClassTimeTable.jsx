import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import TimeTable from '@/components/timeTable/TimeTable'
import AddTimeTableModal from '@/components/timeTable/AddTimeTableModal'

const ClassTimeTable = () => {
  const [openModal, setOpenModal] = useState(false)

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Time Table</h1>
          <p className="text-sm text-muted-foreground">
            Dashboard / Academic / Time Table
          </p>
        </div>

        <Button onClick={() => setOpenModal(true)} className="w-fit">
          + Add Time Table
        </Button>
      </div>

      {/* Modal */}
      {openModal && <AddTimeTableModal onClose={() => setOpenModal(false)} />}

      {/* Content Card */}
      <Card className="shadow-sm">
        <CardContent className="">
          <TimeTable />
        </CardContent>
      </Card>
    </div>
  )
}

export default ClassTimeTable
