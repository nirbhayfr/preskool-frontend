import { Clock } from 'lucide-react'
import moment from 'moment'
import { useState } from 'react'
import EditTimeTableModal from './EditTimeTableModal'
import { useUpdateTeacherTimeTable } from '@/hooks/useTeacherTimeTable'
import { toast } from 'sonner'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const SUBJECT_COLORS = {
  Mathematics: { card: 'bg-[#FDE7EC]', icon: 'text-gray-500' },
  Science: { card: 'bg-[#E6F2FB]', icon: 'text-gray-500' },
  English: { card: 'bg-[#ECECFA]', icon: 'text-gray-500' },
  Physics: { card: 'bg-[#F6EEDF]', icon: 'text-gray-500' },
  Biology: { card: 'bg-[#E6F7F4]', icon: 'text-gray-500' },
}

const DEFAULT_COLOR = {
  card: 'bg-[#E6F9FF]',
  icon: 'text-gray-500',
}

const TimeTableCard = ({ data }) => {
  const start = moment.utc(data.StartTime).format('hh:mm A')
  const end = moment.utc(data.EndTime).format('hh:mm A')

  const [openEdit, setOpenEdit] = useState(false)
  const { mutate, isPending } = useUpdateTeacherTimeTable()

  const color = SUBJECT_COLORS[data.Subject] || DEFAULT_COLOR

  const handleUpdate = (updatedData) => {
    console.log(updatedData)
    mutate(
      {
        TimeTableID: data?.TimeTableID,
        ...updatedData,
      },
      {
        onSuccess: () => {
          toast.success('Time table updated successfully')
          setOpenEdit(false)
        },
        onError: () => {
          toast.error('Failed to update')
        },
      }
    )
  }

  return (
    <>
      <Card
        className={`
          ${color.card}
          text-black
          p-3
          rounded-lg
          border
          shadow-sm
          hover:shadow-md
          transition
          relative
          gap-1
        `}
      >
        {/* Edit Button */}
        <Button
          size="sm"
          onClick={() => setOpenEdit(true)}
          className="
            absolute top-2 right-2
            h-7 px-3
            text-xs font-medium
            bg-white text-black
            hover:bg-white/85
            rounded-md
          "
        >
          Edit
        </Button>

        {/* Time */}
        <div className="flex items-center gap-2 text-xs text-gray-700 mb-2">
          <Clock size={14} className={color.icon} />
          <span className="font-medium">
            {start} - {end}
          </span>
        </div>

        {/* Subject */}
        <p className="text-sm font-semibold leading-tight">{data.Subject}</p>

        {/* Teacher */}
        <p className="text-xs text-gray-800 mb-2">{data.TeacherName}</p>

        {/* Class / Room */}
        <div className="bg-white/90 backdrop-blur-sm border rounded-md px-2 py-1 text-xs space-y-0.5">
          <p>
            <span className="font-medium">Class:</span> {data.ClassID}-{data.SectionID}
          </p>

          <p>
            <span className="font-medium">Room:</span> {data.RoomID}
          </p>
        </div>
      </Card>

      <EditTimeTableModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        data={data}
        onSave={handleUpdate}
        isLoading={isPending}
      />
    </>
  )
}

export default TimeTableCard
