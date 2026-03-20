import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { Toaster } from 'sonner'

import ProtectedRoute from './pages/ProtectedRoute'

import LoginPage from './components/auth/Login'
import AppLayout from './components/layout/AppLayout'
import HomePage from './pages/HomePage'

import StudentList from './pages/StudentList'
import TeacherList from './pages/TeacherList'
import StaffList from './pages/StaffList'

import StudentAttendance from './pages/StudentAttendance'
import TeacherAttendance from './pages/TeachersAttendance'
import StaffAttendance from './pages/StaffAttendance'

import StudentDetails from './pages/StudentDetails'
import StudentDetailsTabContent from './components/student-details/StudentDetailsTabContent'
import StudentLeaveandAttendance from './components/student-details/StudentLeaveandAttendance'
import StudentExamResults from './components/student-details/StudentExamResults'
import StudentLibraryDetails from './components/student-details/StudentLibraryDetails'

import AddTeacherPage from './pages/AddTeacherPage'
import AddStaffPage from './pages/AddStaffPage'
import AddStudentPage from './pages/AddStudentPage'

import TakeTeacherAttendance from './pages/TakeTeacherAttendance'
import TakeStaffAttendance from './pages/TakeStaffAttendance'
import TakeStudentAttendance from './pages/TakeStudentAttendance'

import TeacherDetails from './pages/TeacherDetails'
import TeacherDetailsTabContent from './components/teacher-details/TeacherDetailsTabContent'
import TeacherLeaveAndAttendance from './components/teacher-details/TeacherLeaveandAttendance'
import TeacherSalary from './components/teacher-details/TeacherSalary'
import TeacherLibraryTabContent from './components/teacher-details/TeacherLibraryDetails'

import StaffDetails from './pages/StaffDetails'
import StaffDetailsTabContent from './components/staff-details/StaffDetailsTabContent'
import StaffSalary from './components/staff-details/StaffSalary'
import StaffLeaveAndAttendance from './components/staff-details/StaffLeaveAndAttendance'

import FeeStructureAndInventory from './pages/FeeStructureAndInventory'
import AddFeeStructurePage from './components/fee-structure-and-inventory/AddFeeStructurePage'
import PendingFeesPage from './pages/PendingFeesPage'

import TeacherSalaryPage from './pages/TeacherSalaryPage'
import StaffSalaryPage from './pages/StaffSalaryPage'

import ExamResultPage from './pages/ExamResultPage'
import ClassTimeTable from './pages/ClassTimeTable'

import BookList from './pages/BookList'
import InventoryPage from './pages/InventoryPage'
import BookIssues from './pages/BookIssues'
import RevenuePage from './pages/RevenuePage'
import BudgetPage from './pages/BudgetPage'
import PayFeesPage from './pages/PayFeesPage'

import JitsiMeetingRoom from './pages/JitsiMeetingRoom'
import StudentMeetingPage from './components/student-dashboard/JoinMeeting'

import PaySalaryPage from './pages/PaySalaryPage'
import PayStaffSalaryPage from './pages/PayStaffSalaryPage'
import TeacherSalaryList from './pages/TeacherSalaryList'
import StaffSalaryList from './pages/StaffSalaryList'

import ExportStudentData from './pages/ExportStudentData'

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Toaster />

        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<HomePage />} />

              <Route path="/add-student" element={<AddStudentPage />} />
              <Route path="/edit-student/:id" element={<AddStudentPage />} />

              <Route path="/add-teacher" element={<AddTeacherPage />} />
              <Route path="/edit-teacher/:id" element={<AddTeacherPage />} />

              <Route path="/add-staff" element={<AddStaffPage />} />
              <Route path="/edit-staff/:id" element={<AddStaffPage />} />

              <Route path="/student-list" element={<StudentList />} />
              <Route path="/teacher-list" element={<TeacherList />} />
              <Route path="/staff-list" element={<StaffList />} />

              <Route path="/student-attendance" element={<StudentAttendance />} />
              <Route path="/teacher-attendance" element={<TeacherAttendance />} />
              <Route path="/staff-attendance" element={<StaffAttendance />} />

              <Route path="/class-timetable" element={<ClassTimeTable />} />

              <Route
                path="/take-teacher-attendance"
                element={<TakeTeacherAttendance />}
              />
              <Route path="/take-staff-attendance" element={<TakeStaffAttendance />} />
              <Route
                path="/take-student-attendance"
                element={<TakeStudentAttendance />}
              />

              <Route path="/pay-fees/:id" element={<PayFeesPage />} />
              <Route path="/pay-salary/:id" element={<PaySalaryPage />} />
              <Route path="/pay-staff-salary/:id" element={<PayStaffSalaryPage />} />

              <Route path="/student-details/:id" element={<StudentDetails />}>
                <Route index element={<Navigate to="details" replace />} />
                <Route path="details" element={<StudentDetailsTabContent />} />
                <Route path="attendance" element={<StudentLeaveandAttendance />} />
                <Route path="exams" element={<StudentExamResults />} />
                <Route path="library" element={<StudentLibraryDetails />} />
              </Route>

              <Route path="/teacher-details/:id" element={<TeacherDetails />}>
                <Route index element={<Navigate to="details" replace />} />
                <Route path="details" element={<TeacherDetailsTabContent />} />
                <Route path="attendance" element={<TeacherLeaveAndAttendance />} />
                <Route path="salary" element={<TeacherSalary />} />
                <Route path="library" element={<TeacherLibraryTabContent />} />
              </Route>

              <Route path="/staff-details/:id" element={<StaffDetails />}>
                <Route index element={<Navigate to="details" replace />} />
                <Route path="details" element={<StaffDetailsTabContent />} />
                <Route path="payroll" element={<StaffSalary />} />
                <Route path="attendance" element={<StaffLeaveAndAttendance />} />
              </Route>

              <Route path="/fee-structure" element={<FeeStructureAndInventory />} />
              <Route path="/fee-structure/add" element={<AddFeeStructurePage />} />
              <Route
                path="/fee-structure/edit/:classId"
                element={<AddFeeStructurePage />}
              />
              <Route path="/pending-fees" element={<PendingFeesPage />} />
              <Route path="/revenue" element={<RevenuePage />} />
              <Route path="/budget" element={<BudgetPage />} />

              <Route path="/exam-result" element={<ExamResultPage />} />
              <Route path="inventory" element={<InventoryPage />} />

              <Route path="/teacher-salary" element={<TeacherSalaryPage />} />
              <Route path="/staff-salary" element={<StaffSalaryPage />} />
              <Route path="/teacher-salary-list" element={<TeacherSalaryList />} />
              <Route path="/staff-salary-list" element={<StaffSalaryList />} />

              <Route path="/book-list" element={<BookList />} />
              <Route path="/book-issues" element={<BookIssues />} />

              <Route path="/meeting" element={<JitsiMeetingRoom />} />
              <Route path="/student/meeting" element={<StudentMeetingPage />} />

              <Route path="/export-student-data" element={<ExportStudentData />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
