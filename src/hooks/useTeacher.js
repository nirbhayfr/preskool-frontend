import {
	getTeachers,
	getTeacherById,
	upsertTeacher,
	deleteTeacher,
} from "@/api/teacher";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useTeachers = () =>
	useQuery({
		queryKey: ["teachers"],
		queryFn: getTeachers,
	});

export const useTeacher = (id) =>
	useQuery({
		queryKey: ["teacher", id],
		queryFn: () => getTeacherById(id),
		enabled: !!id,
	});

export const useUpsertTeacher = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: upsertTeacher,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["teachers"] });
		},
	});
};

export const useDeleteTeacher = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteTeacher,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["teachers"] });
		},
	});
};
