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

export const createFeeSubmissionHelper = async (payload) => {
  const { data } = await api.post('/fee-submissions', payload)
  return data
}

export const updateFeeSubmissionHelper = async ({ id, ...payload }) => {
  const { data } = await api.put(`/fee-submissions/${id}`, payload)
  return data
}

export const deleteFeeSubmission = async (id) => {
  const { data } = await api.delete(`/fee-submissions/${id}`)
  return data
}

export const fetchFeeCollectionByDate = async (date) => {
  const { data } = await api.get('/fee-collection-by-date', {
    params: { date },
  })

  return data
}

export const deductFeesHelper = async (payload) => {
  const { data } = await api.post('/fees/deduct', payload)
  return data
}
