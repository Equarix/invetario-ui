import { useAuth } from "@/context/AuthContext";
import type {
  ApiResponse,
  ResponseUsers,
  UserResponse,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import { addToast } from "@heroui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface UseAssingCreateProps {
  storeId?: number;
  isOpen: boolean;
}

export interface AssingCreateData {
  storeUserId: number;
  user: ResponseUsers;
  createdAt: string;
  status: boolean;
}

export function useAssingCreate({ storeId, isOpen }: UseAssingCreateProps) {
  const { token } = useAuth();

  const [dataAssing, setDataAssing] = useState<AssingCreateData[]>([]);

  const { data: resUsers, isLoading: isLoadingUsers } = useQuery<
    ApiResponse<UserResponse[]>
  >({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await instance.get("/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    },
    enabled: isOpen,
  });

  const { isLoading: isLoadingStoreUsers } = useQuery<
    ApiResponse<AssingCreateData[]>
  >({
    queryKey: ["store-users", storeId],
    queryFn: async () => {
      const res = await instance.get(`/storeuser/users-by-store/${storeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDataAssing(res.data.data);

      return res.data;
    },
    enabled: isOpen && !!storeId,
  });

  const { mutate: addStoreUser } = useMutation({
    mutationFn: async (userId: number) => {
      const res = await instance.post(
        `/storeuser`,
        {
          userId,
          storeId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data;
    },
    onSuccess: (data: ApiResponse<AssingCreateData>) => {
      addToast({
        title: "Usuario asignado",
        color: "success",
      });

      setDataAssing((prev) => [...prev, data.data]);
    },
    onError: () => {
      addToast({
        title: "Error al asignar usuario",
        color: "danger",
      });
    },
  });

  const { mutate: removeStoreUser } = useMutation({
    mutationFn: async (storeUserId: number) => {
      const res = await instance.delete(`/storeuser/${storeUserId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: (data: ApiResponse<AssingCreateData>) => {
      setDataAssing((prev) =>
        prev.filter((item) => item.storeUserId !== data.data.storeUserId),
      );

      addToast({
        title: "Usuario removido",
        color: "success",
      });
    },
    onError: () => {
      addToast({
        title: "Error al remover usuario",
        color: "danger",
      });
    },
  });

  return {
    users: {
      data: resUsers?.data || [],
      isLoading: isLoadingUsers,
    },
    storeUsers: {
      data: dataAssing,
      isLoading: isLoadingStoreUsers,
    },
    functions: {
      addStoreUser,
      removeStoreUser,
    },
  };
}
