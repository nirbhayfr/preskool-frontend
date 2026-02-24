import api from './api'

export const getPendingFees = async (params) => {
  const res = await api.get('/pending-fees', {
    params: {
      StudentID: params.StudentID || undefined,
      ClassID: params.ClassID || undefined,
      SectionID: params.SectionID || undefined,
    },
  })

  return res.data
}
