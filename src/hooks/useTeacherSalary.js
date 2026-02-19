import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getTeacherSalaries,
  getTeacherSalaryListById,
  createTeacherSalary,
  updateTeacherSalary,
  deleteTeacherSalary,
} from '@/api/teacherSalary'

export const useTeacherSalaries = () =>
  useQuery({
    queryKey: ['teacher-salary'],
    queryFn: getTeacherSalaries,
  })

export const useTeacherSalaryListById = (id) =>
  useQuery({
    queryKey: ['teacher-salary', id],
    queryFn: () => getTeacherSalaryListById(id),
    enabled: !!id,
  })

export const useCreateTeacherSalary = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: createTeacherSalary,
    onSuccess: () => {
      qc.invalidateQueries(['teacher-salary'])
    },
  })
}

export const useUpdateTeacherSalary = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: updateTeacherSalary,
    onSuccess: (_, variables) => {
      qc.invalidateQueries(['teacher-salary'])
      qc.invalidateQueries(['teacher-salary', variables.id])
    },
  })
}

export const useDeleteTeacherSalary = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: deleteTeacherSalary,
    onSuccess: () => {
      qc.invalidateQueries(['teacher-salary'])
    },
  })
}
