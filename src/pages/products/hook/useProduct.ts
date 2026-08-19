import { useAuth } from "@/context/AuthContext";
import type {
  ApiResponse,
  PaginateResponse,
  Product,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export interface ProductKpi {
  totalProducts: number;
  totalActiveProducts: number;
  averagePrice: number;
}

export function useProduct() {
  const { token } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, refetch } = useQuery<
    ApiResponse<PaginateResponse<Product>>
  >({
    queryKey: ["products", currentPage],
    queryFn: async () => {
      const res = await instance.get("/product", {
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

  const pagination = {
    pages: data ? data.data.totalPages : 1,
    currentPage,
    setCurrentPage,
    totalItems: data ? data.data.totalItems : 0,
    totalPages: data ? data.data.totalPages : 1,
  };

  const { data: kpiData, isLoading: isKpiLoading } = useQuery<
    ApiResponse<ProductKpi>
  >({
    queryKey: ["products-kpi"],
    queryFn: async () => {
      const res = await instance.get("/product/kpi", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });

  return {
    data,
    isLoading,
    refetch,
    pagination,
    kpi: {
      data: kpiData ? kpiData.data : null,
      isLoading: isKpiLoading,
    },
  };
}
