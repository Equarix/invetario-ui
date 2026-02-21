import Container from "@/components/components/container/Container";
import Table from "@/components/components/table/Table";
import Header from "@/components/layouts/header/Header";
import { useAuth } from "@/context/AuthContext";
import type {
  ApiResponse,
  ResponseClient,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import { Chip, Tooltip, useDisclosure } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { LuUsers, LuPen, LuTrash } from "react-icons/lu";
import { Link, useNavigate } from "react-router";
import DeleteModal from "./delete/DeleteModal";

export default function Clients() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { data, isLoading, refetch } = useQuery<ApiResponse<ResponseClient[]>>({
    queryKey: ["clients"],
    queryFn: async () => {
      const res = await instance.get("/client", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });

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

      <Table
        data={data?.data || []}
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
