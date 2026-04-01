import { getClassTimetable } from '@/api/timeTable'
import { useQuery } from '@tanstack/react-query'

export const useClassTimetable = (params) =>
  useQuery({
    queryKey: ['class-timetable', params],
    queryFn: () => getClassTimetable(params),
    enabled: !!params?.classId, // ✅ section not required
  })
