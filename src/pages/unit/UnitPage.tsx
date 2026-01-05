import CardSingle from "@/components/components/card-single/CardSingle";
import { useAuth } from "@/context/AuthContext";
import type { ApiResponse, ResponseUnit } from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { LuPlus } from "react-icons/lu";

export default function UnitPage() {
  const { token } = useAuth();
  const { isLoading, data } = useQuery<ApiResponse<ResponseUnit[]>>({
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

  return (
    <div className="flex flex-col p-4 h-full w-full">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white mb-4">Unidades</h1>

        <Button color="primary" className="font-semibold">
          <LuPlus size={16} />
          Agregar Unidad
        </Button>
      </header>

      <section className="w-full grid grid-cols-4 gap-2">
        {data?.data.map((u) => (
          <CardSingle
            status={u.status}
            key={u.unitId}
            title={u.name}
            subtitle={u.description}
          />
        ))}
      </section>
    </div>
  );
}
