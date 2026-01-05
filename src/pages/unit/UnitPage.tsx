import CardSingle from "@/components/components/card-single/CardSingle";
import { useAuth } from "@/context/AuthContext";
import type { ApiResponse, ResponseUnit } from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import { Button, useDisclosure } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { LuPlus } from "react-icons/lu";
import CreateUnit from "./create/CreateUnit";

export default function UnitPage() {
  const { token } = useAuth();
  const { onOpen, onOpenChange, isOpen } = useDisclosure();

  const { data } = useQuery<ApiResponse<ResponseUnit[]>>({
    queryKey: ["units", isOpen],
    queryFn: async () => {
      const res = await instance.get("/unit", {
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
        <h1 className="text-2xl font-bold text-white mb-4">Unidades</h1>

        <Button color="primary" className="font-semibold" onPress={onOpen}>
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
          />
        ))}
      </section>

      <CreateUnit isOpen={isOpen} onClose={onOpenChange} />
    </div>
  );
}
