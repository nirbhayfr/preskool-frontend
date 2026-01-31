import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getAllFeeSubmissions,
  getFeeSubmissionsByStudent,
  getFeeSubmissionByTransaction,
  createFeeSubmission,
  deleteFeeSubmission,
} from '@/api/fee-submissions'

// Fetch all fee submissions
export const useFeeSubmissions = () =>
  useQuery({
    queryKey: ['feeSubmissions'],
    queryFn: getAllFeeSubmissions,
  })

// Fetch fee submissions for a specific student
export const useFeeSubmissionsByStudent = (studentId) =>
  useQuery({
    queryKey: ['feeSubmissions', 'student', studentId],
    queryFn: () => getFeeSubmissionsByStudent(studentId),
    enabled: !!studentId,
  })

// Fetch a fee submission by transaction ID
export const useFeeSubmissionByTransaction = (transactionId) =>
  useQuery({
    queryKey: ['feeSubmissionTransaction', transactionId],
    queryFn: () => getFeeSubmissionByTransaction(transactionId),
    enabled: !!transactionId,
  })

// Create a new fee submission
export const useCreateFeeSubmission = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => createFeeSubmission(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feeSubmissions'] })
    },
  })
}

// Delete a fee submission
export const useDeleteFeeSubmission = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => deleteFeeSubmission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feeSubmissions'] })
    },
  })
}
