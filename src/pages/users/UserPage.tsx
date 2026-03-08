import Container from "@/components/components/container/Container";
import Table from "@/components/components/table/Table";
import Header from "@/components/layouts/header/Header";
import { useAuth } from "@/context/AuthContext";
import type {
  ApiResponse,
  ResponseUsers,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import { statusColorMap } from "@/utils/utils";
import { Chip, useDisclosure } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import CreateUser from "./create/CreateUser";

export default function UserPage() {
  const { token } = useAuth();
  const { data, isLoading } = useQuery<ApiResponse<ResponseUsers[]>>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await instance.get("/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });

  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <Container>
      <Header
        text={{
          header: "Gestion de Usuarios",
          button: "Crear Usuario",
        }}
        onClick={onOpen}
      />

      <Table
        data={data?.data || []}
        columns={[
          {
            header: "ID",
            accessorKey: "userId",
          },
          {
            header: "Nombre",
            accessorFn: (row) => `${row.firstName} ${row.lastName}`,
          },
          {
            header: "Email",
            accessorKey: "email",
          },
          {
            header: "Rol",
            accessorKey: "role",
          },
          {
            header: "Estado",
            cell: ({ row: { original: sale } }) => (
              <Chip
                className="capitalize"
                color={statusColorMap[sale.status.toString()]}
                size="sm"
                variant="flat"
              >
                {sale.status ? "Activo" : "Inactivo"}
              </Chip>
            ),
          },
        ]}
        isLoading={isLoading}
        emptyContent="No hay usuarios registrados"
      />

      <CreateUser isOpen={isOpen} onClose={onClose} />
    </Container>
  );
}
