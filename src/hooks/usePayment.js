// hooks/usePayment.js

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getAllPayments,
  getPaymentById,
  getPaymentsByPerson,
  createPayment,
  updatePayment,
  deletePayment,
} from '@/api/payment'

// Get all payments
export const useAllPayments = () =>
  useQuery({
    queryKey: ['payments'],
    queryFn: getAllPayments,
  })

// Get payment by id
export const usePaymentById = (id) =>
  useQuery({
    queryKey: ['payments', id],
    queryFn: () => getPaymentById(id),
    enabled: !!id,
  })

// Get payments by person
export const usePaymentsByPerson = ({ personType, personId }) =>
  useQuery({
    queryKey: ['payments', personType, personId],
    queryFn: () => getPaymentsByPerson({ personType, personId }),
    enabled: !!personType && !!personId,
  })

// Create payment
export const useCreatePayment = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: createPayment,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['payments'] })
    },
  })
}

// Update payment
export const useUpdatePayment = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: updatePayment,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['payments'] })
    },
  })
}

// Delete payment
export const useDeletePayment = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: deletePayment,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['payments'] })
    },
  })
}
