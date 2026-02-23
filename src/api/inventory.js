import api from './api'

// Create
export const createBookInventory = async (data) => {
  const response = await api.post('/book-inventory', data)
  return response.data
}

// Get All
export const getBookInventories = async () => {
  const response = await api.get('/book-inventory')
  return response.data
}

// Get By ID
export const getBookInventoryById = async (id) => {
  const response = await api.get(`/book-inventory/${id}`)
  return response.data
}

// Update
export const updateBookInventory = async ({ id, data }) => {
  const response = await api.put(`/book-inventory/${id}`, data)
  return response.data
}

// Delete
export const deleteBookInventory = async (id) => {
  const response = await api.delete(`/book-inventory/${id}`)
  return response.data
}
