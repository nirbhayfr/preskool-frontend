import { useMemo } from 'react'
import TableLayout from '@/components/layout/Table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useClasswiseBudget } from '@/hooks/useBudget'
import { CircleLoader } from '@/components/layout/RouteLoader'
import { classes } from '@/data/basicData'

export default function BudgetPage() {
  const { data, isLoading, isError } = useClasswiseBudget()

  const budgetData = useMemo(() => {
    const raw = data?.data || []
    return [...raw].sort(
      (a, b) => classes.indexOf(a.ClassID) - classes.indexOf(b.ClassID)
    )
  }, [data])

  /* TOTALS */

  const totals = useMemo(() => {
    return budgetData.reduce(
      (acc, curr) => {
        acc.monthlyTuition += curr.MonthlyTuitionBudget ?? 0
        acc.annualTuition += curr.AnnualTuitionBudget ?? 0
        acc.monthlyTransport += curr.MonthlyTransportBudget ?? 0
        acc.annualTransport += curr.AnnualTransportBudget ?? 0
        return acc
      },
      {
        monthlyTuition: 0,
        annualTuition: 0,
        monthlyTransport: 0,
        annualTransport: 0,
      }
    )
  }, [budgetData])

  /* TABLE COLUMNS */

  const columns = [
    {
      accessorKey: 'ClassID',
      header: 'Class',
    },
    {
      accessorKey: 'ClassStrength',
      header: 'Students',
    },
    {
      accessorKey: 'TransportStudents',
      header: 'Transport Students',
    },
    {
      accessorKey: 'MonthlyTuitionBudget',
      header: 'Monthly Tuition',
      cell: ({ row }) => {
        const val = row.original.MonthlyTuitionBudget
        return val != null ? (
          <span className="text-blue-600 font-medium">₹ {val.toLocaleString()}</span>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        )
      },
    },
    {
      accessorKey: 'AnnualTuitionBudget',
      header: 'Annual Tuition',
      cell: ({ row }) => {
        const val = row.original.AnnualTuitionBudget
        return val != null ? (
          <span className="font-semibold">₹ {val.toLocaleString()}</span>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        )
      },
    },
    {
      accessorKey: 'MonthlyTransportBudget',
      header: 'Monthly Transport',
      cell: ({ row }) => {
        const val = row.original.MonthlyTransportBudget
        return val != null ? (
          <span className="text-orange-600 font-medium">₹ {val.toLocaleString()}</span>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        )
      },
    },
    {
      accessorKey: 'AnnualTransportBudget',
      header: 'Annual Transport',
      cell: ({ row }) => {
        const val = row.original.AnnualTransportBudget
        return val != null ? (
          <span className="font-semibold">₹ {val.toLocaleString()}</span>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        )
      },
    },
  ]

  if (isLoading) return <CircleLoader />
  if (isError) return <p className="p-6 text-red-500">Failed to load budget data.</p>

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight">Budget Overview</h2>

      {/* SUMMARY CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Monthly Tuition Budget
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold text-blue-600">
            ₹ {totals.monthlyTuition.toLocaleString()}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Annual Tuition Budget
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold">
            ₹ {totals.annualTuition.toLocaleString()}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Monthly Transport Budget
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold text-orange-600">
            ₹ {totals.monthlyTransport.toLocaleString()}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Annual Transport Budget
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold">
            ₹ {totals.annualTransport.toLocaleString()}
          </CardContent>
        </Card>
      </div>

      {/* TABLE */}

      <Card>
        <CardHeader>
          <CardTitle>Class Budget Breakdown</CardTitle>
        </CardHeader>

        <CardContent>
          <TableLayout columns={columns} data={budgetData} />
        </CardContent>
      </Card>
    </div>
  )
}
