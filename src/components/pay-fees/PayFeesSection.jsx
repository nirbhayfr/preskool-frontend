import { useState, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

import { useFeeStructureByClass } from '@/hooks/useFeeStructure'
import { useCreateFeeSubmission, useDeductFees } from '@/hooks/useFeeSubmissions'
import { useStudentTransportHistory } from '@/hooks/useTransportHistory'
import { useTransport } from '@/hooks/useTransport'

import { toast } from 'sonner'
import { pdf } from '@react-pdf/renderer'
import FeeReceiptPDF from '@/components/pdfs/FeeReceiptPDF'
import FeeStructureSection from './FeeStructureSection'

export default function PayFeesSection({ student, feesData }) {
  const academicYear = '2025-2026'

  const [tab, setTab] = useState('type')
  const [quarter, setQuarter] = useState('')
  const [collectionDate] = useState(new Date().toISOString().split('T')[0])
  const [includeTuition, setIncludeTuition] = useState(true)
  const [includeTransport, setIncludeTransport] = useState(true)

  const [feeRows, setFeeRows] = useState([
    {
      id: Date.now(),
      group: '',
      type: '',
      amount: 0,
      includeTuition: true,
      includeTransport: true,
      discount: student?.DiscountAmount ? Number(student.DiscountAmount) : 0,
      paymentMode: '',
      remarks: '',
    },
  ])

  const addRow = () => {
    setFeeRows((prev) => [
      ...prev,
      {
        id: Date.now(),
        group: '',
        type: '',
        amount: 0,
        includeTuition: true,
        includeTransport: true,
        discount: student?.DiscountAmount ? Number(student.DiscountAmount) : 0,
        paymentMode: '',
        remarks: '',
      },
    ])
  }

  const removeRow = (id) => {
    setFeeRows((prev) => prev.filter((r) => r.id !== id))
  }

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

  const transportRoutePrice = useMemo(() => {
    if (!transportHistory?.months?.length || !transport?.length) return 0
    const routeMonth = transportHistory.months.find((m) => m?.Route && m.Route !== 'N/A')
    if (!routeMonth) return 0
    const routeTransport = transport.find(
      (t) => t?.TransportNumber === routeMonth.VehicleNo
    )
    return routeTransport?.Price ?? 0
  }, [transportHistory, transport])

  const pendingAmount = Number(student?.PendingFee || 0)

  const feeGroups = useMemo(() => {
    if (!structure) return []
    const groups = [
      ...new Set(
        Object.keys(structure)
          .filter((k) => k.includes('_fee'))
          .map((k) => (k.includes('tuition') ? 'tuition_fee' : k))
      ),
    ]
    return ['pending_fee', ...groups]
  }, [structure])

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

  const getFeesForGroup = (group) => {
    if (!group || !structure) return []

    if (group === 'pending_fee') {
      return [{ key: 'pending_fee', label: 'PENDING FEES', value: pendingAmount }]
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

  // ── Discount only applies when tuition is included and row is tuition type ──
  const calculateRowPayable = (row) => {
    let total = 0
    const isTuition = row.type.includes('tuition')

    if (isTuition) {
      if (row.includeTuition) {
        total += Number(row.amount || 0)
        total -= row.discount // discount only on tuition
      }
      if (row.includeTransport) total += getTransportFeeForType(row.type)
    } else {
      total += Number(row.amount || 0)
      // no discount for non-tuition fees
    }

    return Math.max(total, 0)
  }

  // ── Fee slip download ──────────────────────────────────────────────────────
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

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const baseTxn = `TXN${Date.now()}`
    const collectedSubmissions = []

    const basePayload = {
      studentId: Number(student.StudentID),
      paymentStatus: 'SUCCESS',
      submittedBy: 'Accountant',
      submittedDate: collectionDate,
    }

    // ── QUARTER TAB ──────────────────────────────────────────────────────────
    if (tab === 'quarter') {
      if (!quarter) return

      const quarterMonths = {
        1: ['apr', 'may', 'jun'],
        2: ['jul', 'aug', 'sep'],
        3: ['oct', 'nov', 'dec'],
        4: ['jan', 'feb', 'mar'],
      }

      const months = quarterMonths[quarter] || []

      months.forEach((month) => {
        const tuitionKey = Object.keys(structure).find(
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

    // ── TYPE TAB ─────────────────────────────────────────────────────────────
    for (const row of feeRows) {
      if (!row.type) continue

      const isTuition = row.type.includes('tuition')
      const isPending = row.type === 'pending_fee'
      const month = row.type.split('_')[0]

      if (isTuition) {
        if (row.includeTuition) {
          const discountAmount = row.discount
          const paidAmount = Math.max(Number(row.amount) - discountAmount, 0)

          collectedSubmissions.push({
            FeeType: `${month.toUpperCase()} Tuition Fee`,
            OriginalAmount: Number(row.amount),
            DiscountAmount: discountAmount,
            PaidAmount: paidAmount,
            PaymentMethod: row.paymentMode,
            PaymentDate: collectionDate,
            SubmittedDate: collectionDate,
          })

          createFeeSubmission({
            ...basePayload,
            paymentMode: row.paymentMode,
            remarks: row.remarks,
            feeType: `${month.toUpperCase()}_TUITION`,
            transactionId: `${baseTxn}_${month}_TUITION`,
            originalAmount: Number(row.amount),
            discountAmount,
            paidAmount,
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

      if (isPending) {
        collectedSubmissions.push({
          FeeType: 'Pending Fee',
          OriginalAmount: Number(row.amount),
          DiscountAmount: 0,
          PaidAmount: Number(row.amount),
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
          originalAmount: Number(row.amount),
          discountAmount: 0,
          paidAmount: Number(row.amount),
        })

        deductFees({
          studentId: Number(student.StudentID),
          amount: Number(row.amount),
          paymentMode: row.paymentMode,
          remarks: row.remarks,
          submittedDate: collectionDate,
        })

        continue
      }

      // Other fee types
      collectedSubmissions.push({
        FeeType: row.type.replace(/_/g, ' ').toUpperCase(),
        OriginalAmount: Number(row.amount),
        DiscountAmount: 0,
        PaidAmount: Number(row.amount),
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
        originalAmount: Number(row.amount),
        discountAmount: 0,
        paidAmount: Number(row.amount),
      })
    }

    toast.success('Fees collected successfully')
    if (collectedSubmissions.length > 0) await handleDownloadSlip(collectedSubmissions)
  }

  return (
    <>
      <Card className="rounded-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pay Fees</CardTitle>

          <div className="flex items-center gap-2 px-4 py-2 rounded-md text-sm border-red-700 border">
            <span className="font-medium text-red-700">Pending Fee</span>
            <span className="font-semibold text-red-800">₹{pendingAmount}</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="type">Fee Type</TabsTrigger>
              <TabsTrigger value="quarter">Quarterly</TabsTrigger>
            </TabsList>

            {/* TYPE TAB */}
            <TabsContent value="type" className="space-y-4">
              {feeRows.map((row, index) => {
                const feesForGroup = getFeesForGroup(row.group)
                const isTuition = row.type.includes('tuition')

                return (
                  <div
                    key={row.id}
                    className="grid md:grid-cols-4 gap-6 items-end border p-5 rounded-md"
                  >
                    {/* Group */}
                    <Field label="Fees Group">
                      <Select
                        value={row.group}
                        onValueChange={(val) =>
                          setFeeRows((prev) =>
                            prev.map((r) =>
                              r.id === row.id
                                ? { ...r, group: val, type: '', amount: 0 }
                                : r
                            )
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select group" />
                        </SelectTrigger>
                        <SelectContent>
                          {feeGroups.map((group) => (
                            <SelectItem key={group} value={group}>
                              {group.replace('_fee', '').toUpperCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>

                    {/* Type */}
                    <Field label="Fees Type">
                      <Select
                        value={row.type}
                        onValueChange={(val) => {
                          const fee = feesForGroup.find((f) => f.key === val)
                          setFeeRows((prev) =>
                            prev.map((r) =>
                              r.id === row.id
                                ? { ...r, type: val, amount: fee?.value || 0 }
                                : r
                            )
                          )
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {feesForGroup.map(({ key, value, label }) => (
                            <SelectItem key={key} value={key}>
                              {label} — ₹{value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>

                    <Field label="Original Amount">
                      <Input value={row.amount} disabled />
                    </Field>

                    <Field label="Transport Fee">
                      <Input
                        value={
                          row.includeTransport ? getTransportFeeForType(row.type) : 0
                        }
                        disabled
                      />
                    </Field>

                    <div className="col-span-full grid md:grid-cols-5 gap-4 mt-2">
                      {/* Include Tuition — only show for tuition rows */}
                      {isTuition && (
                        <Field label="Include Tuition">
                          <Switch
                            checked={row.includeTuition}
                            onCheckedChange={(val) =>
                              setFeeRows((prev) =>
                                prev.map((r) =>
                                  r.id === row.id ? { ...r, includeTuition: val } : r
                                )
                              )
                            }
                          />
                        </Field>
                      )}

                      {/* Include Transport — only show for tuition rows */}
                      {isTuition && (
                        <Field label="Include Transport">
                          <Switch
                            checked={row.includeTransport}
                            onCheckedChange={(val) =>
                              setFeeRows((prev) =>
                                prev.map((r) =>
                                  r.id === row.id ? { ...r, includeTransport: val } : r
                                )
                              )
                            }
                          />
                        </Field>
                      )}

                      {/* Discount — only show and apply when tuition included */}
                      {isTuition && (
                        <Field label={`Discount${!row.includeTuition ? ' (N/A)' : ''}`}>
                          <Input value={row.includeTuition ? row.discount : 0} disabled />
                        </Field>
                      )}

                      <Field label="Payable Amount">
                        <Input value={calculateRowPayable(row)} disabled />
                      </Field>
                    </div>

                    <Field label="Payment Mode">
                      <Input
                        value={row.paymentMode}
                        onChange={(e) =>
                          setFeeRows((prev) =>
                            prev.map((r) =>
                              r.id === row.id ? { ...r, paymentMode: e.target.value } : r
                            )
                          )
                        }
                      />
                    </Field>

                    <Field label="Remarks">
                      <Input
                        value={row.remarks}
                        onChange={(e) =>
                          setFeeRows((prev) =>
                            prev.map((r) =>
                              r.id === row.id ? { ...r, remarks: e.target.value } : r
                            )
                          )
                        }
                      />
                    </Field>

                    {index > 0 && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeRow(row.id)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                )
              })}

              <Button variant="outline" onClick={addRow}>
                + Add Fee
              </Button>
            </TabsContent>

            {/* QUARTER TAB */}
            <TabsContent value="quarter" className="space-y-4">
              <div className="grid md:grid-cols-4 gap-4">
                <Field label="Quarter">
                  <Select value={quarter} onValueChange={setQuarter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select quarter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Apr - Jun</SelectItem>
                      <SelectItem value="2">Jul - Sep</SelectItem>
                      <SelectItem value="3">Oct - Dec</SelectItem>
                      <SelectItem value="4">Jan - Mar</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="Include Tuition">
                  <Switch checked={includeTuition} onCheckedChange={setIncludeTuition} />
                </Field>

                <Field label="Include Transport">
                  <Switch
                    checked={includeTransport}
                    onCheckedChange={setIncludeTransport}
                  />
                </Field>

                <Field label="Quarter Total">
                  <Input value={quarterTotal} disabled />
                </Field>
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid md:grid-cols-3 gap-4">
            <Field label="Collection Date">
              <Input type="date" value={collectionDate} disabled />
            </Field>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Collect Fees'}
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

function Field({ label, children }) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      {children}
    </div>
  )
}
