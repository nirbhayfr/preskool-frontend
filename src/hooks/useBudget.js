import { getClasswiseBudget } from '@/api/budget'
import { useQuery } from '@tanstack/react-query'

export const useClasswiseBudget = () =>
  useQuery({
    queryKey: ['budget'],
    queryFn: getClasswiseBudget,
  })
