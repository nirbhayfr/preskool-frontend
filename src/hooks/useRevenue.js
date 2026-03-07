import { useQuery } from '@tanstack/react-query'
import { fetchDailyCollection, fetchSessionRevenue } from '@/api/revenue'

export const useSessionRevenue = () => {
  return useQuery({
    queryKey: ['session-revenue'],
    queryFn: fetchSessionRevenue,
    // staleTime: 1000 * 60 * 5,
  })
}

export const useDailyCollection = (fromDate, toDate) => {
  return useQuery({
    queryKey: ['daily-collection', fromDate, toDate],
    queryFn: () => fetchDailyCollection({ fromDate, toDate }),
    enabled: !!fromDate && !!toDate,
    // staleTime: 1000 * 60 * 5,
  })
}
