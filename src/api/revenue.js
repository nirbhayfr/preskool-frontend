import api from './api'

export const fetchSessionRevenue = async () => {
  const { data } = await api.get('/revenue/session-revenue')

  return data
}

export const fetchDailyCollection = async ({ fromDate, toDate }) => {
  const { data } = await api.get('/revenue/daily-collection', {
    params: {
      fromDate,
      toDate,
    },
  })

  return data
}
