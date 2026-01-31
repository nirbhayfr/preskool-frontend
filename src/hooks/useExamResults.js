import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getAllExamResults,
  getExamResultsByStudent,
  getExamResultById,
  createExamResult,
  updateExamResult,
  deleteExamResult,
} from '@/api/exam-results'

// Fetch all exam results
export const useExamResults = () =>
  useQuery({
    queryKey: ['examResults'],
    queryFn: getAllExamResults,
  })

// Fetch exam results for a specific student
export const useExamResultsByStudent = (studentId) =>
  useQuery({
    queryKey: ['examResults', 'student', studentId],
    queryFn: () => getExamResultsByStudent(studentId),
    enabled: !!studentId,
  })

// Fetch a single exam result by ID
export const useExamResult = (id) =>
  useQuery({
    queryKey: ['examResult', id],
    queryFn: () => getExamResultById(id),
    enabled: !!id,
  })

// Create a new exam result
export const useCreateExamResult = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload) => createExamResult(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['examResults'] })
    },
  })
}

// Update an existing exam result
export const useUpdateExamResult = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }) => updateExamResult(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['examResults'] })
      queryClient.invalidateQueries({ queryKey: ['examResult', id] })
    },
  })
}

// Delete an exam result
export const useDeleteExamResult = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => deleteExamResult(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['examResults'] })
    },
  })
}
