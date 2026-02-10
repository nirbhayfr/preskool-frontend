import api from './api'

export const getTeacherAttendanceToday = async () => {
  const { data } = await api.get('/getteacherattendance/today')
  return data
}

export const getTeacherAttendanceMatrixAll = async () => {
  const { data } = await api.get('/v1/teacher-attendance/all')
  return data
}

export const getTeacherAttendanceMatrixById = async (teacherId) => {
  const { data } = await api.get(`/v1/teacher-attendance/by-id/${teacherId}`)
  return data
}

export const writeTeacherAttendanceToday = async (payload) => {
  const { data } = await api.post('/writeteacherattendance/today', payload)
  return data
}

export const writeTeacherAttendanceForDate = async (date, payload) => {
  const { data } = await api.post(`/writeteacherattendance/${date}`, payload)
  return data
}

export const getTeacherMonthlySummaryById = async (teacherId, month) => {
  const { data } = await api.get('/getteacherattendance/monthly-summary', {
    params: {
      teacherId,
      month,
    },
  })
  return data
}

export const getAllTeachersMonthlySummary = async (month) => {
  const { data } = await api.get('/getteacherattendance/all-monthly-summary', {
    params: { month },
  })
  return data
}
