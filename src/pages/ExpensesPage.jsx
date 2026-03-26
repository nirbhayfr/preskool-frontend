import { useMemo, useState } from 'react'
import {
  useExpenses,
  useCreateExpense,
  useUpdateExpense,
  useDeleteExpense,
} from '@/hooks/useExpenses'
import { CircleLoader } from '@/components/layout/RouteLoader'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

import {
  Plus,
  Pencil,
  Trash2,
  Search,
  TrendingDown,
  Receipt,
  CheckCircle2,
  Clock,
  IndianRupee,
  Filter,
  X,
  Download,
} from 'lucide-react'

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  'Electricity',
  'Water',
  'Rent',
  'Salaries',
  'Maintenance',
  'Stationery',
  'Transport',
  'Food',
  'IT & Software',
  'Furniture',
  'Events',
  'Other',
]

const PAYMENT_MODES = ['Cash', 'UPI', 'Cheque', 'Bank Transfer', 'Card']
const PAYMENT_STATUSES = ['PAID', 'PENDING', 'CANCELLED']

const EMPTY_FORM = {
  ExpenseDate: new Date().toISOString().split('T')[0],
  ExpenseCategory: '',
  ExpenseTitle: '',
  ExpenseDescription: '',
  Amount: '',
  PaymentMode: '',
  PaymentStatus: 'PAID',
  ReferenceNumber: '',
  PaidTo: '',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatCurrency = (val) =>
  val != null ? `₹${Number(val).toLocaleString('en-IN')}` : '—'

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '—'

const statusConfig = {
  PAID: {
    label: 'Paid',
    class: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
  },
  PENDING: {
    label: 'Pending',
    class: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
  },
  CANCELLED: {
    label: 'Cancelled',
    class: 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400',
  },
}

function StatusBadge({ status }) {
  const cfg = statusConfig[status] ?? { label: status, class: '' }
  return (
    <Badge variant="secondary" className={`text-xs ${cfg.class}`}>
      {cfg.label}
    </Badge>
  )
}

function Field({ label, required, children }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  )
}

// ─── Expense Form Modal ───────────────────────────────────────────────────────
function ExpenseFormModal({ open, onClose, initialData, onSave, isSaving }) {
  const isEdit = Boolean(initialData)
  const [form, setForm] = useState(
    initialData
      ? {
          ...initialData,
          ExpenseDate: initialData.ExpenseDate?.split('T')[0] ?? '',
        }
      : EMPTY_FORM
  )

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }))

  const handleSave = () => {
    if (!form.ExpenseTitle.trim()) {
      toast.error('Title is required')
      return
    }
    if (!form.ExpenseCategory) {
      toast.error('Category is required')
      return
    }
    if (!form.Amount || Number(form.Amount) <= 0) {
      toast.error('Valid amount is required')
      return
    }
    if (!form.PaymentMode) {
      toast.error('Payment mode is required')
      return
    }
    onSave(form)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Expense' : 'New Expense'}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
          <Field label="Title" required>
            <Input
              value={form.ExpenseTitle}
              onChange={(e) => set('ExpenseTitle', e.target.value)}
              placeholder="e.g. February Electricity Bill"
            />
          </Field>

          <Field label="Category" required>
            <Select
              value={form.ExpenseCategory}
              onValueChange={(v) => set('ExpenseCategory', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Amount (₹)" required>
            <Input
              type="number"
              min={0}
              value={form.Amount}
              onChange={(e) => set('Amount', e.target.value)}
              placeholder="0"
            />
          </Field>

          <Field label="Date" required>
            <Input
              type="date"
              value={form.ExpenseDate}
              onChange={(e) => set('ExpenseDate', e.target.value)}
            />
          </Field>

          <Field label="Payment Mode" required>
            <Select value={form.PaymentMode} onValueChange={(v) => set('PaymentMode', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_MODES.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Payment Status">
            <Select
              value={form.PaymentStatus}
              onValueChange={(v) => set('PaymentStatus', v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {statusConfig[s]?.label ?? s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Paid To">
            <Input
              value={form.PaidTo}
              onChange={(e) => set('PaidTo', e.target.value)}
              placeholder="Recipient name"
            />
          </Field>

          <Field label="Reference Number">
            <Input
              value={form.ReferenceNumber}
              onChange={(e) => set('ReferenceNumber', e.target.value)}
              placeholder="e.g. UPI-88990011"
            />
          </Field>

          <Field label="Description">
            <Textarea
              value={form.ExpenseDescription}
              onChange={(e) => set('ExpenseDescription', e.target.value)}
              placeholder="Optional notes…"
              className="col-span-full resize-none h-20 text-sm"
            />
          </Field>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving…' : isEdit ? 'Update' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Expense Row ──────────────────────────────────────────────────────────────
function ExpenseRow({ expense, onEdit, onDelete }) {
  return (
    <div className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-4 rounded-xl border border-border hover:border-primary/30 hover:bg-accent/30 transition-all">
      <div className="flex items-start gap-3 min-w-0">
        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
          <Receipt className="h-4 w-4 text-primary" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold truncate">{expense.ExpenseTitle}</p>
            <Badge variant="outline" className="text-xs shrink-0">
              {expense.ExpenseCategory}
            </Badge>
            <StatusBadge status={expense.PaymentStatus} />
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
            <span className="text-xs text-muted-foreground">
              {formatDate(expense.ExpenseDate)}
            </span>
            {expense.PaidTo && (
              <span className="text-xs text-muted-foreground">→ {expense.PaidTo}</span>
            )}
            {expense.PaymentMode && (
              <span className="text-xs text-muted-foreground">{expense.PaymentMode}</span>
            )}
            {expense.ReferenceNumber && (
              <span className="text-xs text-muted-foreground font-mono">
                {expense.ReferenceNumber}
              </span>
            )}
          </div>
          {expense.ExpenseDescription && (
            <p className="text-xs text-muted-foreground/70 mt-1 truncate max-w-md">
              {expense.ExpenseDescription}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0 sm:ml-4">
        <div className="flex items-center gap-0.5 text-base font-bold">
          <IndianRupee className="h-4 w-4" />
          {Number(expense.Amount).toLocaleString('en-IN')}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(expense)}
            className="p-1.5 rounded-md hover:bg-background text-muted-foreground hover:text-foreground transition-colors border border-transparent hover:border-border"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(expense)}
            className="p-1.5 rounded-md hover:bg-background text-muted-foreground hover:text-destructive transition-colors border border-transparent hover:border-border"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ExpensesPage() {
  const { data: rawData, isLoading, isError } = useExpenses()
  const { mutate: createExpense, isPending: isCreating } = useCreateExpense()
  const { mutate: updateExpense, isPending: isUpdating } = useUpdateExpense()
  const { mutate: deleteExpense } = useDeleteExpense()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [deletingExpense, setDeletingExpense] = useState(null)

  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterMonth, setFilterMonth] = useState('all')

  const expenses = rawData?.data ?? []

  const months = useMemo(() => {
    const unique = [
      ...new Set(expenses.map((e) => e.ExpenseDate?.slice(0, 7)).filter(Boolean)),
    ].sort((a, b) => b.localeCompare(a))
    return unique
  }, [expenses])

  const filtered = useMemo(() => {
    return expenses.filter((e) => {
      if (filterCategory !== 'all' && e.ExpenseCategory !== filterCategory) return false
      if (filterStatus !== 'all' && e.PaymentStatus !== filterStatus) return false
      if (filterMonth !== 'all' && !e.ExpenseDate?.startsWith(filterMonth)) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        return (
          (e.ExpenseTitle || '').toLowerCase().includes(q) ||
          (e.PaidTo || '').toLowerCase().includes(q) ||
          (e.ReferenceNumber || '').toLowerCase().includes(q) ||
          (e.ExpenseCategory || '').toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [expenses, filterCategory, filterStatus, filterMonth, search])

  const summary = useMemo(() => {
    const total = filtered.reduce((s, e) => s + Number(e.Amount || 0), 0)
    const paid = filtered
      .filter((e) => e.PaymentStatus === 'PAID')
      .reduce((s, e) => s + Number(e.Amount || 0), 0)
    const pending = filtered
      .filter((e) => e.PaymentStatus === 'PENDING')
      .reduce((s, e) => s + Number(e.Amount || 0), 0)
    return { total, paid, pending, count: filtered.length }
  }, [filtered])

  const hasFilters =
    filterCategory !== 'all' ||
    filterStatus !== 'all' ||
    filterMonth !== 'all' ||
    search.trim() !== ''

  const clearFilters = () => {
    setFilterCategory('all')
    setFilterStatus('all')
    setFilterMonth('all')
    setSearch('')
  }

  const handleSave = (form) => {
    const payload = {
      expenseDate: form.ExpenseDate,
      expenseCategory: form.ExpenseCategory,
      expenseTitle: form.ExpenseTitle,
      expenseDescription: form.ExpenseDescription,
      amount: Number(form.Amount),
      paymentMode: form.PaymentMode,
      paymentStatus: form.PaymentStatus,
      referenceNumber: form.ReferenceNumber,
      paidTo: form.PaidTo,
      createdBy: 'Admin',
    }

    if (editingExpense) {
      updateExpense(
        { id: editingExpense.ExpenseId, ...payload },
        {
          onSuccess: () => {
            toast.success('Expense updated')
            setModalOpen(false)
            setEditingExpense(null)
          },
          onError: () => toast.error('Failed to update expense'),
        }
      )
    } else {
      createExpense(payload, {
        onSuccess: () => {
          toast.success('Expense created')
          setModalOpen(false)
        },
        onError: () => toast.error('Failed to create expense'),
      })
    }
  }

  const handleDelete = () => {
    if (!deletingExpense) return
    deleteExpense(deletingExpense.ExpenseId, {
      onSuccess: () => {
        toast.success('Expense deleted')
        setDeletingExpense(null)
      },
      onError: () => toast.error('Failed to delete expense'),
    })
  }

  const handleExportCSV = () => {
    try {
      if (!filtered.length) {
        toast.error('No data to export')
        return
      }

      const headers = [
        'Date',
        'Title',
        'Category',
        'Amount',
        'Payment Mode',
        'Status',
        'Paid To',
        'Reference',
        'Description',
      ]

      const rows = filtered.map((e) => [
        formatDate(e.ExpenseDate),
        e.ExpenseTitle,
        e.ExpenseCategory,
        e.Amount,
        e.PaymentMode,
        e.PaymentStatus,
        e.PaidTo || '',
        e.ReferenceNumber || '',
        e.ExpenseDescription || '',
      ])

      const csvContent = [headers, ...rows]
        .map((row) => row.map((v) => `"${v ?? ''}"`).join(','))
        .join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `expenses_${new Date().toISOString()}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(url)

      toast.success('CSV exported')
    } catch (err) {
      console.error(err)
      toast.error('Export failed')
    }
  }

  if (isLoading) return <CircleLoader />
  if (isError) return <p className="p-8 text-destructive">Failed to load expenses.</p>

  return (
    <div className="p-6 space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <TrendingDown className="h-6 w-6 text-primary" />
            Expenses
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Track and manage all school expenditures
          </p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          <Button variant="outline" className="gap-2" onClick={handleExportCSV}>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>

          <Button
            className="gap-2"
            onClick={() => {
              setEditingExpense(null)
              setModalOpen(true)
            }}
          >
            <Plus className="h-4 w-4" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* ── Summary ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="py-4 px-5">
          <CardContent className="p-0 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Total Expenses</p>
              <p className="text-xl font-bold mt-0.5">{formatCurrency(summary.total)}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Receipt className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="py-4 px-5">
          <CardContent className="p-0 flex items-center justify-between">
            <div>
              <p className="text-xs text-emerald-600">Paid</p>
              <p className="text-xl font-bold text-emerald-600 mt-0.5">
                {formatCurrency(summary.paid)}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="py-4 px-5">
          <CardContent className="p-0 flex items-center justify-between">
            <div>
              <p className="text-xs text-amber-600">Pending</p>
              <p className="text-xl font-bold text-amber-600 mt-0.5">
                {formatCurrency(summary.pending)}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-amber-50 dark:bg-amber-950 flex items-center justify-center">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="py-4 px-5">
          <CardContent className="p-0 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Records</p>
              <p className="text-xl font-bold mt-0.5">{summary.count}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
              <Filter className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, category, reference…"
            className="pl-8 h-8 text-sm"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="h-8 text-sm w-36">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="h-8 text-sm w-32">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {PAYMENT_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {statusConfig[s]?.label ?? s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterMonth} onValueChange={setFilterMonth}>
          <SelectTrigger className="h-8 text-sm w-36">
            <SelectValue placeholder="All Months" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Months</SelectItem>
            {months.map((m) => {
              const [y, mo] = m.split('-')
              const label = new Date(y, mo - 1).toLocaleString('default', {
                month: 'long',
                year: 'numeric',
              })
              return (
                <SelectItem key={m} value={m}>
                  {label}
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 gap-1 text-xs text-muted-foreground"
          >
            <X className="h-3.5 w-3.5" /> Clear
          </Button>
        )}
      </div>

      {/* ── List ── */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-2">
            <Receipt className="h-10 w-10 opacity-20" />
            <p className="text-sm">
              {hasFilters
                ? 'No expenses match the current filters.'
                : 'No expenses yet. Add your first one.'}
            </p>
          </div>
        ) : (
          filtered.map((expense) => (
            <ExpenseRow
              key={expense.ExpenseId}
              expense={expense}
              onEdit={(e) => {
                setEditingExpense(e)
                setModalOpen(true)
              }}
              onDelete={(e) => setDeletingExpense(e)}
            />
          ))
        )}
      </div>

      {/* ── Form Modal ── */}
      {modalOpen && (
        <ExpenseFormModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false)
            setEditingExpense(null)
          }}
          initialData={editingExpense}
          onSave={handleSave}
          isSaving={isCreating || isUpdating}
        />
      )}

      {/* ── Delete Confirm ── */}
      <AlertDialog open={!!deletingExpense} onOpenChange={() => setDeletingExpense(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Expense</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingExpense?.ExpenseTitle}"? This
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
