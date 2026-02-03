import Container from "@/components/components/container/Container";
import ImageGalleryModal from "@/components/components/image-galery/ImageGalery";
import Load from "@/components/components/load/Load";
import Header from "@/components/layouts/header/Header";
import { ENV } from "@/config/env";
import { useAuth } from "@/context/AuthContext";
import type {
  ApiResponse,
  ResponseCategories,
  ResponseGalery,
  ResponseUnit,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import {
  ProductSchema,
  type ProductInput,
} from "@/schemas/product/product.schema";
import { cn } from "@/utils/cn";
import { parseErrors } from "@/utils/parseErrors";
import {
  addToast,
  Button,
  Form,
  Image,
  Input,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { LuImage, LuPlus, LuTrash } from "react-icons/lu";
import { useNavigate } from "react-router";

export default function CreateProductPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm({
    resolver: zodResolver(ProductSchema),
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
    mutationFn: async (data: ProductInput) => {
      const res = await instance.post("/product", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      addToast({
        title: "Producto creado",
        color: "success",
      });
      navigate("/productos");
    },
    onError: () => {
      addToast({
        title: "Error al crear el producto",
        color: "danger",
      });
    },
  });

  return (
    <Form
      validationErrors={parseErrors(errors)}
      onSubmit={handleSubmit((data) => {
        mutate(data);
      })}
    >
      <Load loading={isLoadingCat || isLoadingUnit || isPending} />
      <Container>
        <Header
          icon={<LuPlus />}
          text={{
            header: "Crear Producto",
            button: "Guardar Producto",
          }}
          type="submit"
        />

        <div className="grid grid-cols-2 gap-4 bg-default-50 p-6 rounded-lg">
          <Input
            label="Código Interno"
            placeholder="XXX-XXX-XXX"
            labelPlacement="outside"
            {...register("codeInternal")}
          />

          <Input
            label="Código"
            placeholder="Código del producto"
            labelPlacement="outside"
            {...register("code")}
          />

          <Input
            label="Nombre"
            placeholder="Nombre del producto"
            labelPlacement="outside"
            {...register("name")}
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
          <Input
            type="number"
            label="Precio de Compra"
            placeholder="0.00"
            labelPlacement="outside"
            {...register("priceBuy", { valueAsNumber: true })}
          />

          <Input
            type="number"
            label="Precio de Venta"
            placeholder="0.00"
            labelPlacement="outside"
            {...register("priceSell", { valueAsNumber: true })}
          />

          <Input
            type="number"
            label="Stock Mínimo"
            placeholder="0"
            labelPlacement="outside"
            {...register("minStock", { valueAsNumber: true })}
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

          <Textarea
            label="Descripción"
            placeholder="Descripción del producto"
            labelPlacement="outside"
            {...register("description")}
          />
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
