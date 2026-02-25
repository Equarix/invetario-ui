import Container from "@/components/components/container/Container";
import Table from "@/components/components/table/Table";
import Header from "@/components/layouts/header/Header";
import { useAuth } from "@/context/AuthContext";
import type {
  ApiResponse,
  EntryOrderResponse,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import { Chip, Tooltip, useDisclosure } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { LuBox, LuEye } from "react-icons/lu";
import { useNavigate } from "react-router";
import DetailsModal from "./details/DetailsModal";

export default function OrderEntry() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { onOpen, isOpen, onOpenChange } = useDisclosure();
  const [selectedOrder, setSelectedOrder] = useState<EntryOrderResponse | null>(
    null,
  );

  const { data, isLoading } = useQuery<ApiResponse<EntryOrderResponse[]>>({
    queryKey: ["order-entry"],
    queryFn: async () => {
      const res = await instance.get("/entryorder", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });

  return (
    <Container>
      <Header
        icon={<LuBox />}
        text={{
          header: "Orden de Entrada",
          button: "Agregar Orden de Entrada",
        }}
        onClick={() => navigate("/orden-entrada/crear")}
      />

      <Table
        data={data?.data || []}
        isLoading={isLoading}
        columns={[
          {
            header: "ID",
            accessorKey: "entryOrderId",
          },
          {
            header: "Proveedor",
            accessorKey: "provider.companyName",
          },
          {
            header: "Almacén",
            accessorKey: "store.name",
          },
          {
            header: "Fecha",
            accessorKey: "entryDate",
            cell: ({ getValue }) =>
              new Date(getValue() as string).toLocaleDateString(),
          },
          {
            header: "Condición Pago",
            accessorKey: "payCondition",
          },
          {
            header: "Estado",
            accessorKey: "entryOrderStatus",
            cell: ({ getValue }) => {
              const status = getValue() as string;
              const statusMap: Record<
                string,
                { label: string; color: "warning" | "success" | "danger" }
              > = {
                PENDING: { label: "Pendiente", color: "warning" },
                COMPLETED: { label: "Completado", color: "success" },
                CANCELLED: { label: "Cancelado", color: "danger" },
              };

              const currentStatus = statusMap[status] || {
                label: status,
                color: "default",
              };

              return (
                <Chip color={currentStatus.color} variant="flat" size="sm">
                  {currentStatus.label}
                </Chip>
              );
            },
          },
          {
            header: "Total",
            cell: ({ row: { original } }) => {
              const total =
                original.entryOrderDetails.reduce(
                  (acc, item) => acc + item.quantity * item.unitPrice,
                  0,
                ) *
                (1 + original.tax / 100);
              return total.toLocaleString("es-PE", {
                style: "currency",
                currency: "PEN",
              });
            },
          },
          {
            header: "Acciones",
            cell: ({ row: { original } }) => (
              <div className="flex items-center gap-2">
                <Tooltip content="Ver Detalles">
                  <Chip
                    color="primary"
                    variant="flat"
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedOrder(original);
                      onOpen();
                    }}
                  >
                    <LuEye />
                  </Chip>
                </Tooltip>
              </div>
            ),
          },
        ]}
      />

      <DetailsModal
        isOpen={isOpen}
        onClose={onOpenChange}
        order={selectedOrder}
      />
    </Container>
  );
}
