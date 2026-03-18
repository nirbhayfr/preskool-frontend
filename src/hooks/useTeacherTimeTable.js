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
import { useMemo } from 'react'
import api from '@/api/api'

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

// ✅ Fetches ALL days ONCE and caches — never refetches on day change
const useTeacherTimeTableAll = (teacherId) => {
  return useQuery({
    queryKey: ['teacherTimeTable', teacherId, 'all'],
    queryFn: async () => {
      if (!teacherId) return []
      const res = await api.get(`/teacher-timetable/teacher/${teacherId}`)
      return res?.data?.data || []
    },
    enabled: !!teacherId,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  })
}

// ✅ Filters client-side — zero network cost when switching day tabs
export const useTeacherTimeTableByTeacher = (teacherId, selectedDay) => {
  const { data: allData = [], isLoading, isError } = useTeacherTimeTableAll(teacherId)

  const data = useMemo(() => {
    if (!selectedDay || !Array.isArray(allData)) return []
    return allData.filter(
      (item) => item.DayOfWeek?.trim().toLowerCase() === selectedDay.trim().toLowerCase()
    )
  }, [allData, selectedDay])

  return { data, isLoading, isError }
}
