import Table from "@/components/components/table/Table";
import Header from "@/components/layouts/header/Header";
import { useAuth } from "@/context/AuthContext";
import type {
  ApiResponse,
  ResponseStore,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import { Chip, Tooltip } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { LuEye, LuPen, LuPlus, LuTrash } from "react-icons/lu";
import { Link, useNavigate } from "react-router";

export default function StorePage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery<ApiResponse<ResponseStore[]>>({
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
                  <Chip color="danger">
                    <LuTrash />
                  </Chip>
                </Tooltip>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
