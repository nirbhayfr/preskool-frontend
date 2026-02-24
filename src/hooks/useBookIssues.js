import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createBookIssue,
  getBookIssues,
  getBookIssueById,
  updateBookIssue,
  deleteBookIssue,
} from '@/api/bookIssues'

/* ------------------ GET ALL ------------------ */
export const useBookIssues = (month) => {
  return useQuery({
    queryKey: ['book-issues', month],
    queryFn: () => getBookIssues(month),
  })
}

/* ------------------ GET BY ID ------------------ */
export const useBookIssue = (id) => {
  return useQuery({
    queryKey: ['book-issue', id],
    queryFn: () => getBookIssueById(id),
    enabled: !!id,
  })
}

/* ------------------ CREATE ------------------ */
export const useCreateBookIssue = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createBookIssue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['book-issues'] })
    },
  })
}

/* ------------------ UPDATE ------------------ */
export const useUpdateBookIssue = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateBookIssue,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['book-issues'] })
      queryClient.invalidateQueries({
        queryKey: ['book-issue', variables.id],
      })
    },
  })
}

/* ------------------ DELETE ------------------ */
export const useDeleteBookIssue = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteBookIssue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['book-issues'] })
    },
  })
}
