import { useAuth } from "@/context/AuthContext";
import type {
  ApiResponse,
  ResponseConfig,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useConfig() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const lastConfigQuery = useQuery<ApiResponse<ResponseConfig>>({
    queryKey: ["config", "last"],
    queryFn: async () => {
      const res = await instance.get("/config/last", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });

  const allConfigsQuery = useQuery<ApiResponse<ResponseConfig[]>>({
    queryKey: ["config", "all"],
    queryFn: async () => {
      const res = await instance.get("/config", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });

  const createConfigMutation = useMutation({
    mutationFn: async (
      data: Omit<ResponseConfig, "configId" | "createdAt">,
    ) => {
      const res = await instance.post("/config", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["config"] });
    },
  });

  return {
    lastConfig: lastConfigQuery.data?.data,
    allConfigs: allConfigsQuery.data?.data || [],
    isLoading: lastConfigQuery.isLoading || allConfigsQuery.isLoading,
    createConfig: createConfigMutation.mutate,
    isSaving: createConfigMutation.isPending,
  };
}
