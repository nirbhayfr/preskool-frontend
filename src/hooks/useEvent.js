import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEvents, getEventById, createEvents, deleteEvent } from "@/api/event";

export const useEvents = () =>
    useQuery({
        queryKey: ["event"],
        queryFn: getEvents,
    });

export const useEventById = (id) =>
    useQuery({
        queryKey: ["event", id],
        queryFn: () => getEventById(id),
        enabled: !!id,
    });

export const useCreateEvents = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: createEvents,
        onSuccess: () => {
            qc.invalidateQueries(["event"]);
        },
    });
};

export const useDeleteEvent = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: deleteEvent,
        onSuccess: () => {
            qc.invalidateQueries(["event"]);
        },
    });
};
