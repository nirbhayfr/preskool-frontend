import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
	getStudentAttendance,
	getAttendanceMatrixAll,
	getAttendanceMatrixByClass,
	getAttendanceMatrixByStudentId,
	writeTodayAttendance,
	writeAttendanceByDate,
	getTodayAttendanceCount,
	getAttendanceCountByDate,
} from "@/api/attendance";

export const useStudentAttendance = () =>
	useQuery({
		queryKey: ["student-attendance"],
		queryFn: getStudentAttendance,
	});

export const useAttendanceMatrixAll = () =>
	useQuery({
		queryKey: ["attendance-matrix", "all"],
		queryFn: getAttendanceMatrixAll,
	});

export const useAttendanceMatrixByClass = (classId) =>
	useQuery({
		queryKey: ["attendance-matrix", "class", classId],
		queryFn: () => getAttendanceMatrixByClass(classId),
		enabled: !!classId,
	});

export const useAttendanceMatrixByStudentId = (studentId) =>
	useQuery({
		queryKey: ["attendance-matrix", "student", studentId],
		queryFn: () => getAttendanceMatrixByStudentId(studentId),
		enabled: !!studentId,
	});

export const useWriteTodayAttendance = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: writeTodayAttendance,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["attendance-matrix"],
			});
			queryClient.invalidateQueries({
				queryKey: ["attendance-count"],
			});
		},
	});
};

export const useWriteAttendanceByDate = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: writeAttendanceByDate,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["attendance-matrix"],
			});
			queryClient.invalidateQueries({
				queryKey: ["attendance-count"],
			});
		},
	});
};

export const useTodayAttendanceCount = () =>
	useQuery({
		queryKey: ["attendance-count", "today"],
		queryFn: getTodayAttendanceCount,
	});

export const useAttendanceCountByDate = (date) =>
	useQuery({
		queryKey: ["attendance-count", date],
		queryFn: () => getAttendanceCountByDate(date),
		enabled: !!date,
	});
