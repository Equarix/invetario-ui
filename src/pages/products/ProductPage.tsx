import { useAuth } from "@/context/AuthContext";
import type {
  ApiResponse,
  ResponseCategories,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardBody, Image } from "@heroui/react";
import { Chip } from "@heroui/react";

export default function ProductPage() {
  const condicion = false;
  const { token } = useAuth();
  const { data, isLoading } = useQuery<ApiResponse<ResponseCategories[]>>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await instance.get("/category", {
        headers: {
          Authorization: `Bearer ` + token,
        },
      });
      return res.data;
    },
  });

  return (
    <div>
      <div>
        <Card className="max-w-[400px] bg-zinc-800">
          <CardHeader className="overflow-visible py-3">
            <Image
              src="/src/assets/images/frutas.jpg"
              alt="Card Image"
              className="rounded-lg"
            />
          </CardHeader>
          <CardBody className="flex flex-row pb-0 pt-2 px-4 py-3 items-start justify-between">
            <div>
              <h4 className="font-bold text-large text-white">Frutas</h4>
              <small className="text-default-500 text-white">
                24 Tipos disponibles
              </small>
            </div>
            <Chip
              color={condicion ? "success" : "danger"}
              className=" self-end text-tiny uppercase font-bold"
            >
              {condicion ? "Activo" : "Inactivo"}
            </Chip>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
