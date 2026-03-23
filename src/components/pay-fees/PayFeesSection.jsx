import { useState, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

import { useFeeStructureByClass } from '@/hooks/useFeeStructure'
import {
  useCreateFeeSubmission,
  useDeductFees,
  useUpdateFeeSubmission,
} from '@/hooks/useFeeSubmissions'
import { useStudentTransportHistory } from '@/hooks/useTransportHistory'
import { useTransport } from '@/hooks/useTransport'

import { toast } from 'sonner'
import { pdf } from '@react-pdf/renderer'
import FeeReceiptPDF from '@/components/pdfs/FeeReceiptPDF'
import FeeStructureSection from './FeeStructureSection'
import { AlertCircle, Plus, Trash2 } from 'lucide-react'

// ─── helpers ─────────────────────────────────────────────────────────────────

const makeBlankRow = (student) => ({
  id: Date.now() + Math.random(),
  group: '',
  type: '',
  amount: 0,
  /** Only set for tuition rows when user edits the amount */
  paidAmount: undefined,
  includeTuition: true,
  includeTransport: true,
  discount: student?.DiscountAmount ? Number(student.DiscountAmount) : 0,
  paymentMode: '',
  remarks: '',
})

function Field({ label, children, className = '' }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  )
}

// ─── component ───────────────────────────────────────────────────────────────

export default function PayFeesSection({ student, feesData }) {
  const academicYear = '2025-2026'

  const [tab, setTab] = useState('type')
  const [quarter, setQuarter] = useState('')
  const [collectionDate] = useState(new Date().toISOString().split('T')[0])
  const [includeTuition, setIncludeTuition] = useState(true)
  const [includeTransport, setIncludeTransport] = useState(true)
  const [feeRows, setFeeRows] = useState([makeBlankRow(student)])

  // ── remote data ──────────────────────────────────────────────────────────
  const { data: structure } = useFeeStructureByClass({
    classId: student?.ClassID,
    academicYear,
    enabled: !!student?.ClassID,
  })

  const { data: transportHistory } = useStudentTransportHistory({
    studentId: student?.StudentID,
    academicYear,
    enabled: !!student?.StudentID,
  })

  const { data: transport } = useTransport()

  const { mutate: createFeeSubmission, isLoading } = useCreateFeeSubmission()
  const { mutate: deductFees } = useDeductFees()
  const { mutate: updateFeeSubmission } = useUpdateFeeSubmission()

  // ── derived ──────────────────────────────────────────────────────────────
  const pendingAmount = Number(student?.PendingFee || 0)

  const transportRoutePrice = useMemo(() => {
    if (!transportHistory?.months?.length || !transport?.length) return 0
    const routeMonth = transportHistory.months.find((m) => m?.Route && m.Route !== 'N/A')
    if (!routeMonth) return 0
    const routeTransport = transport.find(
      (t) => t?.TransportNumber === routeMonth.VehicleNo
    )
    return routeTransport?.Price ?? 0
  }, [transportHistory, transport])

  /** Fees that were saved with PARTIAL status */
  const partialFees = useMemo(() => {
    if (!feesData?.data) return []
    console.log('feesData.data:', feesData.data) // log the full array
    const seen = new Set()
    return feesData.data.filter((f) => {
      if ((f.PaymentStatus || '').toUpperCase() !== 'PARTIAL') return false
      const id = f.SubmissionID ?? f.id
      if (seen.has(id)) return false
      seen.add(id)
      return true
    })
  }, [feesData])

  const feeGroups = useMemo(() => {
    if (!structure) return []
    const groups = [
      ...new Set(
        Object.keys(structure)
          .filter((k) => k.includes('_fee'))
          .map((k) => (k.includes('tuition') || k.includes('tution') ? 'tuition_fee' : k))
      ),
    ]
    const base = ['pending_fee', ...groups]
    if (partialFees.length > 0) base.push('partial_fee')
    return base
  }, [structure, partialFees])

  const quarterTotal = useMemo(() => {
    if (!quarter || !structure) return 0
    const quarterMonths = {
      1: ['apr', 'may', 'jun'],
      2: ['jul', 'aug', 'sep'],
      3: ['oct', 'nov', 'dec'],
      4: ['jan', 'feb', 'mar'],
    }
    const months = quarterMonths[quarter] || []
    let total = 0
    months.forEach((month) => {
      const tuitionKey = Object.keys(structure).find(
        (k) => k.startsWith(month) && (k.includes('tuition') || k.includes('tution'))
      )
      if (tuitionKey && includeTuition) total += Number(structure[tuitionKey] || 0)
      const monthTransport = transportHistory?.months?.find((m) =>
        m.MonthName?.toLowerCase().startsWith(month)
      )
      if (includeTransport && monthTransport?.Route && monthTransport.Route !== 'N/A') {
        total += Number(transportRoutePrice || 0)
      }
    })
    return total
  }, [
    quarter,
    structure,
    transportHistory,
    transportRoutePrice,
    includeTuition,
    includeTransport,
  ])

  // ── per-row helpers ───────────────────────────────────────────────────────

  const getFeesForGroup = (group) => {
    if (!group || !structure) return []

    if (group === 'pending_fee') {
      return [{ key: 'pending_fee', label: 'PENDING FEES', value: pendingAmount }]
    }

    if (group === 'partial_fee') {
      return partialFees.map((f) => {
        const discount = student?.DiscountAmount ? Number(student.DiscountAmount) : 0
        const remaining = Math.max(
          Number(f.OriginalAmount || 0) - discount - Number(f.PaidAmount || 0),
          0
        )
        return {
          key: `partial_${f.SubmissionID ?? f.id}`,
          label: `${f.FeeType} (Partial — ₹${remaining} left)`,
          value: remaining,
          submissionId: f.SubmissionID ?? f.id,
          originalFeeType: f.FeeType,
        }
      })
    }

    return Object.entries(structure)
      .filter(([key]) => {
        if (group === 'tuition_fee')
          return key.includes('tuition_fee') || key.includes('tution_fee')
        return key === group
      })
      .map(([key, value]) => ({
        key,
        label: key.replace(/_/g, ' ').toUpperCase(),
        value,
      }))
  }

  const getTransportFeeForType = (type) => {
    if (!type) return 0
    const month = type.split('_')[0]
    const monthData = transportHistory?.months?.find((m) =>
      m.MonthName?.toLowerCase().startsWith(month)
    )
    if (monthData?.Route && monthData.Route !== 'N/A') return transportRoutePrice
    return 0
  }

  /**
   * For tuition: payable = enteredAmount (paidAmount ?? amount) - discount [+ transport]
   * For others: payable = amount
   */
  const calculateRowPayable = (row) => {
    const isTuition = row.type.includes('tuition') || row.type.includes('tution')
    if (!isTuition) return Math.max(Number(row.amount || 0), 0)

    let total = 0
    if (row.includeTuition) {
      if (row.paidAmount !== undefined) {
        // User typed the net amount directly — use as-is
        total += Math.max(row.paidAmount, 0)
      } else {
        // Default: full amount minus discount
        total += Math.max(Number(row.amount || 0) - row.discount, 0)
      }
    }
    if (row.includeTransport) total += getTransportFeeForType(row.type)
    return Math.max(total, 0)
  }
  /** True when a tuition row has a partial payment (entered < full payable) */
  const isRowPartial = (row) => {
    const isTuition = row.type.includes('tuition') || row.type.includes('tution')
    if (!isTuition || !row.includeTuition || row.paidAmount === undefined) return false
    const full = Math.max(Number(row.amount) - row.discount, 0)
    return row.paidAmount < full
  }

  const remainingForRow = (row) => {
    const full = Math.max(Number(row.amount) - row.discount, 0)
    // paidAmount is what the user typed — treat it as the net paid amount directly
    const paid = Math.max(row.paidAmount ?? full, 0)
    return Math.max(full - paid, 0)
  }

  // ── row mutations ─────────────────────────────────────────────────────────
  const updateRow = (id, patch) =>
    setFeeRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))

  const addRow = () => setFeeRows((prev) => [...prev, makeBlankRow(student)])
  const removeRow = (id) => setFeeRows((prev) => prev.filter((r) => r.id !== id))

  // ── fee slip ──────────────────────────────────────────────────────────────
  const handleDownloadSlip = async (submissions) => {
    const receiptNo = `RCP-${Date.now().toString().slice(-6)}`
    const feeMonth = new Date().toLocaleString('en-IN', { month: 'short' }).toUpperCase()
    const blob = await pdf(
      <FeeReceiptPDF
        student={student}
        submissions={submissions}
        receiptNo={receiptNo}
        feeMonth={feeMonth}
      />
    ).toBlob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fee-receipt-${student?.FullName ?? 'student'}-${receiptNo}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }

  // ── submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const baseTxn = `TXN${Date.now()}`
    const collectedSubmissions = []

    const basePayload = {
      studentId: Number(student.StudentID),
      paymentStatus: 'SUCCESS',
      submittedBy: 'Accountant',
      submittedDate: collectionDate,
    }

    // ── QUARTER TAB ──────────────────────────────────────────────────────
    if (tab === 'quarter') {
      if (!quarter) {
        toast.error('Please select a quarter')
        return
      }
      const quarterMonths = {
        1: ['apr', 'may', 'jun'],
        2: ['jul', 'aug', 'sep'],
        3: ['oct', 'nov', 'dec'],
        4: ['jan', 'feb', 'mar'],
      }
      const months = quarterMonths[quarter] || []

      months.forEach((month) => {
        const tuitionKey = Object.keys(structure || {}).find(
          (k) => k.startsWith(month) && (k.includes('tuition') || k.includes('tution'))
        )

        if (tuitionKey && includeTuition) {
          const tuitionAmount = Number(structure[tuitionKey] || 0)
          collectedSubmissions.push({
            FeeType: `${month.toUpperCase()} Tuition Fee`,
            OriginalAmount: tuitionAmount,
            DiscountAmount: 0,
            PaidAmount: tuitionAmount,
            PaymentMethod: 'CASH',
            PaymentDate: collectionDate,
            SubmittedDate: collectionDate,
          })
          createFeeSubmission({
            ...basePayload,
            paymentMode: 'CASH',
            remarks: 'Quarterly Payment',
            feeType: `${month.toUpperCase()}_TUITION`,
            transactionId: `${baseTxn}_${month}_TUITION`,
            originalAmount: tuitionAmount,
            discountAmount: 0,
            paidAmount: tuitionAmount,
          })
        }

        const monthTransport = transportHistory?.months?.find((m) =>
          m.MonthName?.toLowerCase().startsWith(month)
        )
        if (includeTransport && monthTransport?.Route && monthTransport.Route !== 'N/A') {
          collectedSubmissions.push({
            FeeType: `${month.toUpperCase()} Transport Fee`,
            OriginalAmount: transportRoutePrice,
            DiscountAmount: 0,
            PaidAmount: transportRoutePrice,
            PaymentMethod: 'CASH',
            PaymentDate: collectionDate,
            SubmittedDate: collectionDate,
          })
          createFeeSubmission({
            ...basePayload,
            paymentMode: 'CASH',
            remarks: 'Quarterly Payment',
            feeType: `TRANSPORT_${month.toUpperCase()}`,
            transactionId: `${baseTxn}_${month}_TRANSPORT`,
            originalAmount: transportRoutePrice,
            discountAmount: 0,
            paidAmount: transportRoutePrice,
          })
        }
      })

      toast.success('Quarter fees collected successfully')
      if (collectedSubmissions.length > 0) await handleDownloadSlip(collectedSubmissions)
      return
    }

    // ── TYPE TAB ──────────────────────────────────────────────────────────
    let hasPartialRows = false

    for (const row of feeRows) {
      if (!row.type) continue

      const isTuition = row.type.includes('tuition') || row.type.includes('tution')
      const isPending = row.type === 'pending_fee'
      const isPartialGroup = row.group === 'partial_fee'
      const month = row.type.split('_')[0]

      // ── Partial group completion ──
      if (isPartialGroup) {
        const remainingAmount = Number(row.amount)
        if (!row.type) continue
        const submissionId = Number(row.type.replace('partial_', ''))
        const originalRecord = partialFees.find((f) => f.SubmissionID === submissionId)
        const feeTypeLabel = originalRecord?.FeeType ?? row.type

        collectedSubmissions.push({
          FeeType: feeTypeLabel,
          OriginalAmount: remainingAmount,
          DiscountAmount: 0,
          PaidAmount: remainingAmount,
          PaymentMethod: row.paymentMode,
          PaymentDate: collectionDate,
          SubmittedDate: collectionDate,
        })

        // Create the new completion payment
        createFeeSubmission({
          ...basePayload,
          paymentMode: row.paymentMode,
          remarks: row.remarks || 'Partial fee completion',
          feeType: feeTypeLabel.toUpperCase().replace(/\s+/g, '_'),
          transactionId: `${baseTxn}_P${String(row.id).slice(-4)}`,
          originalAmount: remainingAmount,
          discountAmount: 0,
          paidAmount: remainingAmount,
          paymentStatus: 'SUCCESS',
        })

        // Update the original partial record to SUCCESS so it disappears from partial list
        if (submissionId) {
          updateFeeSubmission({
            id: submissionId,
            paymentStatus: 'SUCCESS',
          })
        } else {
          console.warn('no submissionId found for partial fee', row)
        }

        continue
      }

      // ── Pending fee ──
      if (isPending) {
        const amount = Number(row.amount)
        if (!amount) continue

        collectedSubmissions.push({
          FeeType: 'Pending Fee',
          OriginalAmount: amount,
          DiscountAmount: 0,
          PaidAmount: amount,
          PaymentMethod: row.paymentMode,
          PaymentDate: collectionDate,
          SubmittedDate: collectionDate,
        })
        createFeeSubmission({
          ...basePayload,
          paymentMode: row.paymentMode,
          remarks: row.remarks,
          feeType: 'PENDING_FEE',
          transactionId: `${baseTxn}_PENDING_${row.id}`,
          originalAmount: amount,
          discountAmount: 0,
          paidAmount: amount,
        })
        deductFees({
          studentId: Number(student.StudentID),
          amount,
          paymentMode: row.paymentMode,
          remarks: row.remarks,
          submittedDate: collectionDate,
        })
        continue
      }

      // ── Tuition fee (with optional partial) ──
      if (isTuition) {
        if (row.includeTuition) {
          const originalAmount = Number(row.amount)
          const discountAmount = row.discount
          const fullPayable = Math.max(originalAmount - discountAmount, 0)

          const paidAmount =
            row.paidAmount !== undefined ? Math.max(row.paidAmount, 0) : fullPayable
          const partial = paidAmount < fullPayable

          if (partial) hasPartialRows = true

          collectedSubmissions.push({
            FeeType: `${month.toUpperCase()} Tuition Fee`,
            OriginalAmount: originalAmount,
            DiscountAmount: discountAmount,
            PaidAmount: paidAmount,
            PaymentMethod: row.paymentMode,
            PaymentDate: collectionDate,
            SubmittedDate: collectionDate,
            PaymentStatus: partial ? 'PARTIAL' : 'SUCCESS',
          })

          createFeeSubmission({
            ...basePayload,
            paymentMode: row.paymentMode,
            remarks: row.remarks,
            feeType: `${month.toUpperCase()}_TUITION`,
            transactionId: `${baseTxn}_${month}_TUITION`,
            originalAmount,
            discountAmount,
            paidAmount,
            paymentStatus: partial ? 'PARTIAL' : 'SUCCESS',
          })
        }

        if (row.includeTransport) {
          const transportFee = getTransportFeeForType(row.type)
          if (transportFee > 0) {
            collectedSubmissions.push({
              FeeType: `${month.toUpperCase()} Transport Fee`,
              OriginalAmount: transportFee,
              DiscountAmount: 0,
              PaidAmount: transportFee,
              PaymentMethod: row.paymentMode,
              PaymentDate: collectionDate,
              SubmittedDate: collectionDate,
            })
            createFeeSubmission({
              ...basePayload,
              paymentMode: row.paymentMode,
              remarks: row.remarks,
              feeType: `TRANSPORT_${month.toUpperCase()}`,
              transactionId: `${baseTxn}_${month}_TRANSPORT`,
              originalAmount: transportFee,
              discountAmount: 0,
              paidAmount: transportFee,
            })
          }
        }
        continue
      }

      // ── Other fees ──
      const amount = Number(row.amount)
      if (!amount) continue

      collectedSubmissions.push({
        FeeType: row.type.replace(/_/g, ' ').toUpperCase(),
        OriginalAmount: amount,
        DiscountAmount: 0,
        PaidAmount: amount,
        PaymentMethod: row.paymentMode,
        PaymentDate: collectionDate,
        SubmittedDate: collectionDate,
      })
      createFeeSubmission({
        ...basePayload,
        paymentMode: row.paymentMode,
        remarks: row.remarks,
        feeType: row.type.replace('_fee', '').toUpperCase(),
        transactionId: `${baseTxn}_${row.id}`,
        originalAmount: amount,
        discountAmount: 0,
        paidAmount: amount,
      })
    }

    if (hasPartialRows) {
      toast.warning('Partial payment recorded — remaining balance saved as partial fee')
    } else {
      toast.success('Fees collected successfully')
    }

    if (collectedSubmissions.length > 0) await handleDownloadSlip(collectedSubmissions)
  }

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <>
      <Card className="rounded-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle>Pay Fees</CardTitle>
          {pendingAmount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-red-300 bg-red-50 dark:bg-red-950 dark:border-red-800">
              <AlertCircle className="h-3.5 w-3.5 text-red-600" />
              <span className="text-xs font-medium text-red-700 dark:text-red-400">
                Pending
              </span>
              <span className="text-sm font-bold text-red-700 dark:text-red-400">
                ₹{pendingAmount.toLocaleString('en-IN')}
              </span>
            </div>
          )}
          {partialFees.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-amber-300 bg-amber-50 dark:bg-amber-950 dark:border-amber-800">
              <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
              <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                {partialFees.length} Partial Payment{partialFees.length > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="type">Fee Type</TabsTrigger>
              <TabsTrigger value="quarter">Quarterly</TabsTrigger>
            </TabsList>

            {/* ── TYPE TAB ── */}
            <TabsContent value="type" className="space-y-3 pt-2">
              {feeRows.map((row, index) => {
                const feesForGroup = getFeesForGroup(row.group)
                const isTuition =
                  row.type.includes('tuition') || row.type.includes('tution')
                const partial = isRowPartial(row)
                const remaining = remainingForRow(row)

                return (
                  <div
                    key={row.id}
                    className={`border rounded-lg p-5 space-y-4 transition-colors ${
                      partial
                        ? 'border-amber-300 bg-amber-50/40 dark:bg-amber-950/20'
                        : 'bg-muted/10'
                    }`}
                  >
                    {/* Row header */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Fee Entry {index + 1}
                      </span>
                      <div className="flex items-center gap-2">
                        {partial && (
                          <Badge
                            variant="outline"
                            className="text-xs border-amber-400 text-amber-600"
                          >
                            Partial — ₹{remaining} remaining
                          </Badge>
                        )}
                        {index > 0 && (
                          <button
                            onClick={() => removeRow(row.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Row 1 — Group + Type + Amounts */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {/* Group */}
                      <Field label="Fee Group">
                        <Select
                          value={row.group}
                          onValueChange={(val) =>
                            updateRow(row.id, {
                              group: val,
                              type: '',
                              amount: 0,
                              paidAmount: undefined,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select group" />
                          </SelectTrigger>
                          <SelectContent>
                            {feeGroups.map((g) => (
                              <SelectItem key={g} value={g}>
                                {g === 'partial_fee'
                                  ? '⚠ Partial Fees'
                                  : g
                                      .replace('_fee', '')
                                      .replace(/_/g, ' ')
                                      .toUpperCase()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>

                      {/* Type */}
                      <Field label="Fee Type">
                        <Select
                          value={row.type}
                          onValueChange={(val) => {
                            const fee = feesForGroup.find((f) => f.key === val)
                            updateRow(row.id, {
                              type: val,
                              amount: fee?.value || 0,
                              paidAmount: undefined,
                            })
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {feesForGroup.map(({ key, label, value }) => (
                              <SelectItem key={key} value={key}>
                                {label} — ₹{Number(value).toLocaleString('en-IN')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>

                      {/* Amount to pay — editable for tuition only */}
                      <Field label={isTuition ? 'Amount to Pay' : 'Original Amount'}>
                        {isTuition ? (
                          <Input
                            type="number"
                            min={0}
                            max={row.amount}
                            value={
                              row.paidAmount !== undefined ? row.paidAmount : row.amount
                            }
                            onChange={(e) =>
                              updateRow(row.id, {
                                paidAmount: Number(e.target.value),
                              })
                            }
                          />
                        ) : (
                          <Input value={row.amount} disabled />
                        )}
                      </Field>

                      {/* Transport (read-only, only relevant for tuition) */}
                      {isTuition && (
                        <Field label="Transport Fee">
                          <Input
                            value={
                              row.includeTransport ? getTransportFeeForType(row.type) : 0
                            }
                            disabled
                          />
                        </Field>
                      )}
                    </div>

                    {/* Row 2 — Tuition toggles + discount + payable */}
                    {isTuition && (
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-end">
                        <Field label="Include Tuition">
                          <div className="flex items-center h-9">
                            <Switch
                              checked={row.includeTuition}
                              onCheckedChange={(val) =>
                                updateRow(row.id, { includeTuition: val })
                              }
                            />
                          </div>
                        </Field>

                        <Field label="Include Transport">
                          <div className="flex items-center h-9">
                            <Switch
                              checked={row.includeTransport}
                              onCheckedChange={(val) =>
                                updateRow(row.id, { includeTransport: val })
                              }
                            />
                          </div>
                        </Field>

                        <Field label={`Discount${!row.includeTuition ? ' (N/A)' : ''}`}>
                          <Input value={row.includeTuition ? row.discount : 0} disabled />
                        </Field>

                        <Field label="Payable Amount">
                          <Input
                            value={calculateRowPayable(row)}
                            disabled
                            className={
                              partial
                                ? 'border-amber-400 text-amber-700 font-semibold'
                                : ''
                            }
                          />
                        </Field>

                        {partial && (
                          <div className="flex items-end pb-2">
                            <p className="text-xs text-amber-600 leading-tight">
                              ₹{remaining} will be saved as partial
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Row 3 — Payment mode + remarks */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field label="Payment Mode">
                        <Input
                          placeholder="e.g. Cash, UPI, Cheque"
                          value={row.paymentMode}
                          onChange={(e) =>
                            updateRow(row.id, { paymentMode: e.target.value })
                          }
                        />
                      </Field>

                      <Field label="Remarks">
                        <Input
                          placeholder="Optional"
                          value={row.remarks}
                          onChange={(e) => updateRow(row.id, { remarks: e.target.value })}
                        />
                      </Field>
                    </div>
                  </div>
                )
              })}

              <Button variant="outline" size="sm" onClick={addRow} className="gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                Add Fee Entry
              </Button>
            </TabsContent>

            {/* ── QUARTER TAB ── */}
            <TabsContent value="quarter" className="pt-2">
              <div className="grid md:grid-cols-4 gap-4 border rounded-lg p-5 bg-muted/10">
                <Field label="Quarter">
                  <Select value={quarter} onValueChange={setQuarter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select quarter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Q1 — Apr to Jun</SelectItem>
                      <SelectItem value="2">Q2 — Jul to Sep</SelectItem>
                      <SelectItem value="3">Q3 — Oct to Dec</SelectItem>
                      <SelectItem value="4">Q4 — Jan to Mar</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="Include Tuition">
                  <div className="flex items-center h-9">
                    <Switch
                      checked={includeTuition}
                      onCheckedChange={setIncludeTuition}
                    />
                  </div>
                </Field>

                <Field label="Include Transport">
                  <div className="flex items-center h-9">
                    <Switch
                      checked={includeTransport}
                      onCheckedChange={setIncludeTransport}
                    />
                  </div>
                </Field>

                <Field label="Quarter Total">
                  <Input
                    value={`₹${quarterTotal.toLocaleString('en-IN')}`}
                    disabled
                    className="font-semibold"
                  />
                </Field>
              </div>
            </TabsContent>
          </Tabs>

          {/* Collection date + submit */}
          <div className="flex items-end justify-between gap-4 pt-2 border-t">
            <Field label="Collection Date">
              <Input type="date" value={collectionDate} disabled className="w-44" />
            </Field>

            <Button onClick={handleSubmit} disabled={isLoading} className="min-w-32">
              {isLoading ? 'Processing…' : 'Collect Fees'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <FeeStructureSection
        structure={structure}
        feesData={feesData}
        transportHistory={transportHistory}
        transportFee={transportRoutePrice}
      />
    </>
  )
}
