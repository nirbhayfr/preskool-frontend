import api from './api'

export const getTeacherSalaries = async () => {
  const { data } = await api.get('/teacher-salary')
  return data
}

export const getTeacherSalaryListById = async (id) => {
  const { data } = await api.get(`/teacher-salary/${id}`)
  return data.data
}

export const createTeacherSalary = async (payload) => {
  const { data } = await api.post('/teacher-salary', payload)
  return data
}

export const updateTeacherSalary = async ({ id, payload }) => {
  const { data } = await api.put(`/teacher-salary/${id}`, payload)
  return data
}

export const deleteTeacherSalary = async (id) => {
  const { data } = await api.delete(`/teacher-salary/${id}`)
  return data
}
