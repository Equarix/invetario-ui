import { useAuth } from "@/context/AuthContext";
import type {
  ApiResponse,
  PaginateResponse,
  ResponseConfig,
  ResponseSale,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function useSales() {
  const { token } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);

  const salesQuery = useQuery<ApiResponse<PaginateResponse<ResponseSale[]>>>({
    queryKey: ["sales", currentPage],
    queryFn: async () => {
      const res = await instance.get("/sale", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: currentPage,
          limit: 10,
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
    sales: salesQuery.data?.data.items || [],
    isLoading: salesQuery.isLoading,
    isError: salesQuery.isError,
    config: configQuery.data?.data,
    refetchSales: salesQuery.refetch,
    pagination: {
      pages: salesQuery.data ? salesQuery.data.data.totalPages : 1,
      currentPage,
      setCurrentPage,
      totalItems: salesQuery.data ? salesQuery.data.data.totalItems : 0,
      totalPages: salesQuery.data ? salesQuery.data.data.totalPages : 1,
    },
  };
}
