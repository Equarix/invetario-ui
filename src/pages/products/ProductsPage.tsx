import Container from "@/components/components/container/Container";
import Table from "@/components/components/table/Table";
import Header from "@/components/layouts/header/Header";
import { ENV } from "@/config/env";
import { useAuth } from "@/context/AuthContext";
import type {
  ApiResponse,
  PaginateResponse,
  Product,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import { Chip, Image, Pagination, Tooltip, useDisclosure } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { LuCar, LuPen, LuTrash } from "react-icons/lu";
import { Link, useNavigate } from "react-router";
import DeleteModal from "./delete/DeleteModal";
import KpiCard from "@/components/components/kpi-card/KpiCard";

export default function ProductsPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, refetch } = useQuery<
    ApiResponse<PaginateResponse<Product[]>>
  >({
    queryKey: ["products", currentPage],
    queryFn: async () => {
      const res = await instance.get("/product", {
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
  const [productId, setProductId] = useState<number>(-1);

  return (
    <Container>
      <Header
        icon={<LuCar />}
        text={{
          header: "Productos",
          button: "Agregar Producto",
        }}
        onClick={() => navigate("/productos/crear")}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard
          title="Total Productos"
          value="482"
          icon={<LuCar />}
          color="primary"
          description="Variedad total de productos"
          isLoading={isLoading}
        />
        <KpiCard
          title="Productos Activos"
          value="450"
          icon={<LuCar />}
          color="success"
          description="Productos disponibles para venta"
          isLoading={isLoading}
        />
        <KpiCard
          title="Precio Promedio"
          value="S/ 120.00"
          icon={<LuCar />}
          color="secondary"
          description="Valor promedio de venta"
          isLoading={isLoading}
        />
        <KpiCard
          title="Bajo Stock"
          value="12"
          icon={<LuCar />}
          color="danger"
          description="Productos próximos a agotarse"
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
            header: "Imagen",
            cell({
              row: {
                original: { image },
              },
            }) {
              return (
                <Image
                  src={ENV.API_URL + image.imageUrl}
                  alt="Product Image"
                  width={50}
                  height={50}
                  className="object-cover"
                />
              );
            },
          },
          {
            header: "Código",
            accessorKey: "code",
          },
          {
            header: "SKU",
            accessorKey: "codeInternal",
          },
          {
            header: "Nombre",
            accessorKey: "name",
          },
          {
            header: "Descripción",
            accessorKey: "description",
          },
          {
            header: "Categoria",
            accessorFn: (row) => row.category.name,
          },
          {
            header: "Unidad",
            accessorFn: (row) => row.unit.name,
          },
          {
            header: "Precio de Compra",
            accessorKey: "priceBuy",
          },
          {
            header: "Precio de Venta",
            accessorKey: "priceSell",
          },
          {
            header: "Stock Minimo",
            accessorKey: "minStock",
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
                  content={`Editar Producto ${original.name}`}
                >
                  <Link to={`/productos/editar/${original.productId}`}>
                    <Chip color="primary">
                      <LuPen />
                    </Chip>
                  </Link>
                </Tooltip>

                <Tooltip
                  color="danger"
                  content={`Eliminar Producto ${original.name}`}
                >
                  <Chip
                    color="danger"
                    onClick={() => {
                      setProductId(original.productId);
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
        productId={productId}
      />
    </Container>
  );
}
