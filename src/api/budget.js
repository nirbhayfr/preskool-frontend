import api from './api'

export const getClasswiseBudget = async () => {
  const response = await api.get('/classwise-budget')
  return response.data
}
