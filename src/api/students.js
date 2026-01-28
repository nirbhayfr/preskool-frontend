import api from "./api";

export const fetchStudents = async () => {
	const { data } = await api.get("/student/students");
	return data;
};

export const fetchStudentById = async (id) => {
	const { data } = await api.get(`/student/students/${id}`);
	return data.data;
};

export const createStudent = async (payload) => {
	const { data } = await api.post("/student/students/upsert", payload);
	return data;
};

export const updateStudent = async ({ id, payload }) => {
	const { data } = await api.put(`/student/students/${id}`, payload);
	return data;
};

export const deleteStudent = async (id) => {
	const { data } = await api.delete(`/student/students/${id}`);
	return data;
};
