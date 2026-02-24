import api from './api'

// Create
export const createBookIssue = async (payload) => {
  const { data } = await api.post('/book-issues', payload)
  return data
}

// Get All (optional month filter)
export const getBookIssues = async (month) => {
  const { data } = await api.get('/book-issues', {
    params: month ? { month } : {},
  })
  return data
}

// Get By ID
export const getBookIssueById = async (id) => {
  const { data } = await api.get(`/book-issues/${id}`)
  return data
}

// Update
export const updateBookIssue = async ({ id, payload }) => {
  const { data } = await api.put(`/book-issues/${id}`, payload)
  return data
}

// Delete
export const deleteBookIssue = async (id) => {
  const { data } = await api.delete(`/book-issues/${id}`)
  return data
}
