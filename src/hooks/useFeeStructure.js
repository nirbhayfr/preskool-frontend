import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createFeeStructure,
  getAllFeeStructures,
  getFeeStructureByClass,
  updateFeeStructure,
  deleteFeeStructure,
} from '@/api/feeStructure'

// Fetch all
export const useAllFeeStructures = () => useQuery(['fee-structures'], getAllFeeStructures)

export const useFeeStructureByClass = ({ classId, academicYear, enabled = true }) => {
  return useQuery({
    queryKey: ['fee-structure', classId, academicYear],
    queryFn: () => getFeeStructureByClass({ classId, academicYear }),
    enabled: !!classId && !!academicYear && enabled,
  })
}

// Create
export const useCreateFeeStructure = () => {
  const queryClient = useQueryClient()
  return useMutation(createFeeStructure, {
    onSuccess: () => queryClient.invalidateQueries(['fee-structures']),
  })
}

// Update
export const useUpdateFeeStructure = () => {
  const queryClient = useQueryClient()
  return useMutation(({ id, data }) => updateFeeStructure(id, data), {
    onSuccess: () => queryClient.invalidateQueries(['fee-structures']),
  })
}

// Delete
export const useDeleteFeeStructure = () => {
  const queryClient = useQueryClient()
  return useMutation((id) => deleteFeeStructure(id), {
    onSuccess: () => queryClient.invalidateQueries(['fee-structures']),
  })
}
