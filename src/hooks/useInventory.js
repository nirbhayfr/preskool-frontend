import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createBookInventory,
  getBookInventories,
  getBookInventoryById,
  updateBookInventory,
  deleteBookInventory,
} from '@/api/inventory'

// 🔹 Get All
export const useInventories = () => {
  return useQuery({
    queryKey: ['book-inventory'],
    queryFn: getBookInventories,
  })
}

// 🔹 Get By ID
export const useInventory = (id) => {
  return useQuery({
    queryKey: ['book-inventory', id],
    queryFn: () => getBookInventoryById(id),
    enabled: !!id,
  })
}

// 🔹 Create
export const useCreateInventory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createBookInventory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['book-inventory'] })
    },
  })
}

// 🔹 Update
export const useUpdateInventory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateBookInventory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['book-inventory'] })
    },
  })
}

// 🔹 Delete
export const useDeleteInventory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteBookInventory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['book-inventory'] })
    },
  })
}
