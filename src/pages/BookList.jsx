import { CircleLoader } from '@/components/layout/RouteLoader'
import TableLayout from '@/components/layout/Table'
import BooksHeader from '@/components/book-list/BooksHeader'
import { booksColumns } from '@/components/book-list/BooksColumns'
import EditBookModal from '@/components/book-list/EditBookModal'
import { useBooks, useCreateBook, useUpdateBook } from '@/hooks/useBook'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { QueryClient } from '@tanstack/react-query'
import AddBookModal from '@/components/book-list/AddBookModal'
import AddByIsbnModal from '@/components/book-list/AddByIsbnModal'

function BookList() {
  const { data, isLoading, error } = useBooks()
  const updateMutation = useUpdateBook()
  const createMutation = useCreateBook()

  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState('title_asc')
  const [statusFilter, setStatusFilter] = useState(null)

  const [selectedBook, setSelectedBook] = useState(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isIsbnOpen, setIsIsbnOpen] = useState(false)

  const handleEdit = (book) => {
    setSelectedBook(book)
    setIsEditOpen(true)
  }

  const displayedBooks = useMemo(() => {
    if (!data?.data) return []

    let books = [...data.data]

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      books = books.filter(
        (b) =>
          b.BookTitle?.toLowerCase().includes(q) ||
          b.AuthorName?.toLowerCase().includes(q) ||
          b.ISBN?.toLowerCase().includes(q)
      )
    }

    if (statusFilter) {
      books = books.filter((b) => b.Status === statusFilter)
    }

    books.sort((a, b) =>
      sortOrder === 'title_asc'
        ? (a.BookTitle || '').localeCompare(b.BookTitle || '')
        : (b.BookTitle || '').localeCompare(a.BookTitle || '')
    )

    return books
  }, [data, searchQuery, sortOrder, statusFilter])

  const handleUpdateBook = (formData) => {
    updateMutation.mutate(
      {
        id: selectedBook.BookId,
        data: {
          bookId: selectedBook.BookId,
          isbn: formData.ISBN,
          bookTitle: formData.BookTitle,
          authorName: formData.AuthorName,
          publisherName: formData.PublisherName,
          category: formData.Category,
          language: formData.Language,
          edition: formData.Edition,
          publishYear: formData.PublishYear,
          totalCopies: formData.TotalCopies,
          availableCopies: formData.AvailableCopies,
          issuedCopies: formData.IssuedCopies,
          rackLocation: formData.RackLocation,
          purchaseDate: formData.PurchaseDate,
          purchasePrice: formData.PurchasePrice,
          vendorName: formData.VendorName,
          status: formData.Status,
          bookImage: formData.BookImage,
        },
      },
      {
        onSuccess: () => {
          toast.success('Book updated successfully')
          setIsEditOpen(false)
          setSelectedBook(null)
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message || 'Update failed')
        },
      }
    )
  }

  const handleAddBook = (formData) => {
    createMutation.mutate(
      {
        isbn: formData.ISBN,
        bookTitle: formData.BookTitle,
        authorName: formData.AuthorName,
        publisherName: formData.PublisherName,
        category: formData.Category,
        language: formData.Language,
        edition: formData.Edition,
        publishYear: formData.PublishYear,
        totalCopies: formData.TotalCopies,
        availableCopies: formData.AvailableCopies,
        issuedCopies: formData.IssuedCopies || 0,
        rackLocation: formData.RackLocation,
        purchaseDate: formData.PurchaseDate,
        purchasePrice: formData.PurchasePrice,
        vendorName: formData.VendorName,
        status: formData.AvailableCopies > 0 ? 'Available' : 'Not Available',
        bookImage: formData.BookImage,
      },
      {
        onSuccess: () => {
          toast.success('Book added successfully')
          setIsAddOpen(false)
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message || 'Failed to add book')
        },
      }
    )
  }

  if (isLoading) return <CircleLoader />
  if (error) return <div>Error loading books</div>

  console.log(data)

  return (
    <section className="p-6 capitalize">
      <BooksHeader
        onSearch={setSearchQuery}
        onSortChange={setSortOrder}
        onFilterChange={setStatusFilter}
        setIsAddOpen={setIsAddOpen}
        setIsIsbnOpen={setIsIsbnOpen}
      />

      <TableLayout columns={booksColumns(handleEdit)} data={displayedBooks} />

      <EditBookModal
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        book={selectedBook}
        onSubmit={handleUpdateBook}
        loading={updateMutation.isPending}
      />

      <AddBookModal
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAddBook}
        loading={createMutation.isPending}
      />

      <AddByIsbnModal
        open={isIsbnOpen}
        onClose={() => setIsIsbnOpen(false)}
        onSubmit={handleAddBook}
      />
    </section>
  )
}

export default BookList
