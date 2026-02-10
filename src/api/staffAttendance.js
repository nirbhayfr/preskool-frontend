import api from './api'

export const getStaffAttendanceMatrixAll = async () => {
  const { data } = await api.get('/v1/staff-attendance/all')
  return data
}

export const getStaffAttendanceMatrixById = async (staffId) => {
  const { data } = await api.get(`/v1/staff-attendance/by-id/${staffId}`)
  return data
}

export const getStaffAttendanceToday = async () => {
  const { data } = await api.get('/write-staff-attendence/today')
  return data
}

export const writeStaffAttendanceToday = async (payload) => {
  const { data } = await api.post('/write-staff-attendence/today', payload)
  return data
}

export const writeStaffAttendanceForDate = async (date, payload) => {
  const { data } = await api.post(`/write-staff-attendence/${date}`, payload)
  return data
}

export const getStaffMonthlySummaryById = async (staffId, month) => {
  const { data } = await api.get('/v1/staff-attendance/summary', {
    params: {
      staffId,
      month,
    },
  })
  return data
}

export const getAllStaffMonthlySummary = async (month) => {
  const { data } = await api.get('/v1/staff-attendance/all-summary', {
    params: { month },
  })
  return data
}
