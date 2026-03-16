import api from './api'

// Get all payments
export const getAllPayments = async () => {
  const response = await api.get('/payments')
  return response.data
}

// Get payment by id
export const getPaymentById = async (id) => {
  const response = await api.get(`/payments/${id}`)
  return response.data
}

// Get payments by person
export const getPaymentsByPerson = async ({ personType, personId }) => {
  const response = await api.get(`/payments/${personType}/${personId}`)
  return response.data
}

// Create payment
export const createPayment = async (data) => {
  const response = await api.post('/payments', data)
  return response.data
}

// Update payment
export const updatePayment = async ({ id, data }) => {
  const response = await api.put(`/payments/${id}`, data)
  return response.data
}

// Delete payment
export const deletePayment = async (id) => {
  const response = await api.delete(`/payments/${id}`)
  return response.data
}
