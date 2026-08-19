import Load from "@/components/components/load/Load";
import StoreHero from "@/components/components/store-hero/StoreHero";
import Table from "@/components/components/table/Table";
import Header from "@/components/layouts/header/Header";
import StoreHeroSkeleton from "@/components/skeleton/store-hero-skeleton/StoreHeroSkeleton";
import { ENV } from "@/config/env";
import { useAuth } from "@/context/AuthContext";
import type {
  ApiResponse,
  PaginateResponse,
  ResponseProductStore,
  ResponseStore,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import { Chip, Pagination, Tooltip, useDisclosure } from "@heroui/react";
import type { ColumnDef } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { LuPen, LuPlus, LuTrash } from "react-icons/lu";
import { useParams } from "react-router";
import CreateProduct from "./create-product/CreateProduct";
import { useState } from "react";
import UpdateProduct from "./update-product/UpdateProduct";
import DeleteModal from "./delete-product/DeleteModal";

export default function StoreProducts() {
  const { storeId } = useParams<{
    storeId: string;
  }>();
  const { token } = useAuth();
  const { data: resStore, isLoading: isLoadingStore } = useQuery<
    ApiResponse<ResponseStore>
  >({
    queryKey: ["store-products", storeId],
    queryFn: async () => {
      const res = await instance.get(`/store/${storeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    },
    enabled: !!storeId,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: resProducts,
    isLoading: isLoadingProducts,
    refetch,
  } = useQuery<ApiResponse<PaginateResponse<ResponseProductStore>>>({
    queryKey: ["products-store", storeId, currentPage],
    queryFn: async () => {
      const res = await instance.get(`/store/${storeId}/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: currentPage,
          limit: 10,
        }
      });
      return res.data;
    },
    enabled: !!storeId,
  });

  const pagination = {
    pages: resProducts?.data.totalPages ?? 0,
    currentPage,
    setCurrentPage,
    totalItems: resProducts?.data.totalItems ?? 0,
    totalPages: resProducts?.data.totalPages ?? 0,
  }

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isOpenEdit, setIsOpenEdit] = useState({
    isOpen: false,
    productStoreId: null as number | null,
  });
  const [isOpenDelete, setIsOpenDelete] = useState({
    isOpen: false,
    productStoreId: null as number | null,
  });

  const handleCloseEdit = () => {
    setIsOpenEdit({ isOpen: false, productStoreId: null });
  };

  const handleCloseDelete = () => {
    setIsOpenDelete({ isOpen: false, productStoreId: null });
  };

  const columns: ColumnDef<ResponseProductStore>[] = [
    {
      header: "Imagen",
      cell: ({ row: { original } }) => (
        <img
          src={`${ENV.API_URL}${original.product.image.imageUrl}`}
          alt={original.product.name}
          className="w-10 h-10 object-cover rounded-md"
        />
      ),
    },
    {
      header: "Codigo Interno",
      accessorKey: "product.codeInternal",
    },
    {
      header: "Nombre",
      accessorKey: "product.name",
    },
    {
      header: "Stock Actual",
      accessorKey: "actualStock",
    },
    {
      header: "Stock Minimo",
      accessorKey: "minStock",
    },
    {
      header: "Stock Maximo",
      accessorKey: "maxStock",
    },
    {
      header: "Precio Promedio",
      accessorKey: "avgCost",
    },
    {
      header: "Precio de Venta",
      accessorKey: "product.priceSell",
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
      cell: ({
        row: { original },
      }) => (
        <div className="flex items-center gap-2">
          <Tooltip color="primary" content="Editar Producto en Almacén">
            <Chip
              color="primary"
              onClick={() =>
                setIsOpenEdit({ isOpen: true, productStoreId: original.productStoreId })
              }
            >
              <LuPen />
            </Chip>
          </Tooltip>
          <Tooltip color="danger" content="Eliminar Producto del Almacén">
            <Chip
              color="danger"
              onClick={() =>
                setIsOpenDelete({ isOpen: true, productStoreId: original.productStoreId })
              }
            >
              <LuTrash />
            </Chip>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col p-4 h-full w-full">
      <Load loading={isLoadingStore} />

      {isLoadingStore ? (
        <StoreHeroSkeleton />
      ) : (
        <StoreHero store={resStore?.data} />
      )}

      <Header
        text={{
          header: `Productos`,
          button: "Crear",
        }}
        icon={<LuPlus size={16} />}
        onClick={onOpen}
      />

      <Table
        data={resProducts?.data.items ?? []}
        isLoading={isLoadingProducts}
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
        columns={columns}
      />

      <CreateProduct isOpen={isOpen} onClose={onClose} onConfirm={refetch} />
      <UpdateProduct
        isOpen={isOpenEdit.isOpen}
        onClose={handleCloseEdit}
        onConfirm={refetch}
        productStoreId={isOpenEdit.productStoreId!}
      />

      <DeleteModal
        isOpen={isOpenDelete.isOpen}
        onClose={handleCloseDelete}
        onConfirm={refetch}
        productStoreId={isOpenDelete.productStoreId!}
      />
    </div>
  );
}
