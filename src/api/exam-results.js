import api from './api'

export const getAllExamResults = async () => {
  const { data } = await api.get('/exam-results')
  return data
}

export const getExamResultsByStudent = async (studentId) => {
  const { data } = await api.get(`/exam-results/by-student/${studentId}`)
  return data
}

export const getExamResultById = async (id) => {
  const { data } = await api.get(`/exam-results/${id}`)
  return data
}

export const createExamResult = async (payload) => {
  const { data } = await api.post('/exam-results', payload)
  return data
}

export const updateExamResult = async (id, payload) => {
  const { data } = await api.put(`/exam-results/${id}`, payload)
  return data
}

export const deleteExamResult = async (id) => {
  const { data } = await api.delete(`/exam-results/${id}`)
  return data
}
