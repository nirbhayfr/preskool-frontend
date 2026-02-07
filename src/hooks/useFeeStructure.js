import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createFeeStructure,
  getAllFeeStructures,
  getFeeStructureByClass,
  updateFeeStructure,
  deleteFeeStructure,
} from '@/api/feeStructure'

export const useAllFeeStructures = () =>
  useQuery({
    queryKey: ['fee-structures'],
    queryFn: getAllFeeStructures,
  })

export const useFeeStructureByClass = ({ classId, academicYear, enabled = true }) =>
  useQuery({
    queryKey: ['fee-structure', classId, academicYear],
    queryFn: () => getFeeStructureByClass({ classId, academicYear }),
    enabled: !!classId && !!academicYear && enabled,
  })

export const useCreateFeeStructure = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createFeeStructure,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['fee-structures'],
      })
    },
  })
}

export const useUpdateFeeStructure = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => updateFeeStructure(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['fee-structures'],
      })
    },
  })
}

export const useDeleteFeeStructure = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => deleteFeeStructure(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['fee-structures'],
      })
    },
  })
}
