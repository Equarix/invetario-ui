import { useAuth } from "@/context/AuthContext";
import type {
  ApiResponse,
  ResponseConfig,
  ResponseSale,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

export function useSales() {
  const { token } = useAuth();

  const salesQuery = useQuery<ApiResponse<ResponseSale[]>>({
    queryKey: ["sales"],
    queryFn: async () => {
      const res = await instance.get("/sale", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });

  const configQuery = useQuery<ApiResponse<ResponseConfig>>({
    queryKey: ["config"],
    queryFn: async () => {
      const res = await instance.get("/config/last", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });

  return {
    sales: salesQuery.data?.data || [],
    isLoading: salesQuery.isLoading,
    isError: salesQuery.isError,
    config: configQuery.data?.data,
    refetchSales: salesQuery.refetch,
  };
}
