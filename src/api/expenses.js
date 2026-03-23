import api from '@/api/api'

export const createExpenseHelper = async (payload) => {
  const { data } = await api.post('/expenses', payload)
  return data
}

export const getExpensesHelper = async () => {
  const { data } = await api.get('/expenses')
  return data
}

export const updateExpenseHelper = async ({ id, ...payload }) => {
  const { data } = await api.put(`/expenses/${id}`, payload)
  return data
}

export const deleteExpenseHelper = async (id) => {
  const { data } = await api.delete(`/expenses/${id}`)
  return data
}
