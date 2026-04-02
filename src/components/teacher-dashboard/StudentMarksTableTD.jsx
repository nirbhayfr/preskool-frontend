import { useMemo } from 'react'
import { Card } from '@/components/ui/card'

import { useExamResults } from '@/hooks/useExamResults'
import { Skeleton } from '../ui/skeleton'
import ExamTypeTable from '../student-details/ExamTypeTable'
import { decryptData } from '@/utils/crypto'

export default function StudentMarksTable() {
  const user = useMemo(() => {
    try {
      const encrypted = localStorage.getItem('user')
      return encrypted ? decryptData(encrypted) : null
    } catch {
      return null
    }
  }, [])
  const { data: result, isLoading, isError } = useExamResults()

  /* ------------------ Group By Exam Type ------------------ */
  const groupedResults = useMemo(() => {
    if (!result?.data) return {}

    const filtered = result.data.filter((item) => {
      const classMatch = user?.Class ? item.Class === user.Class : true
      const sectionMatch = user?.Section ? item.Section === user.Section : true
      return classMatch && sectionMatch
    })

    return filtered.reduce((acc, curr) => {
      const examType = curr.ExamType || 'Unknown'
      if (!acc[examType]) acc[examType] = []
      acc[examType].push(curr)
      return acc
    }, {})
  }, [result, user])

  if (isLoading) return <ExamsResultsSkeleton />
  if (isError) return <p>Failed to load student results</p>
  if (!result?.data?.length)
    return <p className="text-muted-foreground">No results available.</p>

  console.log(result)

  return (
    <div className="space-y-6 max-h-112 overflow-y-auto">
      {Object.entries(groupedResults).map(([examType, examData]) => (
        <ExamTypeTable key={examType} examType={examType} examData={examData} />
      ))}
    </div>
  )
}

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
