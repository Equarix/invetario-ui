import Load from "@/components/components/load/Load";
import { ENV } from "@/config/env";
import { useAuth } from "@/context/AuthContext";
import type {
  ApiResponse,
  Product,
  ResponseProductStore,
} from "@/interface/response.interface";
import type { ModalProps } from "@/interface/utils.interface";
import { instance } from "@/libs/axios";
import {
  UpdateProductSchema,
  type UpdateProductInput,
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
  Switch,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router";

interface UpdateProductProps extends ModalProps {
  productStoreId: number;
}

export default function UpdateProduct({
  isOpen,
  onClose,
  onConfirm,
  productStoreId,
}: UpdateProductProps) {
  const {
    formState: { errors },
    setValue,
    control,
    handleSubmit,
    watch,
  } = useForm({
    resolver: zodResolver(UpdateProductSchema),
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

  const { data: resProduct, isLoading: isLoadingProduct } = useQuery<
    ApiResponse<ResponseProductStore>
  >({
    queryKey: ["productStore", productStoreId],
    queryFn: async () => {
      const res = await instance.get(
        `/store/${storeId}/products/${productStoreId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data;
    },
    enabled: !!productStoreId,
  });

  useEffect(() => {
    const productStore = resProduct?.data;
    if (productStore) {
      setValue("productId", productStore.product.productId);
      setValue("actualStock", productStore.actualStock);
      setValue("reservedStock", productStore.reservedStock);
      setValue("availableStock", productStore.availableStock);
      setValue("maxStock", productStore.maxStock);
      setValue("minStock", productStore.minStock);
      setValue("avgCost", productStore.avgCost);
      setValue("lastCost", productStore.lastCost);
      setValue("status", productStore.status);
    }
  }, [resProduct]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: UpdateProductInput) => {
      const res = await instance.put(
        `/store/${storeId}/products/${productStoreId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data;
    },
    onSuccess: () => {
      onClose();
      onConfirm?.();
      addToast({
        title: "Producto actualizado",
        color: "success",
      });
    },
    onError: () => {
      addToast({
        title: "Error al actualizar producto",
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
            <Load
              loading={isLoadingProducts || isPending || isLoadingProduct}
            />
            <ModalHeader>Actualizar Producto de esta tienda</ModalHeader>
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
                  disabled
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
                name="reservedStock"
                render={({ field }) => (
                  <Input
                    type="number"
                    label="Stock Reservado"
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
                name="availableStock"
                render={({ field }) => (
                  <Input
                    type="number"
                    label="Stock Disponible"
                    labelPlacement="outside"
                    placeholder="0"
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

              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <div className="space-y-2 flex flex-col">
                    <label htmlFor="status">Estado del Producto</label>
                    <Switch
                      isSelected={field.value}
                      onValueChange={field.onChange}
                    />
                  </div>
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
                Actualizar Producto
              </Button>
            </ModalFooter>
          </Form>
        )}
      </ModalContent>
    </Modal>
  );
}
