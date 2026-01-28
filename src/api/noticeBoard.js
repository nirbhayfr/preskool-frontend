import api from "./api";

export const getNotices = async () => {
	const { data } = await api.get("/notice");
	return data;
};

export const getNoticeById = async (id) => {
	const { data } = await api.get(`/notice/${id}`);
	return data.data;
};

export const createNotices = async (payload) => {
	const { data } = await api.post("/notice", payload);
	return data;
};

export const deleteNotice = async (id) => {
	const { data } = await api.delete(`/notice/${id}`);
	return data;
};
