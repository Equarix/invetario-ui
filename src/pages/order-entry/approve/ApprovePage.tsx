import Container from "@/components/components/container/Container";
import Header from "@/components/layouts/header/Header";
import type {
  ApiResponse,
  EntryOrderResponse,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LuBox } from "react-icons/lu";
import { useState } from "react";
import { addToast, Spinner } from "@heroui/react";
import { useAuth } from "@/context/AuthContext";
import EntryOrderCard from "./EntryOrderCard";
import DetailsModal from "../details/DetailsModal";

export default function ApprovePage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<EntryOrderResponse | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: resEntryOrders, isLoading } = useQuery<
    ApiResponse<EntryOrderResponse[]>
  >({
    queryKey: ["entry-orders-pending"],
    queryFn: async () => {
      const res = await instance.get("/entryorder/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (id: number) => {
      await instance.post(
        `/entryorder/${id}/complete`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entry-orders-pending"] });
      addToast({
        title: "Orden aprobada",
        description: "La orden ha sido completada exitosamente.",
        color: "success",
      });
    },
    onError: () => {
      addToast({
        title: "Error",
        description: "No se pudo aprobar la orden.",
        color: "danger",
      });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (id: number) => {
      await instance.delete(`/entryorder/${id}/cancel`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entry-orders-pending"] });
      addToast({
        title: "Orden cancelada",
        description: "La orden ha sido cancelada exitosamente.",
        color: "success",
      });
    },
    onError: () => {
      addToast({
        title: "Error",
        description: "No se pudo cancelar la orden.",
        color: "danger",
      });
    },
  });

  const handleViewDetails = (order: EntryOrderResponse) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleApprove = (id: number) => {
    approveMutation.mutate(id);
  };

  const handleCancel = (id: number) => {
    cancelMutation.mutate(id);
  };

  const orders = resEntryOrders?.data || [];

  return (
    <Container>
      <Header
        icon={<LuBox />}
        text={{
          header: "Aprobar Ordenes de Entrada",
        }}
        disabledButton
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" label="Cargando órdenes..." />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-64 text-default-500">
          <LuBox size={48} className="mb-2 opacity-20" />
          <p>No hay órdenes pendientes de aprobación.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 pb-10">
          {orders.map((order) => (
            <EntryOrderCard
              key={order.entryOrderId}
              order={order}
              onViewDetails={handleViewDetails}
              onApprove={handleApprove}
              onCancel={handleCancel}
              isProcessing={
                approveMutation.isPending || cancelMutation.isPending
              }
            />
          ))}
        </div>
      )}

      <DetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
      />
    </Container>
  );
}
