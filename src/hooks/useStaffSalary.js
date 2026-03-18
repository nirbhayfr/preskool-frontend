import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getStaffSalaries,
  getStaffSalaryListById,
  createStaffSalary,
  updateStaffSalary,
  deleteStaffSalary,
  bulkMarkStaffSalaryPaid,
  getStaffSalaryByStaffId,
} from '@/api/staffSalary'

export const useStaffSalaries = () =>
  useQuery({
    queryKey: ['staff-salary'],
    queryFn: getStaffSalaries,
  })

export const useStaffSalaryListById = (id) =>
  useQuery({
    queryKey: ['staff-salary', id],
    queryFn: () => getStaffSalaryListById(id),
    enabled: !!id,
  })

export const useBulkMarkStaffSalaryPaid = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: bulkMarkStaffSalaryPaid,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['staff-salary'] })
    },
  })
}

export const useCreateStaffSalary = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: createStaffSalary,
    onSuccess: () => {
      qc.invalidateQueries(['staff-salary'])
    },
  })
}

export const useUpdateStaffSalary = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: updateStaffSalary,
    onSuccess: (_, variables) => {
      qc.invalidateQueries(['staff-salary'])
      qc.invalidateQueries(['staff-salary', variables.id])
    },
  })
}

export const useDeleteStaffSalary = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: deleteStaffSalary,
    onSuccess: () => {
      qc.invalidateQueries(['staff-salary'])
    },
  })
}

export const useStaffSalaryByStaffId = (staffId) =>
  useQuery({
    queryKey: ['staff-salary', staffId],
    queryFn: () => getStaffSalaryByStaffId(staffId),
    enabled: !!staffId,
  })
