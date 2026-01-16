import Load from "@/components/components/load/Load";
import StoreHero from "@/components/components/store-hero/StoreHero";
import Table from "@/components/components/table/Table";
import Header from "@/components/layouts/header/Header";
import { ENV } from "@/config/env";
import { useAuth } from "@/context/AuthContext";
import type {
  ApiResponse,
  ResponseProductStore,
  ResponseStore,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";
import { LuPlus } from "react-icons/lu";
import { useParams } from "react-router";

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
  });

  const { data: resProducts, isLoading: isLoadingProducts } = useQuery<
    ApiResponse<ResponseProductStore[]>
  >({
    queryKey: ["products-store", storeId],
    queryFn: async () => {
      const res = await instance.get(`/store/${storeId}/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });

  return (
    <div className="flex flex-col p-4 h-full w-full">
      <Load loading={isLoadingStore} />

      <StoreHero store={resStore?.data} />

      <Header
        text={{
          header: `Productos`,
          button: "Crear",
        }}
        icon={<LuPlus size={16} />}
      />

      <Table
        data={resProducts?.data ?? []}
        isLoading={isLoadingProducts}
        columns={[
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
            header: "Stock Reservado",
            accessorKey: "reservedStock",
          },
          {
            header: "Stock Disponible",
            accessorKey: "availableStock",
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
        ]}
      />
    </div>
  );
}
