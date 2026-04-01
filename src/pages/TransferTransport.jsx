// pages/TransportRoutePage.jsx
import { useState, useMemo } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Bus,
  Search,
  Filter,
  MapPin,
  Users,
  Pencil,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Loader2,
  Truck,
  Route,
} from 'lucide-react'
import { toast } from 'sonner'

import { useTransportRoutes, useUpdateTransportRoute } from '@/hooks/useTransport'
import { useTransport } from '@/hooks/useTransport'
import { classes, sections } from '@/data/basicData'

export default function TransportRoutePage() {
  const [classId, setClassId] = useState('all')
  const [sectionId, setSectionId] = useState('all')
  const [searchName, setSearchName] = useState('')

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [editForm, setEditForm] = useState({
    TransportStatus: '',
    VehicleNo: '',
    Route: '',
  })

  const {
    data: routeData,
    isLoading: routesLoading,
    isError: routesError,
  } = useTransportRoutes({ classId, sectionId })

  const { data: transportData, isLoading: transportLoading } = useTransport()

  const updateMutation = useUpdateTransportRoute()

  const students = routeData?.data ?? []
  const transports = transportData ?? []

  const allRoutes = useMemo(() => {
    const routes = []
    transports.forEach((t) => {
      if (t.RouteName && t.Route) {
        routes.push({
          label: `${t.RouteName} — ${t.Route}`,
          value: `${t.RouteName} - ${t.Route}`,
          vehicleNo: t.TransportNumber,
          transportId: t.TransportID,
        })
      }
      if (t.RouteName1 && t.Route1) {
        routes.push({
          label: `${t.RouteName1} — ${t.Route1}`,
          value: `${t.RouteName1} - ${t.Route1}`,
          vehicleNo: t.TransportNumber,
          transportId: t.TransportID,
        })
      }
      if (t.RouteName2 && t.Route2) {
        routes.push({
          label: `${t.RouteName2} — ${t.Route2}`,
          value: `${t.RouteName2} - ${t.Route2}`,
          vehicleNo: t.TransportNumber,
          transportId: t.TransportID,
        })
      }
    })
    return routes
  }, [transports])

  const filtered = useMemo(() => {
    if (!searchName.trim()) return students
    return students.filter((s) =>
      s.FullName?.toLowerCase().includes(searchName.toLowerCase())
    )
  }, [students, searchName])

  const totalStudents = filtered.length
  const assignedCount = filtered.filter((s) => s.TransportStatus === 'Yes').length
  const unassignedCount = totalStudents - assignedCount

  const handleOpenEdit = (student) => {
    setSelectedStudent(student)
    setEditForm({
      TransportStatus: student.TransportStatus ?? 'No',
      VehicleNo: student.VehicleNo ?? '',
      Route: student.Route ?? '',
    })
    setEditDialogOpen(true)
  }

  const handleRouteSelect = (routeValue) => {
    const match = allRoutes.find((r) => r.value === routeValue)
    setEditForm((prev) => ({
      ...prev,
      Route: routeValue,
      VehicleNo: match?.vehicleNo ?? prev.VehicleNo,
    }))
  }

  const handleVehicleSelect = (vehicleNo) => {
    setEditForm((prev) => ({
      ...prev,
      VehicleNo: vehicleNo,
      Route: '',
    }))
  }

  const handleSave = () => {
    if (!selectedStudent) return

    updateMutation.mutate(
      {
        id: selectedStudent.StudentID,
        payload: {
          FullName: selectedStudent.FullName,
          ClassID: selectedStudent.ClassID,
          SectionID: selectedStudent.SectionID,
          TransportStatus: editForm.TransportStatus,
          VehicleNo: editForm.VehicleNo,
          Route: editForm.Route,
        },
      },
      {
        onSuccess: () => {
          toast.success('Transport route updated successfully!')
          setEditDialogOpen(false)
          setSelectedStudent(null)
        },
        onError: (err) => {
          toast.error(err?.response?.data?.message || 'Failed to update')
        },
      }
    )
  }

  const handleReset = () => {
    setClassId('all')
    setSectionId('all')
    setSearchName('')
  }

  const filteredRoutes = useMemo(() => {
    if (!editForm.VehicleNo) return allRoutes
    return allRoutes.filter((r) => r.vehicleNo === editForm.VehicleNo)
  }, [allRoutes, editForm.VehicleNo])

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Bus className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Transport Routes
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage student transport assignments &amp; routes
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="w-fit gap-2 border-dashed"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Filters
          </Button>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Students
                </p>
                <p className="text-3xl font-bold text-foreground">{totalStudents}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-chart-2/15 text-chart-2">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Assigned</p>
                <p className="text-3xl font-bold text-foreground">{assignedCount}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                <XCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unassigned</p>
                <p className="text-3xl font-bold text-foreground">{unassignedCount}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Filters ── */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-foreground">
              <Filter className="h-4 w-4 text-muted-foreground" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Class
                </Label>
                <Select value={classId} onValueChange={setClassId}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {classes.map((cls) => (
                      <SelectItem key={cls} value={String(cls)}>
                        {cls}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Section
                </Label>
                <Select value={sectionId} onValueChange={setSectionId}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sections</SelectItem>
                    {sections.map((sec) => (
                      <SelectItem key={sec} value={String(sec)}>
                        {sec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Search Student
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Type student name…"
                    className="pl-9 h-10"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Table ── */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {routesLoading ? (
              <div className="flex items-center justify-center gap-3 py-20">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="text-muted-foreground font-medium">
                  Loading students…
                </span>
              </div>
            ) : routesError ? (
              <div className="flex flex-col items-center justify-center py-20 text-destructive gap-2">
                <XCircle className="h-8 w-8" />
                <p className="font-medium">Failed to load data</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-2">
                <Users className="h-8 w-8" />
                <p className="font-medium">No students found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="font-semibold text-xs uppercase tracking-wide w-12">
                        #
                      </TableHead>
                      <TableHead className="font-semibold text-xs uppercase tracking-wide">
                        Student Name
                      </TableHead>
                      <TableHead className="font-semibold text-xs uppercase tracking-wide text-center">
                        Class
                      </TableHead>
                      <TableHead className="font-semibold text-xs uppercase tracking-wide text-center">
                        Section
                      </TableHead>
                      <TableHead className="font-semibold text-xs uppercase tracking-wide text-center">
                        Status
                      </TableHead>
                      <TableHead className="font-semibold text-xs uppercase tracking-wide">
                        Vehicle No.
                      </TableHead>
                      <TableHead className="font-semibold text-xs uppercase tracking-wide">
                        Route
                      </TableHead>
                      <TableHead className="font-semibold text-xs uppercase tracking-wide text-center">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((student, idx) => (
                      <TableRow
                        key={student.StudentID}
                        className="group hover:bg-accent/50 transition-colors"
                      >
                        <TableCell className="font-medium text-muted-foreground text-sm">
                          {idx + 1}
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                              {student.FullName?.charAt(0)?.toUpperCase()}
                            </div>
                            <span className="font-medium text-foreground">
                              {student.FullName}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="text-center">
                          <Badge variant="secondary" className="font-semibold">
                            {student.ClassID}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-center">
                          <Badge variant="outline" className="font-semibold">
                            {student.SectionID}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-center">
                          {student.TransportStatus === 'Yes' ? (
                            <Badge className="bg-chart-2/15 text-chart-2 hover:bg-chart-2/20 border-chart-2/20 gap-1 shadow-none border">
                              <CheckCircle2 className="h-3 w-3" />
                              Assigned
                            </Badge>
                          ) : (
                            <Badge
                              variant="secondary"
                              className="gap-1 text-muted-foreground"
                            >
                              <XCircle className="h-3 w-3" />
                              Unassigned
                            </Badge>
                          )}
                        </TableCell>

                        <TableCell>
                          {student.VehicleNo ? (
                            <div className="flex items-center gap-1.5 text-sm">
                              <Truck className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="font-mono text-foreground">
                                {student.VehicleNo}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground italic">
                              —
                            </span>
                          )}
                        </TableCell>

                        <TableCell>
                          {student.Route ? (
                            <div className="flex items-center gap-1.5 text-sm">
                              <MapPin className="h-3.5 w-3.5 text-chart-1" />
                              <span className="text-foreground max-w-[200px] truncate">
                                {student.Route}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground italic">
                              —
                            </span>
                          )}
                        </TableCell>

                        <TableCell className="text-center">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleOpenEdit(student)}
                            className="h-8 gap-1.5 text-primary hover:text-primary hover:bg-primary/10 opacity-70 group-hover:opacity-100 transition-opacity"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Edit Dialog ── */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent
            className="sm:max-w-lg"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-foreground">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Bus className="h-4 w-4" />
                </div>
                Edit Transport Assignment
              </DialogTitle>
              <DialogDescription>
                Update transport details for{' '}
                <span className="font-semibold text-foreground">
                  {selectedStudent?.FullName}
                </span>{' '}
                — Class {selectedStudent?.ClassID}, Section {selectedStudent?.SectionID}
              </DialogDescription>
            </DialogHeader>

            <Separator />

            <div className="space-y-5 py-2">
              {/* Transport Status */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  Transport Status
                </Label>
                <Select
                  modal={false}
                  value={editForm.TransportStatus}
                  onValueChange={(val) =>
                    setEditForm((prev) => ({
                      ...prev,
                      TransportStatus: val,
                      ...(val === 'No' && { VehicleNo: '', Route: '' }),
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent position="popper" sideOffset={4}>
                    <SelectItem value="Yes">
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-chart-2" />
                        Yes — Uses Transport
                      </span>
                    </SelectItem>
                    <SelectItem value="No">
                      <span className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-destructive" />
                        No — Does Not Use Transport
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {editForm.TransportStatus === 'Yes' && (
                <>
                  {/* Vehicle */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      Vehicle
                    </Label>
                    {transportLoading ? (
                      <div className="flex items-center gap-2 p-3 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading vehicles…
                      </div>
                    ) : (
                      <Select
                        modal={false}
                        value={editForm.VehicleNo}
                        onValueChange={handleVehicleSelect}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a vehicle" />
                        </SelectTrigger>
                        <SelectContent position="popper" sideOffset={4}>
                          {transports.map((t) => (
                            <SelectItem key={t.TransportID} value={t.TransportNumber}>
                              <div className="flex flex-col">
                                <span className="font-mono font-semibold">
                                  {t.TransportNumber} • {t.OwnerName}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {t.TransportType} • {t.TransporterName}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  {/* Route */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Route className="h-4 w-4 text-muted-foreground" />
                      Route
                    </Label>
                    {filteredRoutes.length === 0 && editForm.VehicleNo ? (
                      <p className="text-sm text-muted-foreground p-3 bg-secondary rounded-md border border-border">
                        No routes found for this vehicle.
                      </p>
                    ) : (
                      <Select
                        modal={false}
                        value={editForm.Route}
                        onValueChange={handleRouteSelect}
                        disabled={!editForm.VehicleNo}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              editForm.VehicleNo
                                ? 'Select a route'
                                : 'Select a vehicle first'
                            }
                          />
                        </SelectTrigger>
                        <SelectContent position="popper" sideOffset={4}>
                          {filteredRoutes.map((r, i) => (
                            <SelectItem key={`${r.value}-${i}`} value={r.value}>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-3.5 w-3.5 text-chart-1" />
                                {r.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  {/* Preview */}
                  {editForm.VehicleNo && editForm.Route && (
                    <div className="rounded-lg border bg-accent/50 p-4 space-y-1.5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                        Assignment Preview
                      </p>
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <Truck className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-medium">Vehicle:</span>
                        <span className="font-mono">{editForm.VehicleNo}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-medium">Route:</span>
                        <span>{editForm.Route}</span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={
                  updateMutation.isPending ||
                  (editForm.TransportStatus === 'Yes' &&
                    (!editForm.VehicleNo || !editForm.Route))
                }
                className="gap-2"
              >
                {updateMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
