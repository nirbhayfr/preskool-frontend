import api from './api'

export const getClassTimetable = async ({ classId, sectionId }) => {
  const response = await api.get('/classtimetable', {
    params: {
      classId,
      ...(sectionId && { sectionId }), // ✅ only send if exists
    },
  })
  return response.data
}
