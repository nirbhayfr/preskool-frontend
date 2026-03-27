import { useMemo, useState } from 'react'
import { useDailyCollection } from '@/hooks/useRevenue'
import { useFeeCollectionByDate } from '@/hooks/useFeeSubmissions'

import TableLayout from '@/components/layout/Table'
import { CircleLoader } from '@/components/layout/RouteLoader'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { Download, FileText } from 'lucide-react'

const pdfStyles = StyleSheet.create({
  page: { padding: 30, fontSize: 9, fontFamily: 'Helvetica' },
  title: { fontSize: 14, fontFamily: 'Helvetica-Bold', marginBottom: 4 },
  subtitle: { fontSize: 9, color: '#666', marginBottom: 16 },
  table: { border: '0.5pt solid #ddd' },
  headerRow: { flexDirection: 'row', backgroundColor: '#f3f4f6' },
  row: { flexDirection: 'row', borderTop: '0.5pt solid #ddd' },
  cell: { padding: '5 8', flex: 1 },
  headerCell: { padding: '5 8', flex: 1, fontFamily: 'Helvetica-Bold' },
  totalsRow: { flexDirection: 'row', marginTop: 12, gap: 8 },
  totalBox: { flex: 1, border: '0.5pt solid #ddd', padding: '6 8', borderRadius: 4 },
  totalLabel: { fontSize: 8, color: '#666', marginBottom: 2 },
  totalValue: { fontSize: 10, fontFamily: 'Helvetica-Bold' },
})

const DailyCollectionPDF = ({ data, totals, fromDate, toDate }) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      <Text style={pdfStyles.title}>Daily Collection Report</Text>
      <Text style={pdfStyles.subtitle}>
        {fromDate} to {toDate}
      </Text>

      {totals && (
        <View style={pdfStyles.totalsRow}>
          <View style={pdfStyles.totalBox}>
            <Text style={pdfStyles.totalLabel}>Fee Total</Text>
            <Text style={pdfStyles.totalValue}>Rs. {totals.fee.toLocaleString()}</Text>
          </View>
          <View style={pdfStyles.totalBox}>
            <Text style={pdfStyles.totalLabel}>Fine Total</Text>
            <Text style={pdfStyles.totalValue}>Rs. {totals.fine.toLocaleString()}</Text>
          </View>
          <View style={pdfStyles.totalBox}>
            <Text style={pdfStyles.totalLabel}>Grand Total</Text>
            <Text style={pdfStyles.totalValue}>Rs. {totals.total.toLocaleString()}</Text>
          </View>
        </View>
      )}

      <View style={[pdfStyles.table, { marginTop: 12 }]}>
        <View style={pdfStyles.headerRow}>
          {['Date', 'Fee Collection', 'Fine Collection', 'Total'].map((h) => (
            <Text key={h} style={pdfStyles.headerCell}>
              {h}
            </Text>
          ))}
        </View>
        {data.map((item, i) => (
          <View key={i} style={pdfStyles.row}>
            <Text style={pdfStyles.cell}>{new Date(item.Date).toLocaleDateString()}</Text>
            <Text style={pdfStyles.cell}>Rs. {item.FeeCollection}</Text>
            <Text style={pdfStyles.cell}>Rs. {item.FineCollection}</Text>
            <Text style={pdfStyles.cell}>Rs. {item.TotalCollection}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
)

const FeeCollectionPDF = ({ data, totals, date }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={pdfStyles.page}>
      <Text style={pdfStyles.title}>Fee Collection Report</Text>
      <Text style={pdfStyles.subtitle}>{date}</Text>

      {totals && (
        <View style={pdfStyles.totalsRow}>
          <View style={pdfStyles.totalBox}>
            <Text style={pdfStyles.totalLabel}>Original Amount</Text>
            <Text style={pdfStyles.totalValue}>
              Rs. {totals.original.toLocaleString()}
            </Text>
          </View>
          <View style={pdfStyles.totalBox}>
            <Text style={pdfStyles.totalLabel}>Discount</Text>
            <Text style={pdfStyles.totalValue}>
              Rs. {totals.discount.toLocaleString()}
            </Text>
          </View>
          <View style={pdfStyles.totalBox}>
            <Text style={pdfStyles.totalLabel}>Paid Amount</Text>
            <Text style={pdfStyles.totalValue}>Rs. {totals.paid.toLocaleString()}</Text>
          </View>
        </View>
      )}

      <View style={[pdfStyles.table, { marginTop: 12 }]}>
        <View style={pdfStyles.headerRow}>
          {[
            'Transaction',
            'Student',
            'Fee Type',
            'Original',
            'Discount',
            'Paid',
            'Mode',
            'By',
          ].map((h) => (
            <Text key={h} style={pdfStyles.headerCell}>
              {h}
            </Text>
          ))}
        </View>
        {data.map((item, i) => (
          <View key={i} style={pdfStyles.row}>
            <Text style={pdfStyles.cell}>{item.TransactionID}</Text>
            <Text style={pdfStyles.cell}>{item.StudentID}</Text>
            <Text style={pdfStyles.cell}>{item.FeeType}</Text>
            <Text style={pdfStyles.cell}>Rs. {item.OriginalAmount}</Text>
            <Text style={pdfStyles.cell}>Rs. {item.DiscountAmount}</Text>
            <Text style={pdfStyles.cell}>Rs. {item.PaidAmount}</Text>
            <Text style={pdfStyles.cell}>{item.PaymentMode}</Text>
            <Text style={pdfStyles.cell}>{item.SubmittedBy}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
)

export default function RevenueListPage() {
  const today = new Date()
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(today.getDate() - 7)

  const [fromDate, setFromDate] = useState(oneWeekAgo.toISOString().split('T')[0])
  const [toDate, setToDate] = useState(today.toISOString().split('T')[0])
  const [selectedDate, setSelectedDate] = useState(today.toISOString().split('T')[0])
  const [minAmount, setMinAmount] = useState('')

  /* DAILY COLLECTION */
  const {
    data: dailyData,
    isLoading: dailyLoading,
    isError: dailyError,
    error: dailyErrorMessage,
    refetch,
  } = useDailyCollection(fromDate, toDate)

  const dailyCollection = dailyData?.data || []

  /* FEE COLLECTION BY DATE */
  const {
    data: feeData,
    isLoading: feeLoading,
    isError: feeError,
    error: feeErrorMessage,
  } = useFeeCollectionByDate(selectedDate)

  const feeCollection = feeData?.data || []

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

  const filteredDailyCollection = useMemo(() => {
    let data = filledDailyCollection

    if (minAmount !== '') {
      data = data.filter((item) => item.TotalCollection >= Number(minAmount))
    }

    return data
  }, [filledDailyCollection, minAmount])

  const dailyTotals = useMemo(() => {
    if (!fromDate || !toDate) return null

    return filteredDailyCollection.reduce(
      (acc, curr) => {
        acc.fee += curr.FeeCollection
        acc.fine += curr.FineCollection
        acc.total += curr.TotalCollection
        return acc
      },
      { fee: 0, fine: 0, total: 0 }
    )
  }, [filteredDailyCollection, fromDate, toDate])

  const feeTotals = useMemo(() => {
    if (!selectedDate) return null

    return feeCollection.reduce(
      (acc, curr) => {
        acc.original += curr.OriginalAmount
        acc.discount += curr.DiscountAmount
        acc.paid += curr.PaidAmount
        return acc
      },
      { original: 0, discount: 0, paid: 0 }
    )
  }, [feeCollection, selectedDate])

  // ── CSV Export ──────────────────────────────────────────────────────────────
  const exportCSV = (data, columns, filename) => {
    const header = columns
      .filter((c) => c.accessorKey)
      .map((c) => c.header)
      .join(',')

    const rows = data.map((row) =>
      columns
        .filter((c) => c.accessorKey)
        .map((c) => {
          const val = row[c.accessorKey] ?? ''
          const s = String(val)
          return s.includes(',') || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s
        })
        .join(',')
    )

    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 10_000)
  }

  const exportDailyCSV = () =>
    exportCSV(
      filteredDailyCollection,
      dailyColumns,
      `daily-collection-${fromDate}-to-${toDate}.csv`
    )

  const exportFeeCSV = () => exportFeeCollectionCSV()

  const exportDailyPDF = async () => {
    const blob = await pdf(
      <DailyCollectionPDF
        data={filteredDailyCollection}
        totals={dailyTotals}
        fromDate={fromDate}
        toDate={toDate}
      />
    ).toBlob()
    const url = URL.createObjectURL(blob)
    window.open(url)
    setTimeout(() => URL.revokeObjectURL(url), 60_000)
  }

  const exportFeePDF = async () => {
    const blob = await pdf(
      <FeeCollectionPDF data={feeCollection} totals={feeTotals} date={selectedDate} />
    ).toBlob()
    const url = URL.createObjectURL(blob)
    window.open(url)
    setTimeout(() => URL.revokeObjectURL(url), 60_000)
  }

  const exportFeeCollectionCSV = () =>
    exportCSV(feeCollection, feeColumns, `fee-collection-${selectedDate}.csv`)

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
          <div className="flex flex-row gap-3 flex-wrap items-center">
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full sm:w-[160px]"
            />
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full sm:w-[160px]"
            />
            <Input
              type="number"
              placeholder="Min Amount"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              className="w-full sm:w-[140px]"
            />
            <Button variant="outline" onClick={refetch} className="w-full sm:w-auto">
              Apply
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportDailyCSV}
              disabled={filteredDailyCollection.length === 0}
              className="gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportDailyPDF}
              disabled={filteredDailyCollection.length === 0}
              className="gap-1.5"
            >
              <FileText className="h-3.5 w-3.5" />
              PDF
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
            <>
              {dailyTotals && (
                <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
                  <div className="rounded-md border bg-muted/40 p-3">
                    <p className="text-xs text-muted-foreground">Fee Total</p>
                    <p className="font-semibold text-blue-600">
                      ₹ {dailyTotals.fee.toLocaleString()}
                    </p>
                  </div>

                  <div className="rounded-md border bg-muted/40 p-3">
                    <p className="text-xs text-muted-foreground">Fine Total</p>
                    <p className="font-semibold text-orange-600">
                      ₹ {dailyTotals.fine.toLocaleString()}
                    </p>
                  </div>

                  <div className="rounded-md border bg-muted/40 p-3">
                    <p className="text-xs text-muted-foreground">Grand Total</p>
                    <p className="font-semibold">
                      ₹ {dailyTotals.total.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
              <TableLayout columns={dailyColumns} data={filteredDailyCollection} />
            </>
          )}
        </CardContent>
      </Card>

      {/* FEE COLLECTION BY DATE */}

      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle>Daily Fee Collection</CardTitle>
          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-[160px]"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={exportFeeCollectionCSV}
              disabled={feeCollection.length === 0}
              className="gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportFeePDF}
              disabled={feeCollection.length === 0}
              className="gap-1.5"
            >
              <FileText className="h-3.5 w-3.5" />
              PDF
            </Button>
          </div>
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
            <>
              {feeTotals && (
                <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
                  <div className="rounded-md border bg-muted/40 p-3">
                    <p className="text-xs text-muted-foreground">Amount</p>
                    <p className="font-semibold">
                      ₹ {feeTotals.original.toLocaleString()}
                    </p>
                  </div>

                  <div className="rounded-md border bg-muted/40 p-3">
                    <p className="text-xs text-muted-foreground">Discount</p>
                    <p className="font-semibold text-orange-600">
                      ₹ {feeTotals.discount.toLocaleString()}
                    </p>
                  </div>

                  <div className="rounded-md border bg-muted/40 p-3">
                    <p className="text-xs text-muted-foreground">Paid Amount</p>
                    <p className="font-semibold text-green-600">
                      ₹ {feeTotals.paid.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
              <TableLayout columns={feeColumns} data={feeCollection} />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
