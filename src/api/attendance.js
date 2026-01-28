import api from "./api";

// BASIC STUDENT ATTENDANCE
export const getStudentAttendance = async () => {
	const res = await api.get("/getstudentattendance");
	return res.data;
};

// ATTENDANCE MATRIX
export const getAttendanceMatrixAll = async () => {
	const res = await api.get("/v1/student-attendance/all");
	return res.data;
};

export const getAttendanceMatrixByClass = async (classId) => {
	const res = await api.get(`/v1/student-attendance/by-class/${classId}`);
	return res.data;
};

export const getAttendanceMatrixByStudentId = async (studentId) => {
	const res = await api.get(`/v1/student-attendance/by-id/${studentId}`);
	return res.data;
};

// WRITE ATTENDANCE
export const writeTodayAttendance = async (data) => {
	const res = await api.post("/writestudentattendance/today", data);
	return res.data;
};

export const writeAttendanceByDate = async ({ date, data }) => {
	const res = await api.post(`/writestudentattendance/${date}`, data);
	return res.data;
};

// ATTENDANCE COUNTS
export const getTodayAttendanceCount = async () => {
	const res = await api.get("/v1/attendance-count/today");
	return res.data;
};

export const getAttendanceCountByDate = async (date) => {
	const res = await api.get("/v1/attendance-count/by-date", {
		params: { date },
	});
	return res.data;
};
