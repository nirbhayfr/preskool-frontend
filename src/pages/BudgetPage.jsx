import { useMemo } from 'react'
import TableLayout from '@/components/layout/Table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function BudgetPage() {
  /* DUMMY API RESPONSE */

  const response = {
    status: 'success',
    data: [
      {
        ClassID: '1',
        ClassStrength: 42,
        TransportStudents: 15,
        MonthlyTuitionBudget: 42000,
        AnnualTuitionBudget: 504000,
        MonthlyTransportBudget: 7500,
        AnnualTransportBudget: 90000,
      },
      {
        ClassID: '2',
        ClassStrength: 38,
        TransportStudents: 12,
        MonthlyTuitionBudget: 38000,
        AnnualTuitionBudget: 456000,
        MonthlyTransportBudget: 6000,
        AnnualTransportBudget: 72000,
      },
      {
        ClassID: '3',
        ClassStrength: 45,
        TransportStudents: 18,
        MonthlyTuitionBudget: 45000,
        AnnualTuitionBudget: 540000,
        MonthlyTransportBudget: 9000,
        AnnualTransportBudget: 108000,
      },
    ],
  }

  const budgetData = response?.data || []

  /* TOTALS */

  const totals = useMemo(() => {
    return budgetData.reduce(
      (acc, curr) => {
        acc.monthlyTuition += curr.MonthlyTuitionBudget
        acc.annualTuition += curr.AnnualTuitionBudget
        acc.monthlyTransport += curr.MonthlyTransportBudget
        acc.annualTransport += curr.AnnualTransportBudget
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
      cell: ({ row }) => (
        <span className="text-blue-600 font-medium">
          ₹ {row.original.MonthlyTuitionBudget.toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: 'AnnualTuitionBudget',
      header: 'Annual Tuition',
      cell: ({ row }) => (
        <span className="font-semibold">
          ₹ {row.original.AnnualTuitionBudget.toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: 'MonthlyTransportBudget',
      header: 'Monthly Transport',
      cell: ({ row }) => (
        <span className="text-orange-600 font-medium">
          ₹ {row.original.MonthlyTransportBudget.toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: 'AnnualTransportBudget',
      header: 'Annual Transport',
      cell: ({ row }) => (
        <span className="font-semibold">
          ₹ {row.original.AnnualTransportBudget.toLocaleString()}
        </span>
      ),
    },
  ]

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
