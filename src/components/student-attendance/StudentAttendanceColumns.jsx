import { AttendanceCell } from './AttendanceCell'

function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate()
}

function getWeekdayInitial(year, month, day) {
  return new Date(year, month - 1, day)
    .toLocaleDateString('en-US', { weekday: 'short' })
    .charAt(0)
}

function countStatus(row, status, selectedMonth) {
  return Object.entries(row).filter(
    ([key, value]) => value === status && key.startsWith(selectedMonth)
  ).length
}

export function getAttendanceColumns(selectedMonth) {
  const [year, month] = selectedMonth.split('-').map(Number)
  const daysInMonth = getDaysInMonth(year, month)

  const dateColumns = []

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let day = 1; day <= daysInMonth; day++) {
    const dayKey = String(day).padStart(2, '0')
    const monthKey = String(month).padStart(2, '0')
    const fullDateKey = `${year}-${monthKey}-${dayKey}`

    const currentDate = new Date(year, month - 1, day)
    currentDate.setHours(0, 0, 0, 0)

    const isFutureDate = currentDate > today
    const weekday = getWeekdayInitial(year, month, day)

    dateColumns.push({
      accessorKey: fullDateKey,
      header: () => (
        <div className="text-center leading-tight">
          <div>{dayKey}</div>
          <div className="text-xs text-muted-foreground">{weekday}</div>
        </div>
      ),
      cell: ({ getValue }) =>
        isFutureDate ? '-' : <AttendanceCell value={getValue()} />,
      size: 48,
    })
  }

  return [
    {
      accessorKey: 'Name',
      header: 'Student / Date',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.Name}</div>
          <div className="text-xs text-muted-foreground">
            Class {row.original.Class} • Section {row.original.Section}
          </div>
        </div>
      ),
      size: 220,
    },

    {
      id: 'percentage',
      header: '%',
      cell: ({ row }) => {
        const present = countStatus(row.original, 'P', selectedMonth)
        const absent = countStatus(row.original, 'A', selectedMonth)
        const total = present + absent

        if (!total) return '0%'

        return <span className="font-medium">{Math.round((present / total) * 100)}%</span>
      },
    },

    {
      id: 'presentCount',
      header: 'P',
      cell: ({ row }) => (
        <span className="font-medium text-emerald-700">
          {countStatus(row.original, 'P', selectedMonth)}
        </span>
      ),
      size: 40,
    },

    {
      id: 'absentCount',
      header: 'A',
      cell: ({ row }) => (
        <span className="font-medium text-red-700">
          {countStatus(row.original, 'A', selectedMonth)}
        </span>
      ),
      size: 40,
    },

    ...dateColumns,
  ]
}
