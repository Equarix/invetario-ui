import { useAuth } from "@/context/AuthContext";
import { useAlert } from "@/hooks/useAlert";
import type { ApiResponse, ResponseBox } from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export function useCreateSale() {
  const { token } = useAuth();
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const { data, isError, isLoading } = useQuery<ApiResponse<ResponseBox>>({
    queryKey: ["boxes"],
    queryFn: async () => {
      const res = await instance.get("/box/open", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    },
    retry: false,
  });

  useEffect(() => {
    if (isError) {
      showAlert("No hay cajas abiertas", "error");
      navigate("/venta");
    }
  }, [isError, data]);
}
