import { useAuth } from "@/context/AuthContext";
import type {
  ApiResponse,
  ResponseCategories,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
} from "@heroui/react";
import { MdInventory } from "react-icons/md";

export default function ProductPage() {
  const condicion = true;
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

  if (isLoading) {
    return <h1>Cargando</h1>;
  }

  return (
    <div>
      {
        <div>
          <Card className="max-w-[400px]">
            <CardHeader className="flex gap-3">
              <MdInventory />
              <p className="text-md font-bold">Agua</p>
            </CardHeader>
            <Divider />
            <CardBody>
              <p>Recipiente portátil diseñado para contener líquidos.</p>
            </CardBody>
            <Divider />
            <CardFooter
              className={`font-semibold ${
                condicion ? "text-green-600" : "text-red-600"
              }`}
            >
              {condicion ? "Activo" : "Inactivo"}
            </CardFooter>
          </Card>
        </div>
      }
    </div>
  );
}
