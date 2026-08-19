import { useAuth } from "@/context/AuthContext";
import { type ApiResponse, type PaginateResponse, type ResponseProforma, type ResponseStore, type ResponseConfig } from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const useProforma = () => {
  const { token } = useAuth();
  
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [storeId, setStoreId] = useState<number>(0);

  const { data: storesResponse, isLoading: isLoadingStores } = useQuery<ApiResponse<ResponseStore[]>>({
    queryKey: ["stores"],
    queryFn: async () => {
      const res = await instance.get("/store", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    enabled: !!token,
  });

  const { data: configResponse, isLoading: isLoadingConfig } = useQuery<ApiResponse<ResponseConfig>>({
    queryKey: ["config"],
    queryFn: async () => {
      const res = await instance.get("/config/last", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    enabled: !!token,
  });

  // Fetch proformas with pagination and store filtering
  const { data: proformasResponse, isLoading: isLoadingProformas, refetch } = useQuery<ApiResponse<PaginateResponse<ResponseProforma>>>({
    queryKey: ["proformas", page, limit, storeId],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (storeId > 0) {
        params.append("storeId", storeId.toString());
      } else if (storesResponse?.data && storesResponse.data.length > 0) {
           params.append("storeId", storesResponse.data[0].storeId.toString());
      } else {
           params.append("storeId", "1");
      }

      const res = await instance.get(`/proforma?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    enabled: !!token && (storeId > 0 || (!!storesResponse?.data && storesResponse?.data.length > 0)),
  });

  return {
    proformas: proformasResponse?.data?.items || [],
    pagination: {
      currentPage: proformasResponse?.data?.page || 1,
      totalPages: proformasResponse?.data?.totalPages || 1,
      totalItems: proformasResponse?.data?.totalItems || 0,
    },
    stores: storesResponse?.data || [],
    config: configResponse?.data,
    isLoading: isLoadingProformas || isLoadingStores || isLoadingConfig,
    filters: {
      page,
      setPage,
      limit,
      setLimit,
      storeId,
      setStoreId,
    },
    refetch,
  };
};
