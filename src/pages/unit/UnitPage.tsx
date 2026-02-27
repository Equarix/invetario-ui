import CardSingle from "@/components/components/card-single/CardSingle";
import { useAuth } from "@/context/AuthContext";
import type { ApiResponse, ResponseUnit } from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import { Button, useDisclosure } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { LuPlus } from "react-icons/lu";
import { useState } from "react";
import CreateUnit from "./create/CreateUnit";
import EditUnit from "./edit/EditUnit";
import DeleteUnitModal from "./delete/DeleteUnitModal";
import Title from "@/components/components/title/Title";

export default function UnitPage() {
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

  const [selectedUnitId, setSelectedUnitId] = useState<number>(-1);

  const { data, refetch } = useQuery<ApiResponse<ResponseUnit[]>>({
    queryKey: ["units"],
    queryFn: async () => {
      const res = await instance.get("/unit", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    },
  });

  const handleEdit = (id: number) => {
    setSelectedUnitId(id);
    onOpenEdit();
  };

  const handleDelete = (id: number) => {
    setSelectedUnitId(id);
    onOpenDelete();
  };

  return (
    <div className="flex flex-col p-4 h-full w-full">
      <header className="flex items-center justify-between">
        <Title>Unidades de Inventario</Title>

        <Button
          color="primary"
          className="font-semibold"
          onPress={onOpenCreate}
        >
          <LuPlus size={16} />
          Agregar Unidad
        </Button>
      </header>

      <section className="w-full grid grid-cols-4 gap-2 mt-4">
        {data?.data.map((u) => (
          <CardSingle
            status={u.status}
            key={u.unitId}
            title={u.name}
            subtitle={u.description}
            onEdit={() => handleEdit(u.unitId)}
            onDelete={() => handleDelete(u.unitId)}
          />
        ))}
      </section>

      <CreateUnit
        isOpen={isOpenCreate}
        onClose={onCloseCreate}
        onConfirm={refetch}
      />

      <EditUnit
        isOpen={isOpenEdit}
        onClose={onCloseEdit}
        onConfirm={refetch}
        unitId={selectedUnitId}
      />

      <DeleteUnitModal
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        onConfirm={refetch}
        unitId={selectedUnitId}
      />
    </div>
  );
}
