import { Card, CardFooter, Image, Button } from "@heroui/react";
import { useAuth } from "@/context/AuthContext";
import type {
  ApiResponse,
  ResponseGalery,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";
import { LuPlus } from "react-icons/lu";
import { ENV } from "@/config/env";

export default function GaleryPage() {
  const { token } = useAuth();
  const { data } = useQuery<ApiResponse<ResponseGalery[]>>({
    queryKey: ["galery"],
    queryFn: async () => {
      const res = await instance.get("/images", {
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
        <h1 className="text-2xl font-bold text-white mb-4">Galeria</h1>

        <Button color="primary" className="font-semibold">
          <LuPlus size={16} />
          Agregar Imagen
        </Button>
      </header>

      <section className="w-full grid grid-cols-4 gap-2 mt-4">
        {data?.data.map((u) => (
          <Card isFooterBlurred className="border-none" radius="lg">
            <Image src={ENV.API_URL + u.imageUrl} />
            <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
              <p className="font-semibold text-1xl text-white/80">{u.imageName.split("_").slice(1).join("_")}</p>
              <Button
                className="text-tiny text-white bg-black/20"
                color="default"
                radius="lg"
                size="sm"
                variant="flat"
              >
                Eliminar
              </Button>
            </CardFooter>
          </Card>
        ))}
      </section>
    </div>
  );
}
