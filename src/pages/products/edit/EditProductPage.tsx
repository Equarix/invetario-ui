import Container from "@/components/components/container/Container";
import ImageGalleryModal from "@/components/components/image-galery/ImageGalery";
import Load from "@/components/components/load/Load";
import Header from "@/components/layouts/header/Header";
import { ENV } from "@/config/env";
import { useAuth } from "@/context/AuthContext";
import type {
  ApiResponse,
  Product,
  ResponseCategories,
  ResponseGalery,
  ResponseUnit,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import {
  UpdateProductSchema,
  type UpdateProductInput,
} from "@/schemas/product/product.schema";
import { cn } from "@/utils/cn";
import { parseErrors } from "@/utils/parseErrors";
import {
  addToast,
  Button,
  Checkbox,
  Form,
  Image,
  Input,
  Select,
  SelectItem,
  Switch,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { LuImage, LuPlus, LuTrash } from "react-icons/lu";
import { useNavigate, useParams } from "react-router";

export default function EditProductPage() {
  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    reset,
  } = useForm<UpdateProductInput>({
    resolver: zodResolver(UpdateProductSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "productPrices",
  });

  const { productId } = useParams<{ productId: string }>();

  const { data: resProduct, isLoading: isLoadingProduct } = useQuery<
    ApiResponse<Product>
  >({
    queryKey: ["product", productId],
    queryFn: async () => {
      const res = await instance.get(`/product/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    enabled: !!productId,
  });

  const [selectedHeroImage, setSelectedHeroImage] =
    useState<ResponseGalery | null>(null);

  const {
    isOpen: isImgGalleryOpen,
    onOpen: onImgGalleryOpen,
    onOpenChange: onImgGalleryOpenChange,
  } = useDisclosure();
  const handleImageSelect = (image: ResponseGalery) => {
    setValue("imageId", image.imageId, { shouldValidate: true });
    setSelectedHeroImage(image);
  };

  const { token } = useAuth();

  const { data: resCat, isLoading: isLoadingCat } = useQuery<
    ApiResponse<ResponseCategories[]>
  >({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await instance.get("/category", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });

  const { data: resUnit, isLoading: isLoadingUnit } = useQuery<
    ApiResponse<ResponseUnit[]>
  >({
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

  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: UpdateProductInput) => {
      const res = await instance.put(`/product/${productId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      addToast({
        title: "Producto actualizado",
        color: "success",
      });
      navigate("/productos");
    },
    onError: () => {
      addToast({
        title: "Error al actualizar el producto",
        color: "danger",
      });
    },
  });

  useEffect(() => {
    const product = resProduct?.data;
    if (product) {
      reset({
        codeInternal: product.codeInternal,
        code: product.code,
        name: product.name,
        description: product.description,
        categoryId: product.category.categoryId,
        unitId: product.unit.unitId,
        priceBuy: product.priceBuy,
        priceSell: product.priceSell,
        minStock: product.minStock,
        imageId: product.image.imageId,
        status: product.status,
        productPrices: product.productPrices?.map((pp) => ({
          price: pp.price,
          status: pp.status,
        })) || [{ price: 0, status: true }],
      });
      setSelectedHeroImage(product.image);
    }
  }, [resProduct]);

  return (
    <Form
      validationErrors={parseErrors(errors)}
      onSubmit={handleSubmit((data) => {
        mutate(data);
      })}
    >
      <Load
        loading={isLoadingCat || isLoadingUnit || isPending || isLoadingProduct}
      />
      <Container>
        <Header
          icon={<LuPlus />}
          text={{
            header: "Editar Producto",
            button: "Guardar Producto",
          }}
          type="submit"
        />

        <div className="grid grid-cols-2 gap-4 bg-default-50 p-6 rounded-lg">
          <Controller
            control={control}
            name="codeInternal"
            render={({ field }) => (
              <Input
                label="Código Interno"
                placeholder="XXX-XXX-XXX"
                labelPlacement="outside"
                {...field}
              />
            )}
          />

          <Controller
            control={control}
            name="code"
            render={({ field }) => (
              <Input
                label="Código"
                placeholder="Código del producto"
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
                label="Nombre"
                placeholder="Nombre del producto"
                labelPlacement="outside"
                {...field}
              />
            )}
          />

          <Controller
            control={control}
            name="categoryId"
            render={({ field: { value, onChange, name } }) => (
              <div>
                <Select
                  label="Categoría"
                  labelPlacement="outside"
                  placeholder="Seleccione una categoría"
                  className={cn(!!errors.categoryId && "mt-0!")}
                  items={
                    resCat?.data.map((c) => ({
                      label: c.name,
                      value: c.categoryId.toString(),
                    })) || []
                  }
                  selectedKeys={value ? new Set([value.toString()]) : new Set()}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0];
                    onChange(Number(selectedKey));
                  }}
                  name={name}
                >
                  {(item) => (
                    <SelectItem key={item.value}>{item.label}</SelectItem>
                  )}
                </Select>
              </div>
            )}
          />

          <Controller
            control={control}
            name="unitId"
            render={({ field: { value, onChange, name } }) => (
              <div>
                <Select
                  label="Unidad"
                  labelPlacement="outside"
                  placeholder="Seleccione una unidad"
                  className={cn(!!errors.unitId && "mt-0!")}
                  items={
                    resUnit?.data.map((c) => ({
                      label: c.name,
                      value: c.unitId.toString(),
                    })) || []
                  }
                  selectedKeys={value ? new Set([value.toString()]) : new Set()}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0];
                    onChange(Number(selectedKey));
                  }}
                  name={name}
                >
                  {(item) => (
                    <SelectItem key={item.value}>{item.label}</SelectItem>
                  )}
                </Select>
              </div>
            )}
          />

          <Controller
            control={control}
            name="priceBuy"
            render={({ field }) => (
              <Input
                type="number"
                label="Precio de Compra"
                placeholder="0.00"
                labelPlacement="outside"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
                value={field.value?.toString() || ""}
              />
            )}
          />

          <Controller
            control={control}
            name="priceSell"
            render={({ field }) => (
              <Input
                type="number"
                label="Precio de Venta"
                placeholder="0.00"
                labelPlacement="outside"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
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
                label="Stock Mínimo"
                placeholder="0"
                labelPlacement="outside"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
                value={field.value?.toString() || ""}
              />
            )}
          />

          <div className="flex flex-col gap-2">
            <span className="text-small font-medium text-foreground">
              Imagen Principal
            </span>
            {selectedHeroImage ? (
              <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-primary group bg-default-100">
                <Image
                  src={ENV.API_URL + selectedHeroImage.imageUrl}
                  alt="Blog Image"
                  classNames={{
                    wrapper: "w-full h-full",
                    img: "w-full h-full object-cover",
                  }}
                />
                <div className="absolute top-2 right-2 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    isIconOnly
                    size="sm"
                    color="primary"
                    onPress={onImgGalleryOpen}
                  >
                    <LuImage size={16} />
                  </Button>
                  <Button
                    isIconOnly
                    size="sm"
                    color="danger"
                    onPress={() => {
                      setValue("imageId", 0, { shouldValidate: true });
                      setSelectedHeroImage(null);
                    }}
                  >
                    <LuTrash size={16} />
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className="w-full h-14 border-2 border-dashed border-default-300 rounded-lg flex items-center justify-center gap-2 text-default-400 cursor-pointer hover:border-primary hover:text-primary transition-colors bg-default-50"
                onClick={onImgGalleryOpen}
              >
                <LuImage size={20} />
                <span>Seleccionar Imagen</span>
              </div>
            )}
            {errors.imageId?.message && (
              <span className="text-tiny text-danger">
                {errors.imageId?.message}
              </span>
            )}
          </div>

          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <Textarea
                label="Descripción"
                placeholder="Descripción del producto"
                labelPlacement="outside"
                {...field}
              />
            )}
          />

          <div className="col-span-2 flex flex-col gap-3 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-small font-medium text-foreground">
                Precios del Producto
              </span>
              <Button
                size="sm"
                color="primary"
                variant="flat"
                startContent={<LuPlus size={16} />}
                onPress={() => append({ price: 0, status: true })}
              >
                Agregar Precio
              </Button>
            </div>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex items-center gap-4 bg-default-100 p-3 rounded-lg"
              >
                <Controller
                  control={control}
                  name={`productPrices.${index}.price`}
                  render={({ field }) => (
                    <Input
                      type="number"
                      label={`Precio ${index + 1}`}
                      placeholder="0.00"
                      labelPlacement="outside"
                      className="flex-1"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      value={field.value?.toString() || ""}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name={`productPrices.${index}.status`}
                  render={({ field: { value, onChange } }) => (
                    <div className="flex items-center gap-2 pt-5">
                      <Checkbox
                        isSelected={!!value}
                        onValueChange={onChange}
                      >
                        Activo
                      </Checkbox>
                    </div>
                  )}
                />
                {fields.length > 1 && (
                  <Button
                    isIconOnly
                    size="sm"
                    color="danger"
                    variant="light"
                    className="mt-5"
                    onPress={() => remove(index)}
                  >
                    <LuTrash size={16} />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="col-span-2">
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Switch isSelected={field.value} onValueChange={field.onChange}>
                  Estado del Producto
                </Switch>
              )}
            />
          </div>
        </div>
      </Container>
      <ImageGalleryModal
        isOpen={isImgGalleryOpen}
        onClose={onImgGalleryOpenChange}
        onSelect={handleImageSelect}
      />
    </Form>
  );
}

