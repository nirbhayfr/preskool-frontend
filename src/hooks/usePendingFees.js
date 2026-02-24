import { getPendingFees } from '@/api/pendingFees'
import { useQuery } from '@tanstack/react-query'

export const usePendingFees = (filters) => {
  const { StudentID, ClassID, SectionID } = filters || {}

  const hasAtLeastOne = Boolean(StudentID) || Boolean(ClassID) || Boolean(SectionID)

  return useQuery({
    queryKey: ['pending-fees', filters],
    queryFn: () => getPendingFees(filters),
    enabled: hasAtLeastOne,
  })
}
