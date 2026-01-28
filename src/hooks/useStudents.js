import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	fetchStudents,
	fetchStudentById,
	createStudent,
	updateStudent,
	deleteStudent,
} from "@/api/students";

export const useStudents = () =>
	useQuery({
		queryKey: ["students"],
		queryFn: fetchStudents,
	});

export const useStudent = (id) =>
	useQuery({
		queryKey: ["students", id],
		queryFn: () => fetchStudentById(id),
		enabled: !!id,
	});

export const useCreateStudent = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createStudent,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["students"] });
		},
	});
};

export const useUpdateStudent = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateStudent,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["students"] });
		},
	});
};

export const useDeleteStudent = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteStudent,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["students"] });
		},
	});
};
