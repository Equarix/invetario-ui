import { useAuth } from "@/context/AuthContext";
import type { ApiResponse } from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

interface TrendData {
  name: string;
  sales: number;
  revenue: number;
}

interface TopProduct {
  name: string;
  value: number;
}

interface CriticalProduct {
  name: string;
  stock: number;
  min: number;
  status: string;
  store: string;
}

export interface Kpi {
  total_inventory_value: number;
  out_of_stock_products: number;
  entry_order_pending: number;
  sales_this_month: number;
}

export interface CategoryTop {
  position: number;
  name: string;
  value: number;
  color: string;
  totalPriceSell: number;
}

export function useHome() {
  const { token } = useAuth();

  const { data: kpi, isLoading: isKpiLoading } = useQuery<ApiResponse<Kpi>>({
    queryKey: ["home-kpi"],
    queryFn: async () => {
      const res = await instance.get("/home/kpi", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    },
  });

  const { data: trendData, isLoading: isTrendDataLoading } = useQuery<
    ApiResponse<TrendData[]>
  >({
    queryKey: ["home-trend-data"],
    queryFn: async () => {
      const res = await instance.get("/home/trend", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });

  const { data: topProducts, isLoading: isTopProductsLoading } = useQuery<
    ApiResponse<TopProduct[]>
  >({
    queryKey: ["home-top-products"],
    queryFn: async () => {
      const res = await instance.get("/home/products-top", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    },
  });

  const { data: criticalProducts, isLoading: isCriticalProductsLoading } =
    useQuery<ApiResponse<CriticalProduct[]>>({
      queryKey: ["home-critical-products"],
      queryFn: async () => {
        const res = await instance.get("/home/critical-products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return res.data;
      },
    });

  const { data: categoryTop, isLoading: isCategoryTopLoading } = useQuery<
    ApiResponse<CategoryTop[]>
  >({
    queryKey: ["home-category-top"],
    queryFn: async () => {
      const res = await instance.get("/home/categories-top", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });

  return {
    kpi: {
      total_inventory_value: kpi?.data.total_inventory_value || 0,
      out_of_stock_products: kpi?.data.out_of_stock_products || 0,
      entry_order_pending: kpi?.data.entry_order_pending || 0,
      sales_this_month: kpi?.data.sales_this_month || 0,
      isLoading: isKpiLoading,
    },
    trend: {
      data: trendData?.data || [],
      isLoading: isTrendDataLoading,
    },
    topProducts: {
      data: topProducts?.data || [],
      isLoading: isTopProductsLoading,
    },
    criticalProducts: {
      data: criticalProducts?.data || [],
      isLoading: isCriticalProductsLoading,
    },
    categoryTop: {
      data: categoryTop?.data || [],
      isLoading: isCategoryTopLoading,
    },
  };
}
