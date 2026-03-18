import { useAuth } from "@/context/AuthContext";
import type {
  ApiResponse,
  ResponsePayMethod,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

export function usePayMethod() {
  const { token } = useAuth();

  const {
    data: resPayMethod,
    isLoading: isLoadingPayMethod,
    refetch,
  } = useQuery<ApiResponse<ResponsePayMethod[]>>({
    queryKey: ["paymethods"],
    queryFn: async () => {
      const res = await instance.get("/paymethod", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });

  return {
    payMethods: resPayMethod?.data || [],
    isLoadingPayMethod,
    refetchPayMethods: refetch,
  };
}
