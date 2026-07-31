import { useAuth } from "@/context/AuthContext";
import type {
  ApiResponse,
  PaginateResponse,
  ResponseBoxItem,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function useBoxes() {
  const { token } = useAuth();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const boxesQuery = useQuery<ApiResponse<PaginateResponse<ResponseBoxItem>>>({
    queryKey: ["boxes-list", page, limit],
    queryFn: async () => {
      const res = await instance.get<
        ApiResponse<PaginateResponse<ResponseBoxItem>>
      >("/box", {
        params: { page, limit },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });

  return {
    boxesData: boxesQuery.data?.data,
    boxes: boxesQuery.data?.data?.items || [],
    totalItems: boxesQuery.data?.data?.totalItems || 0,
    totalPages: boxesQuery.data?.data?.totalPages || 1,
    page,
    setPage,
    limit,
    setLimit,
    isLoading: boxesQuery.isLoading || boxesQuery.isFetching,
    refetch: boxesQuery.refetch,
  };
}
