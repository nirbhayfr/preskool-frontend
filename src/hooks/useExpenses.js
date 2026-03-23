// hooks/useExpenses.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createExpenseHelper,
  getExpensesHelper,
  updateExpenseHelper,
  deleteExpenseHelper,
} from '@/api/expenses'

export const useExpenses = () =>
  useQuery({
    queryKey: ['expenses'],
    queryFn: getExpensesHelper,
  })

export const useCreateExpense = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createExpenseHelper,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['expenses'] }),
  })
}

export const useUpdateExpense = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateExpenseHelper,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['expenses'] }),
  })
}

export const useDeleteExpense = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteExpenseHelper,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['expenses'] }),
  })
}
