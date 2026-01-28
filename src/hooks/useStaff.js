import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStaffs, getStaffById, upsertStaff, deleteStaff } from "@/api/staff";

export const useStaffs = () =>
	useQuery({
		queryKey: ["staffs"],
		queryFn: getStaffs,
	});

export const useStaffById = (id) =>
	useQuery({
		queryKey: ["staff", id],
		queryFn: () => getStaffById(id),
		enabled: !!id,
	});

export const useUpsertStaff = () => {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: upsertStaff,
		onSuccess: () => {
			qc.invalidateQueries(["staffs"]);
		},
	});
};

export const useDeleteStaff = () => {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: deleteStaff,
		onSuccess: () => {
			qc.invalidateQueries(["staffs"]);
		},
	});
};
