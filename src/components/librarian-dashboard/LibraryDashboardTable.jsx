'use client'

import * as React from 'react'
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Spinner } from '../ui/spinner'

const borrowedBooks = [
  {
    id: 'B001',
    book: 'Harry Potter',
    isbn: '9780439136365',
    member: 'Janet Doe',
    borrowDate: '2026-02-01',
    returnDate: '2026-02-10',
    dueDate: '2026-02-08',
    status: 'Overdue',
  },
  {
    id: 'B002',
    book: 'Clean Code',
    isbn: '9780132350884',
    member: 'John Smith',
    borrowDate: '2026-02-05',
    returnDate: '2026-02-15',
    dueDate: '2026-02-15',
    status: 'Returned',
  },
  {
    id: 'B003',
    book: 'Atomic Habits',
    isbn: '9780735211292',
    member: 'Ravi Kumar',
    borrowDate: '2026-02-07',
    returnDate: null,
    dueDate: '2026-02-14',
    status: 'Pending',
  },
]

const columns = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'book', header: 'Book' },
  { accessorKey: 'isbn', header: 'ISBN' },
  { accessorKey: 'member', header: 'Member' },
  { accessorKey: 'borrowDate', header: 'Borrow Date' },
  { accessorKey: 'returnDate', header: 'Return Date' },
  { accessorKey: 'dueDate', header: 'Due Date' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status
      let color = 'bg-gray-400 text-white'

      if (status === 'Returned') color = 'bg-emerald-500 text-white'
      else if (status === 'Overdue') color = 'bg-red-500 text-white'
      else if (status === 'Pending') color = 'bg-yellow-500 text-white'

      return <Badge className={color}>{status}</Badge>
    },
  },
]

export default function LibraryDashboardTable() {
  const table = useReactTable({
    data: borrowedBooks,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const [isbn, setIsbn] = React.useState('')
  const [bookData, setBookData] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  const searchBook = async () => {
    if (!isbn) return
    setLoading(true)
    setError('')
    setBookData(null)
    try {
      const res = await fetch(
        `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`
      )
      const data = await res.json()
      const key = `ISBN:${isbn}`
      if (data[key]) {
        const book = data[key]
        setBookData(book)
      } else {
        setError('No results found')
      }
    } catch (err) {
      setError('Error fetching book data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
      {/* Left Column - ISBN Search */}
      <Card className="lg:col-span-3 p-4">
        <CardHeader>
          <CardTitle>Search Book by ISBN</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter ISBN number"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
            />
            <Button onClick={searchBook}>Search</Button>
          </div>

          {loading && (
            <div className="flex items-center justify-center">
              <Spinner className="size-16" />
            </div>
          )}
          {error && <p className="text-red-500">{error}</p>}
          {bookData && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <Card className="w-96 p-6 shadow-lg relative rounded-sm">
                {/* Close button */}
                <button
                  onClick={() => setBookData(null)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                >
                  ✕
                </button>

                {bookData.cover?.medium && (
                  <img
                    src={bookData.cover.medium}
                    alt={bookData.title}
                    className="w-32 h-auto mx-auto mb-4"
                  />
                )}

                <h3 className="font-bold text-xl text-center mb-2">{bookData.title}</h3>

                <div className="space-y-1 text-sm">
                  <p>
                    <strong>Author(s):</strong>{' '}
                    {bookData.authors?.map((a) => a.name).join(', ') || 'N/A'}
                  </p>
                  <p>
                    <strong>Publisher:</strong>{' '}
                    {bookData.publishers?.map((p) => p.name).join(', ') || 'N/A'}
                  </p>
                  <p>
                    <strong>Publish Year:</strong> {bookData.publish_date || 'N/A'}
                  </p>
                  <p>
                    <strong>Pages:</strong> {bookData.number_of_pages || 'N/A'}
                  </p>
                </div>
              </Card>
            </div>
          )}
          {bookData && (
            <h3 className="font-bold text-xl text-center mb-2">{bookData.title}</h3>
          )}
          {/* Instructions / placeholder */}
          {!bookData && !loading && !error && (
            <Card className="p-4 shadow-sm mt-4 text-sm text-muted-foreground bg-muted rounded-sm">
              <p className="mb-1">
                🔍 Enter an ISBN number above and click <strong>Search</strong> to find
                book details.
              </p>
              <p className="mb-1">
                Example: <code>9780439136365</code> for <em>Harry Potter</em>.
              </p>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Right Column - Borrowed Books Table */}
      <Card className="lg:col-span-7 rounded-sm">
        <CardHeader>
          <CardTitle>Borrowed Books</CardTitle>
        </CardHeader>
        <CardContent className="max-h-96 overflow-y-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
