import TeacherDetailsAndInfoCard from '@/components/teacher-details/TeacherDetailsAndInfo'
import TeacherDetailsTabsLayout from '@/components/teacher-details/TeacherDetailsTabs'
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
import { useDeleteTeacher } from '@/hooks/useTeacher'
import { toast } from 'sonner'

function TeacherDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { mutate: deleteTeacher } = useDeleteTeacher()

  const handleDelete = (id) => {
    deleteTeacher(id, {
      onSuccess: () => {
        navigate('/teacher-list')
        toast.success('Teacher deleted successfully')
      },
      onError: () => {
        toast.error('Failed to delete teacher')
      },
    })
  }

  const handleEdit = (id) => {
    navigate(`/edit-teacher/${id}`)
  }

  return (
    <section className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Teacher Details</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Dashboard
            <span className="mx-1">{'>'}</span>
            <span className="font-medium text-foreground">Teacher Details</span>
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
          <TeacherDetailsAndInfoCard />
        </div>

        <div className="col-span-12 lg:col-span-9 flex flex-col gap-6">
          <TeacherDetailsTabsLayout />
          <Outlet />
        </div>
      </div>
    </section>
  )
}

export default TeacherDetails
