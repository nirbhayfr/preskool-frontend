import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  recordTransportHistory,
  getAllTransportHistory,
  getStudentTransportHistory,
  getTransportHistorySummary,
  getOwnerTransportReport,
  getStudentsTransportReport,
  getStudentTransportReport,
} from '@/api/transportHistory'

export const useRecordTransportHistory = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: recordTransportHistory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transport-history'] })
    },
  })
}

export const useTransportHistory = (params) =>
  useQuery({
    queryKey: ['transport-history', params],
    queryFn: () => getAllTransportHistory(params),
    enabled: !!params?.academicYear,
  })

export const useStudentTransportHistory = (params) =>
  useQuery({
    queryKey: ['transport-history-student', params],
    queryFn: () => getStudentTransportHistory(params),
    enabled: !!params?.studentId && !!params?.academicYear,
  })

export const useTransportHistorySummary = (academicYear) =>
  useQuery({
    queryKey: ['transport-history-summary', academicYear],
    queryFn: () => getTransportHistorySummary(academicYear),
    enabled: !!academicYear,
  })

export const useOwnerTransportReport = () =>
  useQuery({
    queryKey: ['transport-report-owner'],
    queryFn: getOwnerTransportReport,
  })

export const useStudentsTransportReport = () =>
  useQuery({
    queryKey: ['transport-report-students'],
    queryFn: getStudentsTransportReport,
  })

export const useStudentTransportReport = (params) =>
  useQuery({
    queryKey: ['transport-report-student', params],
    queryFn: () => getStudentTransportReport(params),
    enabled: !!params?.studentId,
  })
