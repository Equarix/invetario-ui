import Container from "@/components/components/container/Container";
import Table from "@/components/components/table/Table";
import Header from "@/components/layouts/header/Header";
import { useAuth } from "@/context/AuthContext";
import type {
  ApiResponse,
  ResponseProvider,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import { Chip, Tooltip, useDisclosure } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { LuPen, LuTrash, LuUsers } from "react-icons/lu";
import { Link, useNavigate } from "react-router";
import DeleteModal from "./delete/DeleteModal";

export default function Providers() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { data, isLoading, refetch } = useQuery<
    ApiResponse<ResponseProvider[]>
  >({
    queryKey: ["providers"],
    queryFn: async () => {
      const res = await instance.get("/provider", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });

  const { onOpen, isOpen, onOpenChange } = useDisclosure();
  const [providerId, setProviderId] = useState<number>(-1);

  return (
    <Container>
      <Header
        icon={<LuUsers />}
        text={{
          header: "Proveedores",
          button: "Agregar Proveedor",
        }}
        onClick={() => navigate("/proveedores/crear")}
      />

      <Table
        data={data?.data || []}
        columns={[
          {
            header: "Codigo",
            accessorKey: "code",
          },
          {
            header: "Nombre Compañia",
            accessorKey: "companyName",
          },
          {
            header: "Nombre Publico",
            accessorKey: "publicName",
          },
          {
            header: "Tipo documento",
            accessorKey: "typeDocument",
          },
          {
            header: "Numero documento",
            accessorKey: "documentNumber",
          },
          {
            header: "Direccion",
            accessorKey: "address",
          },
          {
            header: "Telefono",
            accessorKey: "phone",
          },
          {
            header: "Email",
            accessorKey: "email",
          },
          {
            header: "Encargado",
            accessorKey: "mainContact",
          },
          {
            header: "Telefono Encagardo",
            accessorKey: "contactPhone",
          },
          {
            header: "Condicion de pago",
            accessorKey: "payCondition",
          },
          {
            header: "Tipo de moneda",
            accessorKey: "typeMoney",
          },
          {
            header: "Dias de entrega",
            accessorKey: "daysDelivery",
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
                  content={`Editar Proveedor ${original.companyName}`}
                >
                  <Link to={`/proveedores/editar/${original.providerId}`}>
                    <Chip color="primary">
                      <LuPen />
                    </Chip>
                  </Link>
                </Tooltip>

                <Tooltip
                  color="danger"
                  content={`Eliminar Proveedor ${original.companyName}`}
                >
                  <Chip
                    color="danger"
                    onClick={() => {
                      setProviderId(original.providerId);
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
        providerId={providerId}
      />
    </Container>
  );
}
