import Container from "@/components/components/container/Container";
import Load from "@/components/components/load/Load";
import Header from "@/components/layouts/header/Header";
import { useAuth } from "@/context/AuthContext";
import type {
  ApiResponse,
  ResponseStore,
  ResponseUsers,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import {
  UpdateStoreSchema,
  type UpdateStoreInput,
} from "@/schemas/store/CreateStore.schema";
import { parseErrors } from "@/utils/parseErrors";
import {
  addToast,
  cn,
  Form,
  Input,
  Select,
  SelectItem,
  Switch,
  Textarea,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { LuPlus } from "react-icons/lu";
import { useNavigate, useParams } from "react-router";

export default function StoreUpdatePage() {
  const { storeId } = useParams<{ storeId: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();
  const {
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
  } = useForm({
    resolver: zodResolver(UpdateStoreSchema),
  });

  const { data, isLoading: isLoadingStore } = useQuery<
    ApiResponse<ResponseStore>
  >({
    queryKey: ["store", storeId],
    queryFn: async () => {
      const res = await instance.get(`/store/${storeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    enabled: !!storeId,
  });

  useEffect(() => {
    const store = data?.data;

    if (store) {
      console.log(store);
      reset({
        code: store.code,
        name: store.name,
        phone: store.phone,
        address: store.address,
        observations: store.observations || "",
        maxCapacity: store.maxCapacity,
        userId: store.user.userId,
        status: store.status,
      });
    }
  }, [data]);

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

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: UpdateStoreInput) => {
      const res = await instance.put(`/store/${storeId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    },
    onSuccess: () => {
      addToast({
        title: "Almacén actualizado exitosamente",
        color: "success",
      });
      navigate("/almacenes");
    },
    onError: () => {
      addToast({
        title: "Error al actualizar el almacén",
        color: "danger",
      });
    },
  });

  return (
    <Form
      validationErrors={parseErrors(errors)}
      onSubmit={handleSubmit((data) => mutate(data))}
    >
      <Load loading={isLoadingUser || isPending || isLoadingStore} />
      <Container>
        <Header
          text={{
            header: "Actualizar Almacén",
            button: "Actualizar",
          }}
          icon={<LuPlus size={16} />}
          type="submit"
        />

        <div className="grid grid-cols-2 gap-4 bg-default-50 p-6 rounded-lg">
          <Controller
            control={control}
            name="code"
            render={({ field }) => (
              <Input
                label="Codigo del Almacén"
                placeholder="Ingrese el codigo del almacén"
                labelPlacement="outside"
                {...field}
              />
            )}
          />

          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Input
                label="Nombre del Almacén"
                placeholder="Ingrese el nombre del almacén"
                labelPlacement="outside"
                {...field}
              />
            )}
          />

          <Controller
            control={control}
            name="phone"
            render={({ field }) => (
              <Input
                label="Telefono del Almacén"
                placeholder="Ingrese el telefono del almacén"
                labelPlacement="outside"
                {...field}
              />
            )}
          />

          <Controller
            control={control}
            name="address"
            render={({ field }) => (
              <Input
                label="Direccion del Almacén"
                placeholder="Ingrese la direccion del almacén"
                labelPlacement="outside"
                {...field}
              />
            )}
          />

          <Controller
            control={control}
            name="maxCapacity"
            render={({ field }) => (
              <Input
                type="number"
                label="Capacidad Máxima"
                placeholder="Ingrese la capacidad máxima del almacén"
                labelPlacement="outside"
                {...field}
                value={field.value?.toString() || ""}
              />
            )}
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
              isInvalid={!!errors.userId}
              errorMessage={errors.userId?.message}
            >
              {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
            </Select>
          </div>

          <Controller
            control={control}
            name="observations"
            render={({ field }) => (
              <Textarea
                label="Observaciones"
                placeholder="Ingrese las observaciones del almacén"
                labelPlacement="outside"
                className="col-span-2"
                errorMessage={errors.observations?.message}
                {...field}
              />
            )}
          />

          <div className="col-span-2">
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Switch isSelected={field.value} onValueChange={field.onChange}>
                  Estado del Almacén
                </Switch>
              )}
            />
          </div>
        </div>
      </Container>
    </Form>
  );
}
