import api from "./api";

export const getStaffAttendanceMatrixAll = async () => {
	const { data } = await api.get("/v1/staff-attendance/all");
	return data;
};

export const getStaffAttendanceMatrixById = async (staffId) => {
	const { data } = await api.get(`/v1/staff-attendance/by-id/${staffId}`);
	return data;
};

export const getStaffAttendanceToday = async () => {
	const { data } = await api.get("/write-staff-attendence/today");
	return data;
};

export const writeStaffAttendanceToday = async (payload) => {
	const { data } = await api.post("/write-staff-attendence/today", payload);
	return data;
};

export const writeStaffAttendanceForDate = async (date, payload) => {
	const { data } = await api.post(
		`/write-staff-attendence/${date}`,
		payload,
	);
	return data;
};
