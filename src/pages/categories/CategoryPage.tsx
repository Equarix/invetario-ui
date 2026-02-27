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
import { useState } from "react";
import CreateCategory from "./create/CreateCategory";
import EditCategory from "./edit/EditCategory";
import DeleteCategoryModal from "./delete/DeleteCategoryModal";
import Title from "@/components/components/title/Title";

export default function CategoryPage() {
  const { token } = useAuth();
  const {
    onOpen: onOpenCreate,
    isOpen: isOpenCreate,
    onClose: onCloseCreate,
  } = useDisclosure();
  const {
    onOpen: onOpenEdit,
    isOpen: isOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();
  const {
    onOpen: onOpenDelete,
    isOpen: isOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();

  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(-1);

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

  const handleEdit = (id: number) => {
    setSelectedCategoryId(id);
    onOpenEdit();
  };

  const handleDelete = (id: number) => {
    setSelectedCategoryId(id);
    onOpenDelete();
  };

  return (
    <div className="flex flex-col p-4 h-full w-full">
      <header className="flex items-center justify-between">
        <Title>Categorias de Inventario</Title>

        <Button
          color="primary"
          className="font-semibold"
          onPress={onOpenCreate}
        >
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
            onEdit={() => handleEdit(u.categoryId)}
            onDelete={() => handleDelete(u.categoryId)}
          />
        ))}
      </section>

      <CreateCategory
        isOpen={isOpenCreate}
        onClose={onCloseCreate}
        onConfirm={refetch}
      />

      <EditCategory
        isOpen={isOpenEdit}
        onClose={onCloseEdit}
        onConfirm={refetch}
        categoryId={selectedCategoryId}
      />

      <DeleteCategoryModal
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        onConfirm={refetch}
        categoryId={selectedCategoryId}
      />
    </div>
  );
}
