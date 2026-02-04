import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
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

import { useStudent } from '@/hooks/useStudents'
import { useFeeStructureByClass } from '@/hooks/useFeeStructure'

export function CollectFeesDialog({ studentId }) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [remarks, setRemarks] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const academicYear = '2025-2026'

  const {
    data: student,
    isLoading,
    isError,
    refetch,
  } = useStudent(studentId, { enabled: false })

  const {
    data: structure,
    isLoading: isLoadingStructure,
    isError: isErrorStructure,
    refetch: refetchStructure,
  } = useFeeStructureByClass({
    classId: student?.ClassID,
    academicYear: academicYear,
    enabled: !!student?.ClassID,
  })

  useEffect(() => {
    setSelectedType('')
    setAmount('')
  }, [selectedGroup])

  useEffect(() => {
    if (open) {
      refetch()
      if (student?.ClassID) refetchStructure()
    }
  }, [open, student, refetch, refetchStructure])

  const feeGroups = structure
    ? [
        ...new Set(
          Object.keys(structure)
            .filter((key) => key.includes('_fee'))
            .map((key) => (key.includes('tuition') ? 'tuition_fee' : key))
        ),
      ]
    : []

  const feesForGroup = structure
    ? Object.entries(structure)
        .filter(([key]) => {
          if (!selectedGroup) return false

          if (selectedGroup === 'tuition_fee') {
            return key.includes('tuition_fee')
          }

          return key === selectedGroup
        })
        .map(([key, value]) => ({ key, value }))
    : []

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="text-xs">Collect Fees</Button>
      </DialogTrigger>

      <DialogContent className="min-w-[70%]">
        <DialogHeader>
          <DialogTitle>Collect Fees</DialogTitle>
          <DialogDescription>Collect Fees</DialogDescription>
        </DialogHeader>

        {(isLoading || isLoadingStructure) && <p>Loading...</p>}
        {(isError || isErrorStructure) && <p>Failed to load data</p>}

        {student && structure && (
          <div className="space-y-6">
            {/* Student Info */}
            <div className="flex flex-col gap-4 rounded-lg bg-muted p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={
                    student.PhotoUrl ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      student.FullName || 'Student'
                    )}`
                  }
                  alt="Student Profile"
                  className="size-10 rounded-full object-cover sm:size-12"
                />
                <div>
                  <p className="text-sm font-medium">{student.FullName}</p>
                  <p className="text-xs text-muted-foreground">
                    Class {student.ClassID}, Section {student.SectionID}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 sm:gap-10">
                <div>
                  <p className="text-xs text-muted-foreground">Total Outstanding</p>
                  <p className="text-sm font-semibold">₹ 2000</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Last Date</p>
                  <p className="text-sm font-semibold">25 May 2024</p>
                </div>

                <Badge variant="destructive" className="text-xs">
                  Unpaid
                </Badge>
              </div>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Fees Group */}
              <InputGroup>
                <Label>Fees Group</Label>
                <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Group" />
                  </SelectTrigger>
                  <SelectContent>
                    {feeGroups.map((group) => (
                      <SelectItem key={group} value={group}>
                        {group.replace('_fee', '').replace('_', ' ').toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </InputGroup>

              {/* Fees Type */}

              <InputGroup>
                <Label>Fees Type</Label>
                <Select
                  value={selectedType}
                  onValueChange={(val) => {
                    setSelectedType(val)

                    const fee = feesForGroup.find((f) => f.key === val)
                    if (fee) setAmount(fee.value)
                  }}
                  disabled={!selectedGroup}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>

                  <SelectContent>
                    {feesForGroup.map(({ key, value }) => (
                      <SelectItem key={key} value={key}>
                        {key.replace(/_/g, ' ').toUpperCase()} — ₹{value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </InputGroup>

              {/* Amount */}
              <InputGroup>
                <Label>Amount</Label>
                <Input
                  type="number"
                  placeholder="Enter Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </InputGroup>

              {/* Collection Date */}
              <InputGroup>
                <Label>Collection Date</Label>
                <Input type="date" />
              </InputGroup>

              {/* Payment Type */}
              <InputGroup>
                <Label>Payment Type</Label>
                <Input placeholder="Select" />
              </InputGroup>

              {/* Payment Reference */}
              <InputGroup>
                <Label>Payment Reference No</Label>
                <Input placeholder="Enter Reference No" />
              </InputGroup>
            </div>

            {/* Notes */}
            <div>
              <Label>Notes</Label>
              <Input
                placeholder="Add Notes"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button>Pay Fees</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function InputGroup({ children }) {
  return <div className="space-y-1">{children}</div>
}
