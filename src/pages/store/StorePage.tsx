import Table from "@/components/components/table/Table";
import Header from "@/components/layouts/header/Header";
import { useAuth } from "@/context/AuthContext";
import type {
  ApiResponse,
  ResponseStore,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import { Chip, Tooltip, useDisclosure } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { LuEye, LuPen, LuPlus, LuTrash, LuUsers } from "react-icons/lu";
import { Link, useNavigate } from "react-router";
import DeleteModal from "./delete/DeleteModal";
import KpiCard from "@/components/components/kpi-card/KpiCard";
import AssingCreateModal from "./assing-create/AssingCreateModal";

export default function StorePage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading, refetch } = useQuery<ApiResponse<ResponseStore[]>>({
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
  const { onOpen, isOpen, onOpenChange } = useDisclosure();
  const {
    onOpen: onOpenAssign,
    isOpen: isAssignOpen,
    onOpenChange: onAssignOpenChange,
  } = useDisclosure();
  const [storeId, setStoreId] = useState<number>(-1);

  return (
    <div className="flex flex-col p-4 h-full w-full">
      <Header
        text={{
          header: "Almacenes",
          button: "Crear Almacén",
        }}
        icon={<LuPlus size={16} />}
        onClick={() => navigate("/almacenes/crear")}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <KpiCard
          title="Total Almacenes"
          value="5"
          icon={<LuPlus />}
          color="primary"
          description="Sedes operativas registradas"
          isLoading={isLoading}
        />
        <KpiCard
          title="Almacenes Activos"
          value="5"
          icon={<LuEye />}
          color="success"
          description="Almacenes funcionando"
          isLoading={isLoading}
        />
        <KpiCard
          title="Capacidad Total"
          value="15,000 m²"
          icon={<LuPen />}
          color="secondary"
          description="Espacio de almacenamiento total"
          isLoading={isLoading}
        />
      </div>

      <Table
        data={data?.data ?? []}
        isLoading={isLoading}
        columns={[
          {
            header: "Almacen ID",
            accessorKey: "storeId",
          },
          {
            header: "Nombre",
            cell: ({ row: { original } }) => (
              <Link
                to={`/almacenes/productos/${original.storeId}`}
                className="hover:underline"
              >
                {original.name}
              </Link>
            ),
          },
          {
            header: "Código",
            accessorKey: "code",
          },
          {
            header: "Dirección",
            accessorKey: "address",
          },
          {
            header: "Teléfono",
            accessorKey: "phone",
          },
          {
            header: "Maxima Capacidad",
            accessorKey: "maxCapacity",
          },
          {
            header: "Encargado",
            accessorFn: (row) => `${row.user.firstName} ${row.user.lastName}`,
          },
          {
            header: "Estado",
            cell: ({ row: { original } }) => (
              <Chip
                color={original.status ? "success" : "danger"}
                classNames={{
                  base: "text-white",
                }}
              >
                {original.status ? "Activo" : "Inactivo"}
              </Chip>
            ),
          },
          {
            header: "Fecha de Creación",
            accessorFn: (row) => new Date(row.createdAt).toLocaleDateString(),
          },
          {
            header: "Acciones",
            cell: ({ row: { original } }) => (
              <div className="flex items-center gap-2">
                <Tooltip
                  color="warning"
                  content={`Asignar Usuarios a ${original.name}`}
                >
                  <Chip
                    color="warning"
                    className="text-white"
                    onClick={() => {
                      setStoreId(original.storeId);
                      onOpenAssign();
                    }}
                  >
                    <LuUsers />
                  </Chip>
                </Tooltip>

                <Tooltip
                  color="secondary"
                  content={`Ver Productos en ${original.name}`}
                >
                  <Link to={`/almacenes/productos/${original.storeId}`}>
                    <Chip color="secondary">
                      <LuEye />
                    </Chip>
                  </Link>
                </Tooltip>

                <Tooltip
                  color="primary"
                  content={`Editar Almacén ${original.name}`}
                >
                  <Link to={`/almacenes/editar/${original.storeId}`}>
                    <Chip color="primary">
                      <LuPen />
                    </Chip>
                  </Link>
                </Tooltip>

                <Tooltip
                  color="danger"
                  content={`Eliminar Almacén ${original.name}`}
                >
                  <Chip
                    color="danger"
                    onClick={() => {
                      setStoreId(original.storeId);
                      onOpen();
                    }}
                  >
                    <LuTrash />
                  </Chip>
                </Tooltip>
              </div>
            ),
          },
        ]}
      />

      <DeleteModal
        isOpen={isOpen}
        onClose={onOpenChange}
        storeId={storeId}
        onConfirm={refetch}
      />

      <AssingCreateModal
        isOpen={isAssignOpen}
        onClose={onAssignOpenChange}
        storeId={storeId}
      />
    </div>
  );
}
