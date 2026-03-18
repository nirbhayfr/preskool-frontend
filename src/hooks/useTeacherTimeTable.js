/* eslint-disable no-unused-vars */
import {
  getAllTeacherTimeTable,
  getTeacherTimeTableById,
  createTeacherTimeTable,
  updateTeacherTimeTable,
  deleteTeacherTimeTable,
  getTeacherTimeTableByTeacherId,
} from '@/api/teacherTimeTable'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/api/api' // 👈 ADD THIS

export const useTeacherTimeTables = () =>
  useQuery({
    queryKey: ['teacherTimeTables'],
    queryFn: getAllTeacherTimeTable,
  })

export const useTeacherTimeTable = (id) =>
  useQuery({
    queryKey: ['teacherTimeTable', id],
    queryFn: () => getTeacherTimeTableById(id),
    enabled: !!id,
  })

export const useCreateTeacherTimeTable = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTeacherTimeTable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacherTimeTables'] })
    },
  })
}

export const useUpdateTeacherTimeTable = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateTeacherTimeTable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacherTimeTables'] })
    },
  })
}

export const useDeleteTeacherTimeTable = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteTeacherTimeTable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacherTimeTables'] })
    },
  })
}

export const useTeacherTimeTableByTeacher = (teacherId) => {
  return useQuery({
    queryKey: ['teacherTimeTable', teacherId],
    queryFn: async () => {
      if (!teacherId) return []

      const res = await api.get(`/teacher-timetable/teacher/${teacherId}`)
      return res?.data?.data || []
    },
    enabled: !!teacherId,
    retry: false,
    refetchOnWindowFocus: false,
  })
}
