import api from '@/api/api'
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

export function useStudentInventoryFees(studentId) {
  return useQuery({
    queryKey: ['inventoryFees', 'student', studentId],
    queryFn: async () => {
      const { data } = await api.get(`/pendingInventryFees/student/${studentId}`)
      return data
    },
    enabled: !!studentId,
  })
}

export function useInventoryFeesStatus() {
  return useQuery({
    queryKey: ['inventoryFees', 'status'],
    queryFn: async () => {
      const { data } = await api.get(`/pendingInventryFees/status`)
      return data
    },
  })
}
