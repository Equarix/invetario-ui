import CardSingle from "@/components/components/card-single/CardSingle";
import { useAuth } from "@/context/AuthContext";
import type {
  ApiResponse,
  ResponseCategories,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import { Button, useDisclosure } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { LuPlus } from "react-icons/lu";
import CreateCategory from "./create/CreateCategory";

export default function CategoryPage() {
  const { token } = useAuth();
  const { onOpen, isOpen, onOpenChange } = useDisclosure();
  const { data, refetch } = useQuery<ApiResponse<ResponseCategories[]>>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await instance.get("/category", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    },
  });
  return (
    <div className="flex flex-col p-4 h-full w-full">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white mb-4">Categorias</h1>

        <Button color="primary" className="font-semibold" onPress={onOpen}>
          <LuPlus size={16} />
          Agregar Categoria
        </Button>
      </header>

      <section className="w-full grid grid-cols-4 gap-2 mt-4">
        {data?.data.map((u) => (
          <CardSingle
            key={u.categoryId}
            title={u.name}
            subtitle={u.description}
            status={u.status}
          />
        ))}
      </section>
      <CreateCategory
        isOpen={isOpen}
        onClose={onOpenChange}
        onConfirm={refetch}
      />
    </div>
  );
}
