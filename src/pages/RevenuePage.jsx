import { useMemo, useState } from 'react'
import { useDailyCollection } from '@/hooks/useRevenue'
import { useFeeCollectionByDate } from '@/hooks/useFeeSubmissions'

import TableLayout from '@/components/layout/Table'
import { CircleLoader } from '@/components/layout/RouteLoader'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'

export default function RevenueListPage() {
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [selectedDate, setSelectedDate] = useState('')

  /* DAILY COLLECTION */
  const {
    data: dailyData,
    isLoading: dailyLoading,
    isError: dailyError,
    error: dailyErrorMessage,
    refetch,
  } = useDailyCollection(fromDate, toDate)

  const dailyCollection = dailyData?.data || []

  const filledDailyCollection = useMemo(() => {
    if (!fromDate || !toDate) return dailyCollection

    const map = new Map()

    dailyCollection.forEach((item) => {
      const key = new Date(item.Date).toISOString().split('T')[0]
      map.set(key, item)
    })

    const start = new Date(fromDate)
    const end = new Date(toDate)

    const result = []

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().split('T')[0]

      if (map.has(key)) {
        result.push(map.get(key))
      } else {
        result.push({
          Date: key,
          FeeCollection: 0,
          FineCollection: 0,
          TotalCollection: 0,
        })
      }
    }

    return result
  }, [dailyCollection, fromDate, toDate])

  /* FEE COLLECTION BY DATE */
  const {
    data: feeData,
    isLoading: feeLoading,
    isError: feeError,
    error: feeErrorMessage,
  } = useFeeCollectionByDate(selectedDate)

  const feeCollection = feeData?.data || []

  /* DAILY TABLE */
  const dailyColumns = [
    {
      accessorKey: 'Date',
      header: 'Date',
      cell: ({ row }) => new Date(row.original.Date).toLocaleDateString(),
    },
    {
      accessorKey: 'FeeCollection',
      header: 'Fee Collection',
      cell: ({ row }) => (
        <span className="text-blue-600 font-medium">₹ {row.original.FeeCollection}</span>
      ),
    },
    {
      accessorKey: 'FineCollection',
      header: 'Fine Collection',
      cell: ({ row }) => (
        <span className="text-orange-600 font-medium">
          ₹ {row.original.FineCollection}
        </span>
      ),
    },
    {
      accessorKey: 'TotalCollection',
      header: 'Total',
      cell: ({ row }) => (
        <span className="font-semibold">₹ {row.original.TotalCollection}</span>
      ),
    },
  ]

  /* FEE COLLECTION TABLE */

  const feeColumns = [
    {
      accessorKey: 'TransactionID',
      header: 'Transaction',
    },
    {
      accessorKey: 'StudentID',
      header: 'Student',
    },
    {
      accessorKey: 'FeeType',
      header: 'Fee Type',
    },
    {
      accessorKey: 'OriginalAmount',
      header: 'Original Amount',
      cell: ({ row }) => `₹ ${row.original.OriginalAmount}`,
    },
    {
      accessorKey: 'DiscountAmount',
      header: 'Discount',
      cell: ({ row }) => `₹ ${row.original.DiscountAmount}`,
    },
    {
      accessorKey: 'PaidAmount',
      header: 'Paid Amount',
      cell: ({ row }) => (
        <span className="font-semibold text-green-600">₹ {row.original.PaidAmount}</span>
      ),
    },
    {
      accessorKey: 'PaymentMode',
      header: 'Mode',
    },
    {
      accessorKey: 'SubmittedBy',
      header: 'Submitted By',
    },
  ]

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-semibold tracking-tight">Revenue Overview</h2>

      {/* DAILY COLLECTION */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle>Collection By Date</CardTitle>

          <div className="flex gap-3">
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-[160px]"
            />

            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-[160px]"
            />

            <Button variant="outline" onClick={refetch}>
              Apply
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {dailyLoading ? (
            <div className="flex justify-center py-10">
              <CircleLoader />
            </div>
          ) : dailyError ? (
            <Alert variant="destructive">
              <AlertDescription>
                Failed to load data. {dailyErrorMessage?.message}
              </AlertDescription>
            </Alert>
          ) : dailyCollection.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No collection data found
            </div>
          ) : (
            <TableLayout columns={dailyColumns} data={filledDailyCollection} />
          )}
        </CardContent>
      </Card>

      {/* FEE COLLECTION BY DATE */}

      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle>Daily Fee Collection</CardTitle>

          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-[160px]"
          />
        </CardHeader>

        <CardContent>
          {feeLoading ? (
            <div className="flex justify-center py-10">
              <CircleLoader />
            </div>
          ) : feeError ? (
            <Alert variant="destructive">
              <AlertDescription>
                Failed to load fee collection. {feeErrorMessage?.message}
              </AlertDescription>
            </Alert>
          ) : feeCollection.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No fee submissions found
            </div>
          ) : (
            <TableLayout columns={feeColumns} data={feeCollection} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
