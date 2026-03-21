// hooks/useCustomConfig.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/api/api'

export const useCustomConfigs = () =>
  useQuery({
    queryKey: ['custom-config'],
    queryFn: async () => {
      const { data } = await api.get('/custom-config')
      return data
    },
  })

export const useCustomConfig = (id) =>
  useQuery({
    queryKey: ['custom-config', id],
    queryFn: async () => {
      const { data } = await api.get(`/custom-config/${id}`)
      return data
    },
    enabled: !!id,
  })

export const useCustomConfigByList = (listName) =>
  useQuery({
    queryKey: ['custom-config', 'by-list', listName],
    queryFn: async () => {
      const { data } = await api.get(`/custom-config/by-list/${listName}`)
      return data
    },
    enabled: !!listName,
  })

export const useCreateCustomConfig = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post('/custom-config', payload)
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['custom-config'] }),
  })
}

export const useUpdateCustomConfig = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...payload }) => {
      const { data } = await api.put(`/custom-config/${id}`, payload)
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['custom-config'] }),
  })
}

export const useDeleteCustomConfig = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/custom-config/${id}`)
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['custom-config'] }),
  })
}
