import api from "./api";

export const getTeachers = async () => {
	const { data } = await api.get("/teacher/teachers");
	return data;
};

export const getTeacherById = async (id) => {
	const { data } = await api.get(`/teacher/teachers/${id}`);
	return data.data;
};

export const upsertTeacher = async (payload) => {
	const { data } = await api.post("/teacher/teachers/upsert", payload);
	return data;
};

export const deleteTeacher = async (id) => {
	const { data } = await api.delete(`/teacher/teachers/${id}`);
	return data;
};
