import { useState } from 'react'
import { format } from 'date-fns'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
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
  useStaffSalaryByStaffId,
  useUpdateStaffSalary,
  useDeleteStaffSalary,
} from '@/hooks/useStaffSalary'
import { pdf } from '@react-pdf/renderer'
import SalarySlipPDF from '@/components/pdfs/SalarySlip'
import { Download, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

const currentMonth = new Date().toISOString().slice(0, 7)

const handleDownloadSalarySlip = async (record, staff) => {
  const staffAsTeacher = {
    FullName: staff?.FullName,
    TeacherID: staff?.StaffID,
    Subject: staff?.Role,
    Salary: staff?.Salary,
    ProfilePhoto: staff?.ProfilePhoto || staff?.ProfilePictureUrl,
  }

  const blob = await pdf(
    <SalarySlipPDF teacher={staffAsTeacher} salary={record} />
  ).toBlob()

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `salary-slip-${staff.FullName}-${record.SalaryMonth}.pdf`
  a.click()
  URL.revokeObjectURL(url)
}

// ─── Update Modal ─────────────────────────────────────────────────────────────
function UpdateSalaryModal({ open, onClose, record, onSave, isSaving }) {
  const [form, setForm] = useState({
    basicSalary: record?.BasicSalary ?? 0,
    allowances: record?.Allowances ?? 0,
    deductions: record?.Deductions ?? 0,
    salaryMonth: record?.SalaryMonth ?? '',
  })

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }))

  const netSalary = Math.max(
    Number(form.basicSalary) + Number(form.allowances) - Number(form.deductions),
    0
  )

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Edit Salary —{' '}
            {record?.SalaryMonth
              ? format(new Date(`${record.SalaryMonth}-01`), 'MMMM yyyy')
              : ''}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Salary Month</Label>
            <Input
              type="month"
              value={form.salaryMonth}
              onChange={(e) => set('salaryMonth', e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Basic Salary (₹)</Label>
            <Input
              type="number"
              min={0}
              value={form.basicSalary}
              onChange={(e) => set('basicSalary', Number(e.target.value))}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Allowances (₹)</Label>
            <Input
              type="number"
              min={0}
              value={form.allowances}
              onChange={(e) => set('allowances', Number(e.target.value))}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Deductions (₹)</Label>
            <Input
              type="number"
              min={0}
              value={form.deductions}
              onChange={(e) => set('deductions', Number(e.target.value))}
            />
          </div>

          <div className="rounded-lg bg-muted/50 px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Net Payable</span>
            <span className="text-sm font-bold text-primary">
              ₹ {netSalary.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSave(form)} disabled={isSaving}>
            {isSaving ? 'Saving…' : 'Update'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
function StaffPreviousSalaryRecords({ staffId, staff }) {
  const { data, isLoading, isError } = useStaffSalaryByStaffId(staffId)
  const { mutate: updateSalary, isPending: isUpdating } = useUpdateStaffSalary()
  const { mutate: deleteSalary, isPending: isDeleting } = useDeleteStaffSalary()

  const [editingRecord, setEditingRecord] = useState(null)
  const [deletingRecord, setDeletingRecord] = useState(null)

  const records = data?.data ?? []

  const handleUpdate = (form) => {
    if (!editingRecord) return
    updateSalary(
      {
        id: editingRecord.SalaryID,
        payload: {
          basicSalary: Number(form.basicSalary),
          allowances: Number(form.allowances),
          deductions: Number(form.deductions),
          salaryMonth: form.salaryMonth,
          isPaid: editingRecord.IsPaid,
          paymentDate: editingRecord.PaymentDate ?? null,
        },
      },
      {
        onSuccess: () => {
          toast.success('Salary updated successfully')
          setEditingRecord(null)
        },
        onError: () => toast.error('Failed to update salary'),
      }
    )
  }

  const handleDelete = () => {
    if (!deletingRecord) return
    deleteSalary(deletingRecord.SalaryID, {
      onSuccess: () => {
        toast.success('Salary record deleted')
        setDeletingRecord(null)
      },
      onError: () => toast.error('Failed to delete salary record'),
    })
  }

  if (isLoading) return <StaffPreviousSalaryRecordsSkeleton />
  if (isError)
    return <p className="text-sm text-destructive">Failed to load salary records</p>

  return (
    <>
      <Card className="rounded-xl border-muted/60">
        <CardHeader>
          <CardTitle className="text-lg font-semibold tracking-tight">
            Previous Salary Records
          </CardTitle>
        </CardHeader>

        <CardContent>
          {records.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No salary records found
            </p>
          ) : (
            <div className="divide-y divide-border max-h-[600px] overflow-y-auto pr-3">
              {records.map((record) => (
                <div key={record.SalaryID} className="py-4 space-y-3">
                  {/* Top row — month + status + actions */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">
                          {format(new Date(`${record.SalaryMonth}-01`), 'MMMM yyyy')}
                        </p>
                        {record.SalaryMonth === currentMonth && (
                          <Badge
                            variant="secondary"
                            className="bg-primary/10 text-primary text-xs"
                          >
                            Current
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        ID: #{record.SalaryID} · Created{' '}
                        {format(new Date(record.CreatedAt), 'dd MMM yyyy')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={
                          record.IsPaid
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40'
                            : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/40'
                        }
                      >
                        {record.IsPaid ? 'Paid' : 'Pending'}
                      </Badge>

                      <button
                        onClick={() => setEditingRecord(record)}
                        className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>

                      <button
                        onClick={() => setDeletingRecord(record)}
                        className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-destructive transition-colors"
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Breakdown grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <SalaryCell
                      label="Basic Salary"
                      value={`₹ ${Number(record.BasicSalary).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
                    />
                    <SalaryCell
                      label="Allowances"
                      value={`+ ₹ ${Number(record.Allowances ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
                      valueClass="text-emerald-600"
                    />
                    <SalaryCell
                      label="Deductions"
                      value={`− ₹ ${Number(record.Deductions ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
                      valueClass="text-red-500"
                    />
                    <SalaryCell
                      label="Net Salary"
                      value={`₹ ${Number(record.NetSalary).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
                      valueClass="text-primary font-semibold"
                    />
                  </div>

                  {/* Payment date + download */}
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      {record.PaymentDate
                        ? `Paid on ${format(new Date(record.PaymentDate), 'dd MMM yyyy')}`
                        : 'Payment date not set'}
                    </p>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-xs"
                      onClick={() => handleDownloadSalarySlip(record, staff)}
                    >
                      <Download className="size-3 mr-1" />
                      Slip
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Update Modal */}
      {editingRecord && (
        <UpdateSalaryModal
          open={!!editingRecord}
          onClose={() => setEditingRecord(null)}
          record={editingRecord}
          onSave={handleUpdate}
          isSaving={isUpdating}
        />
      )}

      {/* Delete Confirm */}
      <AlertDialog open={!!deletingRecord} onOpenChange={() => setDeletingRecord(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Salary Record</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the salary record for{' '}
              {deletingRecord?.SalaryMonth
                ? format(new Date(`${deletingRecord.SalaryMonth}-01`), 'MMMM yyyy')
                : 'this month'}
              ? This cannot be undone.
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
    </>
  )
}

function SalaryCell({ label, value, valueClass = '' }) {
  return (
    <div className="rounded-lg bg-muted/50 px-3 py-2 space-y-0.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-sm font-medium ${valueClass}`}>{value}</p>
    </div>
  )
}

export default StaffPreviousSalaryRecords

function StaffPreviousSalaryRecordsSkeleton() {
  return (
    <Card className="rounded-xl border-muted/60">
      <CardHeader>
        <Skeleton className="h-5 w-48" />
      </CardHeader>
      <CardContent className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-36" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, j) => (
                <Skeleton key={j} className="h-14 rounded-lg" />
              ))}
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-7 w-16 rounded-md" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
