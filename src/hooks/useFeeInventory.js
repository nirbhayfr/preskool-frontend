import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createFeeInventory,
  getAllFeeInventory,
  getFeeInventoryById,
  updateFeeInventory,
  deleteFeeInventory,
} from '@/api/feeInventory'

// Fetch all
export const useAllFeeInventory = () =>
  useQuery({
    queryKey: ['fee-inventory'],
    queryFn: getAllFeeInventory,
  })

// Fetch by ID
export const useFeeInventoryById = ({ id, enabled = true }) =>
  useQuery({
    queryKey: ['fee-inventory', id],
    queryFn: () => getFeeInventoryById(id),
    enabled: !!id && enabled,
  })

// Create
export const useCreateFeeInventory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createFeeInventory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fee-inventory'] })
    },
  })
}

// Update
export const useUpdateFeeInventory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => updateFeeInventory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fee-inventory'] })
    },
  })
}

// Delete
export const useDeleteFeeInventory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteFeeInventory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fee-inventory'] })
    },
  })
}
