import api from './api'

export const recordTransportHistory = async (date) => {
  const response = await api.post('/transport-history/record', { date })
  return response.data
}

export const getAllTransportHistory = async ({ academicYear, month, classId }) => {
  const response = await api.get('/transport-history/all', {
    params: { academicYear, month, classId },
  })
  return response.data
}

export const getStudentTransportHistory = async ({ studentId, academicYear, month }) => {
  const response = await api.get(`/transport-history/student/${studentId}`, {
    params: { academicYear, month },
  })
  return response.data
}

export const getTransportHistorySummary = async (academicYear) => {
  const response = await api.get('/transport-history/summary', {
    params: { academicYear },
  })
  return response.data
}

export const getOwnerTransportReport = async () => {
  const response = await api.get('/transport-report')
  return response.data
}

export const getStudentsTransportReport = async () => {
  const response = await api.get('/transport-report/students')
  return response.data
}

export const getStudentTransportReport = async ({ studentId }) => {
  const response = await api.get(`/transport-report/students/${studentId}`)
  return response.data
}
