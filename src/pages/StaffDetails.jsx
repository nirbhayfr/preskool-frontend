import StaffDetailsAndInfoCard from '@/components/staff-details/StaffDetailsAndInfo'
import StaffDetailsTabsLayout from '@/components/staff-details/StaffDetailsTabs'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { PenBoxIcon, Trash } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useDeleteStaff } from '@/hooks/useStaff'

function StaffDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { mutate: deleteTeacher } = useDeleteStaff()

  const handleDelete = (id) => {
    deleteTeacher(id, {
      onSuccess: () => {
        navigate('/staff-list')
        toast.success('Staff deleted successfully')
      },
      onError: () => {
        toast.error('Failed to delete staff')
      },
    })
  }

  const handleEdit = (id) => {
    navigate(`/edit-staff/${id}`)
  }
  return (
    <section className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Staff Details</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Dashboard
            <span className="mx-1">{'>'}</span>
            <span className="font-medium text-foreground">Staff Details</span>
          </p>
        </div>

        <div className="flex gap-2">
          {/* Edit */}
          <Button onClick={() => handleEdit(id)}>
            <PenBoxIcon className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>

          {/* Delete */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDelete(id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 mt-6">
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
          <StaffDetailsAndInfoCard />
        </div>

        <div className="col-span-12 lg:col-span-9 flex flex-col gap-6">
          <StaffDetailsTabsLayout />
          <Outlet />
        </div>
      </div>
    </section>
  )
}

export default StaffDetails
