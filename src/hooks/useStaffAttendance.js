import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	getStaffAttendanceMatrixAll,
	getStaffAttendanceMatrixById,
	getStaffAttendanceToday,
	writeStaffAttendanceToday,
	writeStaffAttendanceForDate,
} from "@/api/staffAttendance";

export const useStaffAttendanceMatrixAll = () => {
	return useQuery({
		queryKey: ["staff-attendance", "matrix", "all"],
		queryFn: getStaffAttendanceMatrixAll,
	});
};

export const useStaffAttendanceMatrixById = (staffId) => {
	return useQuery({
		queryKey: ["staff-attendance", "matrix", staffId],
		queryFn: () => getStaffAttendanceMatrixById(staffId),
		enabled: !!staffId,
	});
};

export const useStaffAttendanceToday = () => {
	return useQuery({
		queryKey: ["staff-attendance", "today"],
		queryFn: getStaffAttendanceToday,
	});
};

export const useWriteStaffAttendanceToday = () => {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: writeStaffAttendanceToday,
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["staff-attendance"] });
		},
	});
};

export const useWriteStaffAttendanceForDate = () => {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: ({ date, payload }) =>
			writeStaffAttendanceForDate(date, payload),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["staff-attendance"] });
		},
	});
};
