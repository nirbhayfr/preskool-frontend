import { useState, useMemo, useEffect } from 'react'
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
import { useCreateFeeSubmission, useDeductFees } from '@/hooks/useFeeSubmissions'
import { useStudentTransportHistory } from '@/hooks/useTransportHistory'
import { useTransport } from '@/hooks/useTransport'

import { toast } from 'sonner'
import FeeStructureSection from './FeeStructureSection'

export default function PayFeesSection({ student, feesData }) {
  const academicYear = '2025-2026'

  const [tab, setTab] = useState('type')
  const [selectedGroup, setSelectedGroup] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [quarter, setQuarter] = useState('')

  const [originalAmount, setOriginalAmount] = useState('')
  const [discount, setDiscount] = useState(
    student?.DiscountAmount ? Number(student.DiscountAmount) : 0
  )
  // const [payableAmount, setPayableAmount] = useState('')

  const [paymentMode, setPaymentMode] = useState('')
  const [collectionDate, setCollectionDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [remarks, setRemarks] = useState('')

  const [transportFee, setTransportFee] = useState('')

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

  const payableAmount = Math.max(
    Number(originalAmount || 0) + Number(transportFee || 0) - Number(discount || 0),
    0
  )

  /* ---------------- TRANSPORT PRICE ---------------- */

  const transportRoutePrice = useMemo(() => {
    if (!transportHistory?.months?.length || !transport?.length) return 0

    const routeMonth = transportHistory.months.find((m) => m?.Route && m.Route !== 'N/A')
    if (!routeMonth) return 0

    const routeTransport = transport.find(
      (t) => t?.TransportNumber === routeMonth.VehicleNo
    )

    return routeTransport?.Price ?? 0
  }, [transportHistory, transport])

  /* ---------------- PENDING CALC ---------------- */

  const pendingAmount = Number(student?.PendingFee || 0)

  /* ---------------- FEE GROUPS ---------------- */

  const feeGroups = useMemo(() => {
    if (!structure) return []

    const groups = [
      ...new Set(
        Object.keys(structure)
          .filter((k) => k.includes('_fee'))
          .map((k) => (k.includes('tuition') || k.includes('tution') ? 'tuition_fee' : k))
      ),
    ]

    return ['pending_fee', ...groups]
  }, [structure])

  /* ---------------- FEES FOR GROUP ---------------- */

  const feesForGroup = useMemo(() => {
    if (!selectedGroup || !structure) return []

    if (selectedGroup === 'pending_fee') {
      return [
        {
          key: 'pending_fee',
          label: 'PENDING FEES',
          value: pendingAmount,
        },
      ]
    }

    return Object.entries(structure)
      .filter(([key]) => {
        if (selectedGroup === 'tuition_fee')
          return key.includes('tuition_fee') || key.includes('tution_fee')

        return key === selectedGroup
      })
      .map(([key, value]) => ({
        key,
        label: key.replace(/_/g, ' ').toUpperCase(),
        value,
      }))
  }, [structure, selectedGroup, pendingAmount])

  /* ---------------- SELECTED MONTH ---------------- */

  const selectedMonth = useMemo(() => {
    if (!selectedType) return null
    return selectedType.split('_')[0]
  }, [selectedType])

  /* ---------------- TRANSPORT FEE ---------------- */

  const transportFeeForMonth = useMemo(() => {
    if (!selectedMonth) return 0
    if (!transportHistory?.months?.length) return 0

    const month = transportHistory.months.find(
      (m) =>
        m.MonthName?.toLowerCase().startsWith(selectedMonth) &&
        m.Route &&
        m.Route !== 'N/A'
    )

    return month ? transportRoutePrice : 0
  }, [selectedMonth, transportHistory, transportRoutePrice])

  useEffect(() => {
    setTransportFee(transportFeeForMonth)
  }, [transportFeeForMonth])

  /* ---------------- TOTAL ---------------- */

  const totalAmount = Number(originalAmount || 0) + Number(transportFee || 0)

  /* ---------------- QUARTER TOTAL ---------------- */

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
      /* ---------- TUITION ---------- */

      const tuitionKey = Object.keys(structure).find(
        (k) => k.startsWith(month) && (k.includes('tuition') || k.includes('tution'))
      )

      if (tuitionKey) {
        total += Number(structure[tuitionKey] || 0)
      }

      /* ---------- TRANSPORT ---------- */

      const monthTransport = transportHistory?.months?.find((m) =>
        m.MonthName?.toLowerCase().startsWith(month)
      )

      if (monthTransport?.Route && monthTransport.Route !== 'N/A') {
        total += Number(transportRoutePrice || 0)
      }
    })

    return total
  }, [quarter, structure, transportHistory, transportRoutePrice])

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async () => {
    if (!paymentMode) return

    if (tab === 'type' && !selectedType) return
    if (tab === 'quarter' && !quarter) return

    const baseTxn = `TXN${Date.now()}`

    const basePayload = {
      studentId: Number(student.StudentID),
      paymentMode,
      paymentStatus: 'SUCCESS',
      submittedBy: 'Accountant',
      submittedDate: collectionDate,
      remarks,
    }

    const quarterMonths = {
      1: ['apr', 'may', 'jun'],
      2: ['jul', 'aug', 'sep'],
      3: ['oct', 'nov', 'dec'],
      4: ['jan', 'feb', 'mar'],
    }

    console.log(tab)

    /* ---------- PENDING FEES ---------- */

    if (tab === 'type' && selectedType === 'pending_fee') {
      createFeeSubmission({
        ...basePayload,
        feeType: 'PENDING_FEES',
        transactionId: `${baseTxn}_PENDING`,
        originalAmount: Number(originalAmount),
        discountAmount: Number(discount || 0),
        paidAmount: Number(payableAmount),
      })
      deductFees({
        studentId: Number(student.StudentID),
        amount: Number(payableAmount),
      })

      toast.success('Pending fees cleared')
      return
    }

    /* ---------- NON MONTHLY FEES ---------- */

    if (tab === 'type' && !selectedType.includes('tuition')) {
      createFeeSubmission({
        ...basePayload,
        feeType: selectedType.replace('_fee', '').toUpperCase(),
        transactionId: `${baseTxn}`,
        originalAmount: Number(originalAmount),
        discountAmount: Number(discount || 0),
        paidAmount: Number(payableAmount),
      })

      toast.success('Fees collected successfully')
      return
    }

    let monthsToPay = []

    /* ---------- MONTH PAYMENT ---------- */

    if (tab === 'type' && selectedType.includes('tuition')) {
      const month = selectedType.split('_')[0]
      monthsToPay = [month]
    }

    /* ---------- QUARTER PAYMENT ---------- */

    if (tab === 'quarter') {
      monthsToPay = quarterMonths[quarter] || []
    }

    console.log(monthsToPay)

    for (const month of monthsToPay) {
      const tuitionKey = Object.keys(structure).find(
        (k) => k.startsWith(month) && (k.includes('tuition') || k.includes('tution'))
      )

      const tuitionAmount = tuitionKey ? Number(structure[tuitionKey]) : 0

      if (tuitionAmount > 0) {
        await createFeeSubmission({
          ...basePayload,
          feeType: `${month.toUpperCase()}_TUITION`,
          transactionId: `${baseTxn}_${month}_TUITION`,
          originalAmount: tuitionAmount,
          discountAmount: Number(discount || 0) / monthsToPay.length,
          paidAmount: tuitionAmount,
        })
      }

      const monthTransport = transportHistory?.months?.find((m) =>
        m.MonthName?.toLowerCase().startsWith(month)
      )

      if (monthTransport?.Route && monthTransport.Route !== 'N/A') {
        await createFeeSubmission({
          ...basePayload,
          feeType: `TRANSPORT_${month.toUpperCase()}`,
          transactionId: `${baseTxn}_${month}_TRANSPORT`,
          originalAmount: transportRoutePrice,
          discountAmount: 0,
          paidAmount: transportRoutePrice,
        })
      }
    }

    toast.success('Fees collected successfully')
  }

  return (
    <>
      <Card className="rounded-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pay Fees</CardTitle>

          {/* Pending Fee Highlight */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-md text-sm border-red-700 border">
            <span className="font-medium text-red-700">Pending Fee</span>
            <span className="font-semibold text-red-800">₹{pendingAmount || 0}</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="type">Fee Type</TabsTrigger>
              <TabsTrigger value="quarter">Quarterly</TabsTrigger>
            </TabsList>

            {/* ---------------- TYPE ---------------- */}

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
                          {group.replace('_fee', '').toUpperCase()}
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

                      if (fee) setOriginalAmount(fee.value)
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
                  <Input
                    type="number"
                    value={originalAmount}
                    onChange={(e) => setOriginalAmount(e.target.value)}
                    disabled
                  />
                </Field>
              </div>

              {selectedMonth && (
                <div className="grid md:grid-cols-3 gap-4">
                  <Field label="Base Fee">
                    <Input
                      type="number"
                      value={originalAmount}
                      onChange={(e) => setOriginalAmount(e.target.value)}
                      disabled
                    />
                  </Field>

                  <Field label="Transport Fee">
                    <Input
                      type="number"
                      value={transportFee}
                      onChange={(e) => setTransportFee(e.target.value)}
                      disabled
                    />
                  </Field>

                  <Field label="Total">
                    <Input type="number" value={totalAmount} disabled />
                  </Field>
                </div>
              )}
            </TabsContent>

            {/* ---------------- QUARTER ---------------- */}

            <TabsContent value="quarter">
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

                <Field label="Quarter Amount">
                  <Input value={quarterTotal} disabled />
                </Field>
              </div>
            </TabsContent>
          </Tabs>

          {/* ---------------- PAYMENT ---------------- */}

          <div className="grid md:grid-cols-4 gap-4">
            <Field label="Discount">
              <Input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                disabled
              />
            </Field>

            <Field label="Payable Amount">
              <Input type="number" value={payableAmount} disabled />
            </Field>

            <Field label="Payment Mode">
              <Input onChange={(e) => setPaymentMode(e.target.value)} />
            </Field>

            <Field label="Remarks">
              <Input onChange={(e) => setRemarks(e.target.value)} />
            </Field>

            <Field label="Collection Date">
              <Input
                type="date"
                value={collectionDate}
                onChange={(e) => setCollectionDate(e.target.value)}
                disabled
              />
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
