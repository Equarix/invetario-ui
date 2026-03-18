import { useAuth } from "@/context/AuthContext";
import type {
  ApiResponse,
  Product,
  ResponseStore,
  UserResponse,
} from "@/interface/response.interface";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { lastDayOfMonth, startOfMonth } from "date-fns";
import { instance } from "@/libs/axios";

export interface ResponseReportProduct {
  productId: number;
  storeId: number;
  totalQuantity: number;
  product: Product;
  store: ResponseStore;
  count: number;
  users: Array<{
    userId: number;
    quantity: number;
    user: UserResponse;
  }>;
}

export function useReportProduct() {
  const { token, storeId } = useAuth();
  const [dates, setDates] = useState({
    startDate: startOfMonth(new Date()),
    endDate: lastDayOfMonth(new Date()),
  });

  const { data, isLoading, refetch } = useQuery<
    ApiResponse<ResponseReportProduct[]>
  >({
    queryKey: ["report-product", storeId],
    queryFn: async () => {
      const res = await instance.get("/product/report-products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          storeId,
          startDate: dates.startDate.toISOString()?.split("T")[0],
          endDate: dates.endDate.toISOString()?.split("T")[0],
        },
      });
      return res.data;
    },
  });

  return {
    report: {
      data: data?.data || [],
      isLoading,
    },
    dates,
    setDates,
    refetch,
  };
}
