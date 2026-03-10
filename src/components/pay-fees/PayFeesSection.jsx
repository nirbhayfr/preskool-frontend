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
import { useFeeStructureByClass } from '@/hooks/useFeeStructure'
import { useCreateFeeSubmission } from '@/hooks/useFeeSubmissions'
import { toast } from 'sonner'
import FeeStructureSection from './FeeStructureSection'
import { useStudentTransportHistory } from '@/hooks/useTransportHistory'
import { useTransport } from '@/hooks/useTransport'

export default function PayFeesSection({ student }) {
  const academicYear = '2025-2026'

  const [tab, setTab] = useState('type')
  const [selectedGroup, setSelectedGroup] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [quarter, setQuarter] = useState('')

  const [originalAmount, setOriginalAmount] = useState('')
  const [discount, setDiscount] = useState('200')
  const [payableAmount, setPayableAmount] = useState('')

  const [paymentMode, setPaymentMode] = useState('')
  const [paymentRef, setPaymentRef] = useState('')
  const [collectionDate, setCollectionDate] = useState('')
  const [remarks, setRemarks] = useState('')

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

  /* ---------------- TRANSPORT ROUTE PRICE ---------------- */

  const transportRoutePrice = useMemo(() => {
    if (!transportHistory?.months.length || !transport?.length) return 0

    const routeMonth = transportHistory.months.find((m) => m?.Route && m.Route !== 'N/A')

    if (!routeMonth) return 0

    const routeTransport = transport.find(
      (t) => t?.TransportNumber && t.TransportNumber === routeMonth.VehicleNo
    )

    return routeTransport?.Price ?? 0
  }, [transportHistory, transport])
  /* ---------------- TRANSPORT MONTHS ---------------- */

  const transportMonths = useMemo(() => {
    if (!transportHistory?.months?.length) return []

    return transportHistory.months
      .filter((m) => m?.Route && m.Route !== 'N/A')
      .map((m) => ({
        key: `transport_${m.MonthNumber}`,
        label: m.MonthName,
        value: transportRoutePrice,
      }))
  }, [transportHistory, transportRoutePrice])

  /* ---------------- FEE GROUPS ---------------- */

  const feeGroups = useMemo(() => {
    if (!structure) return []

    const groups = [
      ...new Set(
        Object.keys(structure)
          .filter((k) => k.includes('_fee'))
          .map((k) => (k.includes('tuition') ? 'tuition_fee' : k))
      ),
    ]

    if (transportMonths.length > 0) {
      groups.push('transport_fee')
    }

    if (student?.PendingFee > 0) {
      groups.push('pending_fee')
    }

    return groups
  }, [structure, transportMonths, student])

  /* ---------------- FEES FOR SELECTED GROUP ---------------- */

  const feesForGroup = useMemo(() => {
    if (!selectedGroup) return []

    if (selectedGroup === 'transport_fee') {
      return transportMonths
    }

    if (selectedGroup === 'pending_fee') {
      return [
        {
          key: 'pending_fee',
          label: 'Pending Fee',
          value: student?.PendingFee || 0,
        },
      ]
    }

    if (!structure) return []

    return Object.entries(structure)
      .filter(([key]) => {
        if (selectedGroup === 'tuition_fee') return key.includes('tuition_fee')
        return key === selectedGroup
      })
      .map(([key, value]) => ({
        key,
        label: key.replace(/_/g, ' ').toUpperCase(),
        value,
      }))
  }, [structure, selectedGroup, transportMonths, student])

  /* ---------------- AMOUNT HANDLERS ---------------- */

  const handleOriginalChange = (value) => {
    const original = Number(value || 0)
    const disc = Number(discount || 0)

    setOriginalAmount(value)
    setPayableAmount(Math.max(original - disc, 0))
  }

  const handleDiscountChange = (value) => {
    const disc = Number(value || 0)
    const original = Number(originalAmount || 0)

    setDiscount(value)
    setPayableAmount(Math.max(original - disc, 0))
  }

  const handlePayableChange = (value) => {
    const payable = Number(value || 0)
    const original = Number(originalAmount || 0)

    setPayableAmount(value)
    setDiscount(Math.max(original - payable, 0))
  }

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = () => {
    if (!originalAmount || !paymentMode) return

    const payload = {
      studentId: Number(student.StudentID),
      transactionId: paymentRef || `TXN${Date.now()}`,
      feeType:
        tab === 'type'
          ? selectedType.replace('_fee', '').toUpperCase()
          : `QUARTER_${quarter}`,
      originalAmount: Number(originalAmount),
      discountAmount: Number(discount),
      paidAmount: Number(payableAmount),
      paymentMode,
      paymentStatus: 'SUCCESS',
      submittedBy: 'Accountant',
      submittedDate: collectionDate,
      remarks,
    }

    createFeeSubmission(payload, {
      onSuccess: () => {
        toast.success('Fees collected successfully')
      },
    })
  }

  console.log(transportHistory, transport)

  return (
    <>
      <Card className="rounded-sm">
        <CardHeader>
          <CardTitle>Pay Fees</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="type">Fee Type</TabsTrigger>
              <TabsTrigger value="quarter">Quarterly</TabsTrigger>
            </TabsList>

            <TabsContent value="type" className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <Field label="Fees Group">
                  <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select group" />
                    </SelectTrigger>

                    <SelectContent>
                      {feeGroups.map((group) => (
                        <SelectItem key={group} value={group}>
                          {group.replace('_fee', '').replace('_', ' ').toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="Fees Type">
                  <Select
                    value={selectedType}
                    onValueChange={(val) => {
                      setSelectedType(val)

                      const fee = feesForGroup.find((f) => f.key === val)

                      if (fee) {
                        setOriginalAmount(fee.value)
                        setPayableAmount(fee.value - Number(discount || 0))
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>

                    <SelectContent>
                      {feesForGroup.map(({ key, value, label }) => (
                        <SelectItem key={key} value={key}>
                          {label || key.replace(/_/g, ' ').toUpperCase()} — ₹{value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="Original Amount">
                  <Input
                    type="number"
                    value={originalAmount}
                    onChange={(e) => handleOriginalChange(e.target.value)}
                  />
                </Field>
              </div>
            </TabsContent>

            <TabsContent value="quarter" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Quarter">
                  <Select value={quarter} onValueChange={setQuarter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select quarter" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="1">Q1 • Apr – Jun</SelectItem>
                      <SelectItem value="2">Q2 • Jul – Sep</SelectItem>
                      <SelectItem value="3">Q3 • Oct – Dec</SelectItem>
                      <SelectItem value="4">Q4 • Jan – Mar</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="Original Amount">
                  <Input
                    type="number"
                    value={originalAmount}
                    onChange={(e) => handleOriginalChange(e.target.value)}
                  />
                </Field>
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid md:grid-cols-4 gap-4">
            <Field label="Discount">
              <Input
                type="number"
                value={discount}
                onChange={(e) => handleDiscountChange(e.target.value)}
              />
            </Field>

            <Field label="Payable Amount">
              <Input
                type="number"
                value={payableAmount}
                onChange={(e) => handlePayableChange(e.target.value)}
              />
            </Field>

            <Field label="Payment Mode">
              <Input
                placeholder="Cash / UPI / Bank"
                onChange={(e) => setPaymentMode(e.target.value)}
              />
            </Field>

            <Field label="Collection Date">
              <Input type="date" onChange={(e) => setCollectionDate(e.target.value)} />
            </Field>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Reference Number">
              <Input
                placeholder="Optional"
                onChange={(e) => setPaymentRef(e.target.value)}
              />
            </Field>

            <Field label="Remarks">
              <Input placeholder="Notes" onChange={(e) => setRemarks(e.target.value)} />
            </Field>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Collect Fees'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <FeeStructureSection structure={structure} />
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
