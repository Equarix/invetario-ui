import { useAuth } from "@/context/AuthContext";
import type {
  ApiResponse,
  PaginateResponse,
  ResponseConfig,
  ResponseSale,
  ResponseStore,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export interface KpiData {
  totalSales: number;
  totalRevenue: number;
  averageTicket: number;
  cantSaleToday: number;
}

export function useSales() {
  const { token } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const { storeId } = useAuth();

  const [selectedStore, setSelectedStore] = useState(storeId);

  const salesQuery = useQuery<ApiResponse<PaginateResponse<ResponseSale>>>({
    queryKey: ["sales", currentPage, selectedStore],
    queryFn: async () => {
      const res = await instance.get("/sale", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: currentPage,
          limit: 10,
          storeId: selectedStore,
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

  const { data: stores, isLoading: isLoadingStores } = useQuery<
    ApiResponse<ResponseStore[]>
  >({
    queryKey: ["stores"],
    queryFn: async () => {
      const res = await instance.get("/store", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    },
  });

  const { data: kpiData, isLoading: isLoadingKpi } = useQuery<
    ApiResponse<KpiData>
  >({
    queryKey: ["saleStats", selectedStore],
    queryFn: async () => {
      const res = await instance.get(`/sale/kpi/${selectedStore}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    },
  });

  console.log("KPI Data:", kpiData);

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
    store: {
      stores: stores?.data || [],
      isLoading: isLoadingStores,
      selectedStore,
      setSelectedStore,
    },
    kpi: {
      data: kpiData?.data,
      isLoading: isLoadingKpi,
    },
  };
}
