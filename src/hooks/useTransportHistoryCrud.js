import {
  createTransportHistory,
  deleteTransportHistory,
  getTransportHistoryByMonthYear,
  getTransportHistoryByStudent,
  getTransportHistoryList,
  updateTransportHistory,
} from '@/api/transportHistoryCrud'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// GET ALL / FILTERS
export const useTransportHistoryList = (params) =>
  useQuery({
    queryKey: ['transport-history-list', params],
    queryFn: () => getTransportHistoryList(params),
  })

// GET BY STUDENT
export const useTransportHistoryByStudent = (studentId) =>
  useQuery({
    queryKey: ['transport-history-student', studentId],
    queryFn: () => getTransportHistoryByStudent(studentId),
    enabled: !!studentId,
  })

// GET BY MONTH & YEAR
export const useTransportHistoryByMonthYear = (params) =>
  useQuery({
    queryKey: ['transport-history-month-year', params],
    queryFn: () => getTransportHistoryByMonthYear(params),
    enabled: !!params?.monthNumber && !!params?.academicYear,
  })

// CREATE
export const useCreateTransportHistory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTransportHistory,
    onSuccess: () => {
      queryClient.invalidateQueries(['transport-history-list'])
    },
  })
}

// UPDATE
export const useUpdateTransportHistory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateTransportHistory,
    onSuccess: () => {
      queryClient.invalidateQueries(['transport-history-list'])
    },
  })
}

// DELETE
export const useDeleteTransportHistory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteTransportHistory,
    onSuccess: () => {
      queryClient.invalidateQueries(['transport-history-list'])
    },
  })
}
