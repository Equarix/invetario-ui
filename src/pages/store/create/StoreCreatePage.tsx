import Container from "@/components/components/container/Container";
import Load from "@/components/components/load/Load";
import Header from "@/components/layouts/header/Header";
import { useAuth } from "@/context/AuthContext";
import type {
  ApiResponse,
  ResponseUsers,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import {
  CreateStoreSchema,
  type CreateStoreInput,
} from "@/schemas/store/CreateStore.schema";
import { parseErrors } from "@/utils/parseErrors";
import {
  addToast,
  cn,
  Form,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { LuPlus } from "react-icons/lu";
import { useNavigate } from "react-router";

export default function StoreCreatePage() {
  const { token } = useAuth();
  const { data: users, isLoading: isLoadingUser } = useQuery<
    ApiResponse<ResponseUsers[]>
  >({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await instance.get("/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    },
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(CreateStoreSchema),
  });

  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: CreateStoreInput) => {
      const res = await instance.post("/store", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    },
    onSuccess: () => {
      addToast({
        title: "Almacén creado exitosamente",
        color: "success",
      });
      navigate("/almacenes");
    },
    onError: () => {
      addToast({
        title: "Error al crear el almacén",
        color: "danger",
      });
    },
  });

  console.log(errors);

  return (
    <Form
      validationErrors={parseErrors(errors)}
      onSubmit={handleSubmit((data) => mutate(data))}
    >
      <Load loading={isLoadingUser || isPending} />
      <Container>
        <Header
          text={{
            header: "Crear Almacén",
            button: "Crear",
          }}
          icon={<LuPlus size={16} />}
          type="submit"
        />

        <div className="grid grid-cols-2 gap-4 bg-default-50 p-6 rounded-lg">
          <Input
            label="Codigo del Almacén"
            placeholder="Ingrese el codigo del almacén"
            labelPlacement="outside"
            {...register("code")}
          />
          <Input
            label="Nombre del Almacén"
            placeholder="Ingrese el nombre del almacén"
            labelPlacement="outside"
            {...register("name")}
          />

          <Input
            label="Telefono del Almacén"
            placeholder="Ingrese el telefono del almacén"
            labelPlacement="outside"
            {...register("phone")}
          />

          <Input
            label="Direccion del Almacén"
            placeholder="Ingrese la direccion del almacén"
            labelPlacement="outside"
            {...register("address")}
          />

          <Input
            type="number"
            label="Capacidad Máxima"
            placeholder="Ingrese la capacidad máxima del almacén"
            labelPlacement="outside"
            {...register("maxCapacity", { valueAsNumber: true })}
          />

          <div>
            <Select
              label="Encargado del Almacén"
              placeholder="Seleccione un encargado"
              labelPlacement="outside"
              className={cn(!!errors.userId && "mt-0!")}
              items={
                users?.data.map((u) => ({
                  label: `${u.firstName} ${u.lastName}`,
                  value: u.userId.toString(),
                })) || []
              }
              selectedKeys={
                watch("userId")
                  ? new Set([watch("userId")!.toString()])
                  : new Set()
              }
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0];
                setValue("userId", Number(value));
              }}
              name="userId"
            >
              {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
            </Select>
          </div>

          <Textarea
            label="Observaciones"
            placeholder="Ingrese las observaciones del almacén"
            labelPlacement="outside"
            className="col-span-2"
            {...register("observations")}
            errorMessage={errors.observations?.message}
          />
        </div>
      </Container>
    </Form>
  );
}
