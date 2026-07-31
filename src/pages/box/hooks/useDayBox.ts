import { useAuth } from "@/context/AuthContext";
import type { CreateDayBoxDto, DayBox } from "@/interface/daybox.interface";
import type { ApiResponse } from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import { addToast } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useDayBox(date: string, boxId: number) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const dayBoxQuery = useQuery<DayBox | null>({
    queryKey: ["daybox", date, boxId],
    queryFn: async () => {
      if (!date || !boxId || boxId === -1) return null;
      try {
        const res = await instance.get<ApiResponse<DayBox | null>>(
          `/daybox/by-date`,
          {
            params: { date, boxId },
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        return res.data?.data || null;
      } catch (err: any) {
        if (err?.response?.status === 404) {
          return null;
        }
        throw err;
      }
    },
    enabled: Boolean(date && boxId && boxId !== -1),
  });

  const createDayBoxMutation = useMutation({
    mutationFn: async (data: CreateDayBoxDto) => {
      const res = await instance.post<ApiResponse<DayBox>>("/daybox", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    onSuccess: (res) => {
      addToast({
        title: "Resumen de caja creado",
        description:
          res.message || "La caja se ha cerrado y registrado correctamente.",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["daybox", date, boxId] });
    },
    onError: (err: any) => {
      const errorMessage =
        err?.response?.data?.message ||
        "Error al intentar crear el resumen de caja.";
      addToast({
        title: "Error",
        description: errorMessage,
        color: "danger",
      });
    },
  });

  return {
    dayBox: dayBoxQuery.data,
    isLoading: dayBoxQuery.isLoading || dayBoxQuery.isFetching,
    refetch: dayBoxQuery.refetch,
    createDayBox: createDayBoxMutation.mutateAsync,
    isCreating: createDayBoxMutation.isPending,
  };
}
