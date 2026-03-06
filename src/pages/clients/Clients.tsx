import Container from "@/components/components/container/Container";
import Table from "@/components/components/table/Table";
import Header from "@/components/layouts/header/Header";
import { useAuth } from "@/context/AuthContext";
import type {
  ApiResponse,
  PaginateResponse,
  ResponseClient,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import { Chip, Pagination, Tooltip, useDisclosure } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { LuUsers, LuPen, LuTrash } from "react-icons/lu";
import { Link, useNavigate } from "react-router";
import DeleteModal from "./delete/DeleteModal";
import KpiCard from "@/components/components/kpi-card/KpiCard";

export default function Clients() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, refetch } = useQuery<
    ApiResponse<PaginateResponse<ResponseClient[]>>
  >({
    queryKey: ["clients", currentPage],
    queryFn: async () => {
      const res = await instance.get("/client", {
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

  const { onOpen, isOpen, onOpenChange } = useDisclosure();
  const [clientId, setClientId] = useState<number>(-1);

  return (
    <Container>
      <Header
        icon={<LuUsers />}
        text={{
          header: "Clientes",
          button: "Agregar Cliente",
        }}
        onClick={() => navigate("/clientes/crear")}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <KpiCard
          title="Total Clientes"
          value="3,420"
          icon={<LuUsers />}
          color="primary"
          description="Base total de clientes"
          isLoading={isLoading}
        />
        <KpiCard
          title="Clientes Activos"
          value="3,200"
          icon={<LuUsers />}
          color="success"
          description="Clientes con compras recientes"
          isLoading={isLoading}
        />
        <KpiCard
          title="Nuevos (Mes)"
          value="125"
          icon={<LuUsers />}
          color="secondary"
          description="Clientes registrados este mes"
          isLoading={isLoading}
        />
      </div>

      <Table
        data={data?.data.items || []}
        bottomContent={
          pagination.totalPages > 1 ? (
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={pagination.currentPage}
                total={pagination.totalPages}
                onChange={pagination.setCurrentPage}
              />
            </div>
          ) : null
        }
        columns={[
          {
            header: "Tipo Cliente",
            accessorKey: "clientType",
          },
          {
            header: "Nombre",
            accessorKey: "name",
          },
          {
            header: "Tipo documento",
            accessorKey: "typeDocument",
          },
          {
            header: "Número documento",
            accessorKey: "documentNumber",
          },
          {
            header: "Teléfono",
            accessorKey: "phone",
          },
          {
            header: "Email",
            accessorKey: "email",
          },
          {
            header: "Dirección",
            accessorKey: "address",
          },
          {
            header: "Fecha creación",
            accessorFn: (row) => new Date(row.createdAt).toLocaleDateString(),
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
            header: "Acciones",
            cell: ({ row: { original } }) => (
              <div className="flex items-center gap-2">
                <Tooltip
                  color="primary"
                  content={`Editar Cliente ${original.name}`}
                >
                  <Link to={`/clientes/editar/${original.clientId}`}>
                    <Chip color="primary">
                      <LuPen />
                    </Chip>
                  </Link>
                </Tooltip>

                <Tooltip
                  color="danger"
                  content={`Eliminar Cliente ${original.name}`}
                >
                  <Chip
                    color="danger"
                    onClick={() => {
                      setClientId(original.clientId);
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
        isLoading={isLoading}
      />
      <DeleteModal
        isOpen={isOpen}
        onClose={onOpenChange}
        onConfirm={refetch}
        clientId={clientId}
      />
    </Container>
  );
}
