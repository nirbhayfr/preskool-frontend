import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getTransport,
  getTransportById,
  createTransport,
  updateTransport,
  deleteTransport,
  updateTransportRoute,
  getTransportRoutes,
} from '@/api/transport'

// Get all transport
export const useTransport = () =>
  useQuery({
    queryKey: ['transport'],
    queryFn: getTransport,
  })

// Get transport by id
export const useTransportById = (id) =>
  useQuery({
    queryKey: ['transport', id],
    queryFn: () => getTransportById(id),
    enabled: !!id,
  })

// Create transport
export const useCreateTransport = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: createTransport,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transport'] })
    },
  })
}

// Update transport
export const useUpdateTransport = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: updateTransport,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transport'] })
    },
  })
}

// Delete transport
export const useDeleteTransport = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: deleteTransport,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transport'] })
    },
  })
}

export const useTransportRoutes = (filters) => {
  return useQuery({
    queryKey: ['transportRoutes', filters],
    queryFn: () => getTransportRoutes(filters),
    enabled: !!filters,
  })
}

// 🔹 UPDATE HOOK
export const useUpdateTransportRoute = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }) => updateTransportRoute(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transportRoutes'] })
    },
  })
}
