/* eslint-disable no-unused-vars */
import {
	getAllTeacherTimeTable,
	getTeacherTimeTableById,
	createTeacherTimeTable,
	updateTeacherTimeTable,
	deleteTeacherTimeTable,
} from "@/api/teacherTimeTable";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useTeachers = () =>
	useQuery({
		queryKey: ["teacherTimeTables"],
		queryFn: getAllTeacherTimeTable,
	});

export const useTeacher = (id) =>
	useQuery({
		queryKey: ["teacherTimeTable", id],
		queryFn: () => getTeacherTimeTableById(id),
		enabled: !!id,
	});

export const useCreateTeacherTimeTable = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createTeacherTimeTable,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["teacherTimeTables"] });
		},
	});
};

export const useUpdateTeacherTimeTable = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateTeacherTimeTable,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["teacherTimeTables"] });
		},
	});
};

export const useDeleteTeacherTimeTable = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteTeacherTimeTable,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["teacherTimeTables"] });
		},
	});
};
