// pages/BookIssues.jsx

import { CircleLoader } from '@/components/layout/RouteLoader'
import TableLayout from '@/components/layout/Table'
import BookIssuesHeader from '@/components/book-issues/BookIssueHeader'
import { bookIssuesColumns } from '@/components/book-issues/BookIssueColumns'
import {
  useBookIssues,
  useDeleteBookIssue,
  useUpdateBookIssue,
} from '@/hooks/useBookIssues'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import EditBookIssueModal from '@/components/book-issues/EditBookIssueModal'

function BookIssues() {
  const [searchQuery, setSearchQuery] = useState('')
  const getCurrentMonth = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    return `${year}-${month}`
  }
  const [monthFilter, setMonthFilter] = useState(getCurrentMonth())
  const updateMutation = useUpdateBookIssue()
  const [selectedIssue, setSelectedIssue] = useState(null)
  const [isEditOpen, setIsEditOpen] = useState(false)

  const { data, isLoading, error } = useBookIssues(monthFilter)

  const deleteMutation = useDeleteBookIssue()

  const displayedIssues = useMemo(() => {
    if (!data?.data) return []

    let issues = [...data.data]

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      issues = issues.filter(
        (i) =>
          i.BookTitle?.toLowerCase().includes(q) ||
          i.IssuedToType?.toLowerCase().includes(q) ||
          i.CreatedBy?.toLowerCase().includes(q)
      )
    }

    return issues
  }, [data, searchQuery])

  const handleDelete = async (id) => {
    try {
      await deleteMutation.mutateAsync(id)
      toast.success('Issue deleted successfully')
    } catch {
      toast.error('Failed to delete issue')
    }
  }

  const handleEdit = (issue) => {
    setSelectedIssue(issue)
    setIsEditOpen(true)
  }

  const handleUpdate = (formData) => {
    console.log(selectedIssue.IssueId)
    console.log(formData)
    updateMutation.mutate(
      {
        id: selectedIssue.IssueId,
        payload: formData,
      },
      {
        onSuccess: () => {
          toast.success('Issue updated successfully')
          setIsEditOpen(false)
          setSelectedIssue(null)
        },
        onError: () => {
          toast.error('Update failed')
        },
      }
    )
  }

  if (isLoading) return <CircleLoader />
  if (error) return <div>Error loading issues</div>

  return (
    <section className="p-6">
      <BookIssuesHeader
        onSearch={setSearchQuery}
        onMonthChange={setMonthFilter}
        month={monthFilter}
      />

      <TableLayout
        columns={bookIssuesColumns(handleDelete, handleEdit)}
        data={displayedIssues}
      />

      <EditBookIssueModal
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        issue={selectedIssue}
        onSubmit={handleUpdate}
        loading={updateMutation.isPending}
      />
    </section>
  )
}

export default BookIssues
