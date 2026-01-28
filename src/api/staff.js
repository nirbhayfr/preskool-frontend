import api from "./api";

export const getStaffs = async () => {
	const { data } = await api.get("/staff/staffs");
	return data;
};

export const getStaffById = async (id) => {
	const { data } = await api.get(`/staff/staffs/${id}`);
	return data.data;
};

export const upsertStaff = async (payload) => {
	const { data } = await api.post("/staff/staffs/upsert", payload);
	return data;
};

export const deleteStaff = async (id) => {
	const { data } = await api.delete(`/staff/staffs/${id}`);
	return data;
};
