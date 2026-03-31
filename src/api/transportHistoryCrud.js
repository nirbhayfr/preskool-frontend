import api from './api'

// GET ALL / WITH FILTERS
export const getTransportHistoryList = async (params) => {
  const response = await api.get('/transport-history-crud', {
    params, // { studentId, vehicleNo, academicYear, monthNumber }
  })
  return response.data
}

// GET BY STUDENT
export const getTransportHistoryByStudent = async (studentId) => {
  const response = await api.get(`/transport-history-crud/student/${studentId}`)
  return response.data
}

// GET BY MONTH & YEAR
export const getTransportHistoryByMonthYear = async ({ monthNumber, academicYear }) => {
  const response = await api.get(
    `/transport-history-crud/month/${monthNumber}/${academicYear}`
  )
  return response.data
}

// CREATE
export const createTransportHistory = async (data) => {
  const response = await api.post('/transport-history-crud', data)
  return response.data
}

// UPDATE
export const updateTransportHistory = async ({ id, data }) => {
  const response = await api.put(`/transport-history-crud/${id}`, data)
  return response.data
}

// DELETE
export const deleteTransportHistory = async (id) => {
  const response = await api.delete(`/transport-history-crud/${id}`)
  return response.data
}
