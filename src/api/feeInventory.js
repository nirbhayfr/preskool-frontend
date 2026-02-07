import api from './api'

// Create
export const createFeeInventory = async (data) => {
  const response = await api.post('/fee-inventory', data)
  return response.data
}

// Get all
export const getAllFeeInventory = async () => {
  const response = await api.get('/fee-inventory')
  return response.data
}

// Get by ID
export const getFeeInventoryById = async (id) => {
  const response = await api.get(`/fee-inventory/${id}`)
  return response.data
}

// Update
export const updateFeeInventory = async (id, data) => {
  const response = await api.put(`/fee-inventory/${id}`, data)
  return response.data
}

// Delete
export const deleteFeeInventory = async (id) => {
  const response = await api.delete(`/fee-inventory/${id}`)
  return response.data
}
