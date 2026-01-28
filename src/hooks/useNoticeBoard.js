import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createNotices, deleteNotice, getNoticeById, getNotices } from "@/api/noticeBoard";

export const useNotices = () =>
    useQuery({
        queryKey: ["notice"],
        queryFn: getNotices,
    });

export const useNoticeById = (id) =>
    useQuery({
        queryKey: ["notice", id],
        queryFn: () => getNoticeById(id),
        enabled: !!id,
    });

export const useCreateNotices = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: createNotices,
        onSuccess: () => {
            qc.invalidateQueries(["notice"]);
        },
    });
};

export const useDeleteNotice = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: deleteNotice,
        onSuccess: () => {
            qc.invalidateQueries(["notice"]);
        },
    });
};
