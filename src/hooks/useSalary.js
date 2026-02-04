import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getAllSalaries,
  getTeacherSalaryById,
  getStaffSalaryById,
  updateTeacherSalary,
  updateStaffSalary,
} from '@/api/salary'

/* ---------- QUERIES ---------- */

export const useAllSalaries = () => {
  return useQuery({
    queryKey: ['salaries'],
    queryFn: getAllSalaries,
  })
}

export const useTeacherSalaryById = (teacherId) => {
  return useQuery({
    queryKey: ['salary', 'teacher', teacherId],
    queryFn: () => getTeacherSalaryById(teacherId),
    enabled: !!teacherId,
  })
}

export const useStaffSalaryById = (staffId) => {
  return useQuery({
    queryKey: ['salary', 'staff', staffId],
    queryFn: () => getStaffSalaryById(staffId),
    enabled: !!staffId,
  })
}

/* ---------- MUTATIONS ---------- */

export const useUpdateTeacherSalary = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => updateTeacherSalary(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries(['salary', 'teacher', id])
      queryClient.invalidateQueries(['salaries'])
    },
  })
}

export const useUpdateStaffSalary = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => updateStaffSalary(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries(['salary', 'staff', id])
      queryClient.invalidateQueries(['salaries'])
    },
  })
}
