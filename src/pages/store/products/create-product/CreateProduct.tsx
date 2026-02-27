import Load from "@/components/components/load/Load";
import { ENV } from "@/config/env";
import { useAuth } from "@/context/AuthContext";
import type { ApiResponse, Product } from "@/interface/response.interface";
import type { ModalProps } from "@/interface/utils.interface";
import { instance } from "@/libs/axios";
import {
  CreateProductSchema,
  type CreateProductInput,
} from "@/schemas/store/create-product.schema";
import { parseErrors } from "@/utils/parseErrors";
import {
  addToast,
  Button,
  cn,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router";

export default function CreateProduct({
  isOpen,
  onClose,
  onConfirm,
}: ModalProps) {
  const {
    formState: { errors },
    setValue,
    control,
    handleSubmit,
    watch,
  } = useForm({
    resolver: zodResolver(CreateProductSchema),
  });
  const { token } = useAuth();

  const { data, isLoading: isLoadingProducts } = useQuery<
    ApiResponse<Product[]>
  >({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await instance.get("/product", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });

  const { storeId } = useParams<{ storeId: string }>();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: CreateProductInput) => {
      const res = await instance.post(`/store/${storeId}/products`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      onClose();
      onConfirm?.();
      addToast({
        title: "Producto asignado",
        color: "success",
      });
    },
    onError: () => {
      addToast({
        title: "Error al asignar producto",
        color: "danger",
      });
    },
  });

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        {(onClose) => (
          <Form
            validationErrors={parseErrors(errors)}
            onSubmit={handleSubmit((data) => mutate(data))}
          >
            <Load loading={isLoadingProducts || isPending} />
            <ModalHeader>Asignar Producto a esta tienda</ModalHeader>
            <ModalBody className="grid grid-cols-2 w-full">
              <div className="col-span-2">
                <Select
                  label="Producto"
                  placeholder="Selecciona un producto"
                  labelPlacement="outside"
                  className={cn(!!errors.productId && "mt-0!")}
                  items={data?.data || []}
                  selectedKeys={
                    watch("productId")
                      ? new Set([watch("productId")?.toString()])
                      : new Set()
                  }
                  onSelectionChange={(keys) => {
                    if (keys === "all") return;
                    const [key] = Array.from(keys);
                    setValue("productId", Number(key), {
                      shouldValidate: true,
                    });
                  }}
                  isInvalid={!!errors.productId}
                  errorMessage={errors.productId?.message}
                >
                  {(item) => (
                    <SelectItem
                      key={item.productId.toString()}
                      textValue={item.name}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={`${ENV.API_URL}${item.image.imageUrl}`}
                          className="size-10 rounded-xl"
                        />

                        {item.name}
                      </div>
                    </SelectItem>
                  )}
                </Select>
              </div>
              <Controller
                control={control}
                name="actualStock"
                render={({ field }) => (
                  <Input
                    type="number"
                    label="Stock Actual"
                    placeholder="0"
                    labelPlacement="outside"
                    {...field}
                    value={field.value?.toString() || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? undefined : Number(value));
                    }}
                  />
                )}
              />

              <Controller
                control={control}
                name="maxStock"
                render={({ field }) => (
                  <Input
                    type="number"
                    label="Stock Maximo"
                    placeholder="0"
                    labelPlacement="outside"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? undefined : Number(value));
                    }}
                    value={field.value?.toString() || ""}
                  />
                )}
              />

              <Controller
                control={control}
                name="minStock"
                render={({ field }) => (
                  <Input
                    type="number"
                    label="Stock Minimo"
                    placeholder="0"
                    labelPlacement="outside"
                    {...field}
                    value={field.value?.toString() || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? undefined : Number(value));
                    }}
                  />
                )}
              />

              <Controller
                control={control}
                name="avgCost"
                render={({ field }) => (
                  <Input
                    type="number"
                    label="Precio Promedio"
                    placeholder="0.00"
                    labelPlacement="outside"
                    {...field}
                    value={field.value?.toString() || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? undefined : Number(value));
                    }}
                  />
                )}
              />

              <Controller
                control={control}
                name="lastCost"
                render={({ field }) => (
                  <Input
                    type="number"
                    label="Último Costo"
                    placeholder="0.00"
                    labelPlacement="outside"
                    {...field}
                    value={field.value?.toString() || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? undefined : Number(value));
                    }}
                  />
                )}
              />
            </ModalBody>

            <ModalFooter className="w-full">
              <Button
                color="danger"
                variant="bordered"
                onPress={onClose}
                type="button"
                className="font-semibold"
              >
                Cancelar
              </Button>
              <Button color="primary" type="submit" className="ml-2">
                Asignar Producto
              </Button>
            </ModalFooter>
          </Form>
        )}
      </ModalContent>
    </Modal>
  );
}
