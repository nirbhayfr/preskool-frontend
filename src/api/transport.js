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

// GET transport routes (all / class / class+section)
export const getTransportRoutes = async ({ classId, sectionId }) => {
  let url = '/gettransportroute'

  const params = new URLSearchParams()

  if (classId) params.append('classId', classId)
  if (sectionId) params.append('sectionId', sectionId)

  if ([...params].length) {
    url += `?${params.toString()}`
  }

  const { data } = await api.get(url)
  return data
}

// UPDATE transport route
export const updateTransportRoute = async (id, payload) => {
  const { data } = await api.put(`/updatetransportroute/${id}`, payload)
  return data
}
