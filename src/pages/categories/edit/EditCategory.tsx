import { useAuth } from "@/context/AuthContext";
import type {
  ApiResponse,
  ResponseCategories,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import {
  updateUnitSchema,
  type UpdateUnitInput,
} from "@/schemas/unit/unit.schema";
import {
  addToast,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Switch,
  Textarea,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

interface EditCategoryProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  categoryId: number;
}

export default function EditCategory({
  isOpen,
  onClose,
  onConfirm,
  categoryId,
}: EditCategoryProps) {
  const { token } = useAuth();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UpdateUnitInput>({
    resolver: zodResolver(updateUnitSchema),
  });

  const { data: categoryData, isLoading: isLoadingFetch } = useQuery<
    ApiResponse<ResponseCategories>
  >({
    queryKey: ["category", categoryId],
    queryFn: async () => {
      const res = await instance.get(`/category/${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: isOpen && categoryId !== -1,
  });

  useEffect(() => {
    if (categoryData?.data) {
      reset({
        name: categoryData.data.name,
        description: categoryData.data.description,
        status: categoryData.data.status,
      });
    }
  }, [categoryData, reset]);

  const { isPending, mutate } = useMutation({
    mutationFn: async (data: UpdateUnitInput) => {
      const res = await instance.put(`/category/${categoryId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    },
    onSuccess: () => {
      onClose();
      addToast({
        title: "Categoria actualizada exitosamente",
        color: "success",
      });
      onConfirm?.();
    },
    onError: () => {
      addToast({
        title: "Error al actualizar la categoria",
        color: "danger",
      });
    },
  });

  const onSubmit = (data: UpdateUnitInput) => {
    mutate(data);
  };

  return (
    <Modal isOpen={isOpen} placement="top-center" onOpenChange={onClose}>
      {(isPending || isLoadingFetch) && <Spinner />}
      <ModalContent className="bg-zinc-900">
        {(onClose) => (
          <>
            <ModalHeader className="text-white">Editar Categoria</ModalHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalBody>
                <Controller
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <Input
                      isRequired
                      label="Nombre"
                      placeholder="Ingresa el nombre de la categoria"
                      variant="bordered"
                      classNames={{
                        label: "text-white!",
                        input: "bg-zinc-800 text-white!",
                      }}
                      {...field}
                      value={field.value || ""}
                      errorMessage={errors.name?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <Textarea
                      isRequired
                      label="Descripción"
                      labelPlacement="outside"
                      placeholder="Ingresa la descripción"
                      classNames={{
                        label: "text-white!",
                        input: "bg-zinc-800 text-white!",
                      }}
                      variant="bordered"
                      {...field}
                      value={field.value || ""}
                      errorMessage={errors.description?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="status"
                  render={({ field: { value, onChange, name } }) => (
                    <div className="flex items-center mt-2">
                      <Switch
                        isSelected={!!value}
                        onValueChange={onChange}
                        name={name}
                      >
                        <span className="text-white">
                          Estado (Activo/Inactivo)
                        </span>
                      </Switch>
                    </div>
                  )}
                />
              </ModalBody>

              <ModalFooter>
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
                  Actualizar Categoria
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
