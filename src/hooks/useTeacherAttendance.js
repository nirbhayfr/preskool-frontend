import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getTeacherAttendanceToday,
  getTeacherAttendanceMatrixAll,
  getTeacherAttendanceMatrixById,
  writeTeacherAttendanceToday,
  writeTeacherAttendanceForDate,
  getTeacherMonthlySummaryById,
  getAllTeachersMonthlySummary,
} from '@/api/teacherAttendance'

export const useTeacherAttendanceToday = () => {
  return useQuery({
    queryKey: ['teacher-attendance', 'today'],
    queryFn: getTeacherAttendanceToday,
  })
}

export const useTeacherAttendanceMatrixAll = () => {
  return useQuery({
    queryKey: ['teacher-attendance', 'matrix', 'all'],
    queryFn: getTeacherAttendanceMatrixAll,
  })
}

export const useTeacherAttendanceMatrixById = (teacherId) => {
  return useQuery({
    queryKey: ['teacher-attendance', 'matrix', teacherId],
    queryFn: () => getTeacherAttendanceMatrixById(teacherId),
    enabled: !!teacherId,
  })
}

export const useWriteTeacherAttendanceToday = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: writeTeacherAttendanceToday,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['teacher-attendance'] })
    },
  })
}

export const useWriteTeacherAttendanceForDate = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ date, payload }) => writeTeacherAttendanceForDate(date, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['teacher-attendance'] })
    },
  })
}

export const useTeacherMonthlySummaryById = (teacherId, month) =>
  useQuery({
    queryKey: ['teacher-attendance', 'summary', teacherId, month],
    queryFn: () => getTeacherMonthlySummaryById(teacherId, month),
    enabled: !!teacherId && !!month,
  })

export const useAllTeachersMonthlySummary = (month) =>
  useQuery({
    queryKey: ['teacher-attendance', 'summary', 'all', month],
    queryFn: () => getAllTeachersMonthlySummary(month),
    enabled: !!month,
  })
