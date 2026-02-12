import { useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { useParams } from 'react-router-dom'
import { useExamResultsByStudent } from '@/hooks/useExamResults'
import { Skeleton } from '../ui/skeleton'
import ExamTypeTable from './ExamTypeTable'

function ExamsResultsCard() {
  const { id } = useParams()
  const { data: result, isLoading, isError } = useExamResultsByStudent(id)

  /* ------------------ Group By Exam Type ------------------ */
  const groupedResults = useMemo(() => {
    if (!result?.data) return {}

    return result.data.reduce((acc, curr) => {
      const examType = curr.ExamType || 'Unknown'
      if (!acc[examType]) acc[examType] = []
      acc[examType].push(curr)
      return acc
    }, {})
  }, [result])

  if (isLoading) return <ExamsResultsSkeleton />
  if (isError) return <p>Failed to load student results</p>
  if (!result?.data?.length)
    return <p className="text-muted-foreground">No results available.</p>

  return (
    <div className="space-y-6">
      {Object.entries(groupedResults).map(([examType, examData]) => (
        <ExamTypeTable key={examType} examType={examType} examData={examData} />
      ))}
    </div>
  )
}

export default ExamsResultsCard

function ExamsResultsSkeleton() {
  return (
    <Card className="rounded-sm">
      <div className="p-6 space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-40 w-full" />
      </div>
    </Card>
  )
}
