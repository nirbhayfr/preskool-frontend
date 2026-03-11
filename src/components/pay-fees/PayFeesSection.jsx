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
import { useCreateFeeSubmission } from '@/hooks/useFeeSubmissions'
import { useStudentTransportHistory } from '@/hooks/useTransportHistory'
import { useTransport } from '@/hooks/useTransport'

import { toast } from 'sonner'
import FeeStructureSection from './FeeStructureSection'
import { createFeeSubmissionHelper, deductFeesHelper } from '@/api/fee-submissions'
import { useQueryClient } from '@tanstack/react-query'

const getStoredPending = (studentId) => {
  const val = sessionStorage.getItem(`pendingFee_${studentId}`)
  return val ? Number(val) : null
}

const setStoredPending = (studentId, value) => {
  sessionStorage.setItem(`pendingFee_${studentId}`, value)
}

export default function PayFeesSection({ student, feesData }) {
  const queryClient = useQueryClient()
  const academicYear = '2025-2026'

  const [tab, setTab] = useState('type')
  const [selectedGroup, setSelectedGroup] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [quarter, setQuarter] = useState('')

  const [originalAmount, setOriginalAmount] = useState('')
  const [discount, setDiscount] = useState('0')
  const [payableAmount, setPayableAmount] = useState('')

  const [paymentMode, setPaymentMode] = useState('')
  const [collectionDate, setCollectionDate] = useState('')
  const [remarks, setRemarks] = useState('')

  const [transportFee, setTransportFee] = useState('')

  /* ---------------- BULLETPROOF PENDING STATE ---------------- */

  const [localPendingFee, setLocalPendingFee] = useState(() => {
    if (!student?.StudentID) return null

    const stored = getStoredPending(student.StudentID)
    if (stored !== null) return stored

    return Number(student?.PendingFee || 0)
  })
  const [pendingLocked, setPendingLocked] = useState(false)

  /* Only initialize once per student */
  useEffect(() => {
    if (!pendingLocked && student?.PendingFee !== undefined) {
      setLocalPendingFee(Number(student.PendingFee))
    }
  }, [student?.StudentID, pendingLocked])

  const pendingAmount =
    localPendingFee !== null ? localPendingFee : Number(student?.PendingFee || 0)

  /* ---------------- DATA ---------------- */

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

  /* ---------------- MONTH ---------------- */

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

  useEffect(() => {
    const disc = Number(discount || 0)
    const calculated = Math.max(totalAmount - disc, 0)

    if (!payableAmount) {
      setPayableAmount(calculated)
    }
  }, [originalAmount, transportFee, discount])

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
      const tuitionKey = Object.keys(structure).find(
        (k) => k.startsWith(month) && (k.includes('tuition') || k.includes('tution'))
      )

      if (tuitionKey) {
        total += Number(structure[tuitionKey] || 0)
      }

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

  const handleSubmit = () => {
    if (!paymentMode || !selectedType) return

    const baseTxn = `TXN${Date.now()}`

    const basePayload = {
      studentId: Number(student.StudentID),
      paymentMode,
      paymentStatus: 'SUCCESS',
      submittedBy: 'Accountant',
      submittedDate: collectionDate,
      remarks,
    }

    /* ---------- PENDING FEES ---------- */
    if (selectedType === 'pending_fee') {
      const pay = Number(payableAmount)

      const submitPending = async () => {
        try {
          await deductFeesHelper({
            studentId: Number(student.StudentID),
            amount: pay,
          })

          // await createFeeSubmissionHelper({
          //   ...basePayload,
          //   feeType: 'PENDING_FEES',
          //   transactionId: `${baseTxn}_PENDING`,
          //   originalAmount: Number(originalAmount),
          //   discountAmount: Number(discount || 0),cd 
          //   paidAmount: pay,
          // })

          /* UPDATE REACT QUERY CACHE */

          queryClient.setQueryData(['student', student.StudentID], (old) => {
            if (!old) return old

            return {
              ...old,
              PendingFee: Math.max((old.PendingFee || 0) - pay, 0),
            }
          })

          toast.success('Pending fees cleared')
        } catch (err) {
          toast.error('Payment failed')
          console.error(err)
        }
      }

      submitPending()
      return
    }

    /* ---------- OTHER FEES ---------- */

    createFeeSubmission({
      ...basePayload,
      feeType: selectedType.replace('_fee', '').toUpperCase(),
      transactionId: `${baseTxn}`,
      originalAmount: Number(originalAmount),
      discountAmount: Number(discount || 0),
      paidAmount: Number(payableAmount),
    })

    toast.success('Fees collected successfully')
  }

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
                  />
                </Field>
              </div>
            </TabsContent>

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

          <div className="grid md:grid-cols-4 gap-4">
            <Field label="Discount">
              <Input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </Field>

            <Field label="Payable Amount">
              <Input
                type="number"
                value={payableAmount}
                onChange={(e) => setPayableAmount(e.target.value)}
              />
            </Field>

            <Field label="Payment Mode">
              <Input onChange={(e) => setPaymentMode(e.target.value)} />
            </Field>

            <Field label="Collection Date">
              <Input type="date" onChange={(e) => setCollectionDate(e.target.value)} />
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
