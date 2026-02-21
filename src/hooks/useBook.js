import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getBooks, getBookById, createBook, updateBook, deleteBook } from '@/api/book'

// Get all books
export const useBooks = () =>
  useQuery({
    queryKey: ['books'],
    queryFn: getBooks,
  })

// Get book by id
export const useBookById = (id) =>
  useQuery({
    queryKey: ['books', id],
    queryFn: () => getBookById(id),
    enabled: !!id,
  })

// Create book
export const useCreateBook = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['books'] })
    },
  })
}

// Update book
export const useUpdateBook = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: updateBook,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['books'] })
    },
  })
}

// Delete book
export const useDeleteBook = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['books'] })
    },
  })
}
