import api from './api'

// Get all books
export const getBooks = async () => {
  const response = await api.get('/books')
  return response.data
}

// Get book by id
export const getBookById = async (id) => {
  const response = await api.get(`/books/${id}`)
  return response.data
}

// Create book
export const createBook = async (data) => {
  const response = await api.post('/books', data)
  return response.data
}

// Update book
export const updateBook = async ({ id, data }) => {
  const response = await api.put(`/books/${id}`, data)
  return response.data
}

// Delete book
export const deleteBook = async (id) => {
  const response = await api.delete(`/books/${id}`)
  return response.data
}
