import api from './api'

// Get all transport
export const getTransport = async () => {
  const response = await api.get('/transport')
  return response.data.data
}

// Get transport by id
export const getTransportById = async (id) => {
  const response = await api.get(`/transport/${id}`)
  return response.data
}

// Create transport
export const createTransport = async (data) => {
  const response = await api.post('/transport', data)
  return response.data
}

// Update transport
export const updateTransport = async ({ id, data }) => {
  const response = await api.put(`/transport/${id}`, data)
  return response.data
}

// Delete transport
export const deleteTransport = async (id) => {
  const response = await api.delete(`/transport/${id}`)
  return response.data
}
