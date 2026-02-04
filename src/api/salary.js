import api from './api'

/* ---------- GET ---------- */

export const getAllSalaries = async () => {
  const response = await api.get('/salary/all')
  return response.data
}

export const getTeacherSalaryById = async (teacherId) => {
  const response = await api.get(`/salary/teacher/${teacherId}`)
  return response.data
}

export const getStaffSalaryById = async (staffId) => {
  const response = await api.get(`/salary/staff/${staffId}`)
  return response.data
}

/* ---------- UPDATE ---------- */

export const updateTeacherSalary = async (id, data) => {
  const response = await api.put(`/salary/teacher/${id}`, data)
  return response.data
}

export const updateStaffSalary = async (id, data) => {
  const response = await api.put(`/salary/staff/${id}`, data)
  return response.data
}
