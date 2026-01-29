import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Toaster } from "sonner";

import ProtectedRoute from "./pages/ProtectedRoute";

import LoginPage from "./components/auth/Login";
import AppLayout from "./components/layout/AppLayout";
import HomePage from "./pages/HomePage";

import StudentList from "./pages/StudentList";
import TeacherList from "./pages/TeacherList";
import StaffList from "./pages/StaffList";

import StudentAttendance from "./pages/StudentAttendance";
import TeacherAttendance from "./pages/TeachersAttendance";
import StaffAttendance from "./pages/StaffAttendance";

import StudentDetails from "./pages/StudentDetails";
import StudentDetailsTabContent from "./components/student-details/StudentDetailsTabContent";
import StudentLeaveandAttendance from "./components/student-details/StudentLeaveandAttendance";
import StudentFees from "./components/student-details/StudentFees";
import StudentExamResults from "./components/student-details/StudentExamResults";
import StudentLibraryDetails from "./components/student-details/StudentLibraryDetails";

import AddTeacherPage from "./pages/AddTeacherPage";
import AddStaffPage from "./pages/AddStaffPage";
import AddStudentPage from "./pages/AddStudentPage";
import TakeTeacherAttendance from "./pages/TakeTeacherAttendance";
import TakeStaffAttendance from "./pages/TakeStaffAttendance";
import TakeStudentAttendance from "./pages/TakeStudentAttendance";

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

							<Route
								path="/add-student"
								element={<AddStudentPage />}
							/>
							<Route
								path="/edit-student/:id"
								element={<AddStudentPage />}
							/>

							<Route
								path="/add-teacher"
								element={<AddTeacherPage />}
							/>
							<Route
								path="/edit-teacher/:id"
								element={<AddTeacherPage />}
							/>

							<Route
								path="/add-staff"
								element={<AddStaffPage />}
							/>
							<Route
								path="/edit-staff/:id"
								element={<AddStaffPage />}
							/>

							<Route
								path="/student-list"
								element={<StudentList />}
							/>
							<Route
								path="/teacher-list"
								element={<TeacherList />}
							/>
							<Route
								path="/staff-list"
								element={<StaffList />}
							/>

							<Route
								path="/student-attendance"
								element={<StudentAttendance />}
							/>
							<Route
								path="/teacher-attendance"
								element={<TeacherAttendance />}
							/>
							<Route
								path="/staff-attendance"
								element={<StaffAttendance />}
							/>

							<Route
								path="student-details"
								element={<StudentDetails />}
							>
								<Route
									path="details"
									element={
										<StudentDetailsTabContent />
									}
								/>

								<Route
									path="attendance"
									element={
										<StudentLeaveandAttendance />
									}
								/>
								<Route
									path="fees"
									element={<StudentFees />}
								/>
								<Route
									path="exams"
									element={<StudentExamResults />}
								/>
								<Route
									path="library"
									element={<StudentLibraryDetails />}
								/>
							</Route>

							<Route
								path="/take-teacher-attendance"
								element={<TakeTeacherAttendance />}
							/>
							<Route
								path="/take-staff-attendance"
								element={<TakeStaffAttendance />}
							/>
							<Route
								path="/take-student-attendance"
								element={<TakeStudentAttendance />}
							/>
						</Route>
					</Route>
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default App;
