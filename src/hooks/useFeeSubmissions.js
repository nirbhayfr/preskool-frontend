import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getAllFeeSubmissions,
  getFeeSubmissionsByStudent,
  getFeeSubmissionByTransaction,
  createFeeSubmissionHelper,
  deleteFeeSubmission,
  fetchFeeCollectionByDate,
  deductFeesHelper,
  updateFeeSubmissionHelper,
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
    mutationFn: (data) => createFeeSubmissionHelper(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feeSubmissions'] })
    },
  })
}

export const useUpdateFeeSubmission = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateFeeSubmissionHelper,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fee-submissions'] })
      queryClient.invalidateQueries({ queryKey: ['fees'] })
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

export const useFeeCollectionByDate = (date) => {
  return useQuery({
    queryKey: ['fee-collection-by-date', date],
    queryFn: () => fetchFeeCollectionByDate(date),
    enabled: !!date,
  })
}

export const useDeductFees = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deductFeesHelper,

    onSuccess: () => {
      queryClient.invalidateQueries(['student'])
      queryClient.invalidateQueries(['feeSubmissions'])
    },
  })
}
