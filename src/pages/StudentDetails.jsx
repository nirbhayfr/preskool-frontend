import StudentDetailsAndInfoCard from '@/components/student-details/StudentDetailsAndInfo'
import StudentDetailsTabsLayout from '@/components/student-details/StudentDetailsTabs'
import { Button } from '@/components/ui/button'
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
import { useDeleteStudent } from '@/hooks/useStudents'
import { toast } from 'sonner'
import { decryptData } from '@/utils/crypto'

function StudentDetails() {
  const { id } = useParams()
  const encryptedUser = localStorage.getItem("user");
  const user = encryptedUser ? decryptData(encryptedUser) : null;
  const navigate = useNavigate()
  const { mutate: deleteStudent } = useDeleteStudent()

  const handleDelete = (id) => {
    deleteStudent(id, {
      onSuccess: () => {
        navigate('/student-list')
        toast.success('Student deleted successfully')
      },
      onError: () => {
        toast.error('Failed to delete student')
      },
    })
  }
  const handleEdit = (id) => {
    navigate(`/edit-student/${id}`)
  }

  return (
    <section className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Student Details</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Dashboard
            <span className="mx-1">{'>'}</span>
            <span className="font-medium text-foreground">Student Details</span>
          </p>
        </div>

        <div className="flex gap-2">
          {/* Edit */}
          {user?.Role === "Teacher" && (
            <Button onClick={() => handleEdit(id)}>
              <PenBoxIcon className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          )}

          {/* Delete */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              {user?.Role === "Teacher" && (
                <Button variant="destructive">
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              )}
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete student?</AlertDialogTitle>
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
          <StudentDetailsAndInfoCard />
        </div>

        <div className="col-span-12 lg:col-span-9 flex flex-col gap-6">
          <StudentDetailsTabsLayout />
          <Outlet />
        </div>
      </div>
    </section>
  )
}

export default StudentDetails
