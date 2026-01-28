import api from "./api";

export const getEvents = async () => {
	const { data } = await api.get("/event");
	return data;
};

export const getEventById = async (id) => {
	const { data } = await api.get(`/event/${id}`);
	return data.data;
};

export const createEvents = async (payload) => {
	const { data } = await api.post("/event", payload);
	return data;
};

export const deleteEvent = async (id) => {
	const { data } = await api.delete(`/event/${id}`);
	return data;
};
