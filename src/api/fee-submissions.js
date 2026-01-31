import api from './api'

export const getAllFeeSubmissions = async () => {
  const { data } = await api.get('/fee-submissions')
  return data
}

export const getFeeSubmissionsByStudent = async (studentId) => {
  const { data } = await api.get(`/fee-submissions/student/${studentId}`)
  return data
}

export const getFeeSubmissionByTransaction = async (transactionId) => {
  const { data } = await api.get(`/fee-submissions/transaction/${transactionId}`)
  return data
}

export const createFeeSubmission = async (payload) => {
  const { data } = await api.post('/fee-submissions', payload)
  return data
}

export const deleteFeeSubmission = async (id) => {
  const { data } = await api.delete(`/fee-submissions/${id}`)
  return data
}
