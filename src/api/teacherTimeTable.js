import api from "./api";

export const getAllTeacherTimeTable = async () => {
	const { data } = await api.get("/teacher-timetable");
	return data;
};

export const getTeacherTimeTableById = async (id) => {
	const { data } = await api.get(`/teacher-timetable/${id}`);
	return data.data;
};

export const createTeacherTimeTable = async (payload) => {
	const { data } = await api.post("/teacher-timetable", payload);
	return data;
};
export const updateTeacherTimeTable = async (payload) => {
	const { data } = await api.put(`/teacher-timetable/${payload.TimeTableID}`, payload);
	return data;
};

export const deleteTeacherTimeTable = async (id) => {
	const { data } = await api.delete(`/teacher-timetable/${id}`);
	return data;
};
