import { useAuth } from "@/context/AuthContext";
import type { ApiResponse, ResponseUnit } from "@/interface/response.interface";
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

interface EditUnitProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  unitId: number;
}

export default function EditUnit({
  isOpen,
  onClose,
  onConfirm,
  unitId,
}: EditUnitProps) {
  const { token } = useAuth();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UpdateUnitInput>({
    resolver: zodResolver(updateUnitSchema),
  });

  const { data: unitData, isLoading: isLoadingFetch } = useQuery<
    ApiResponse<ResponseUnit>
  >({
    queryKey: ["unit", unitId],
    queryFn: async () => {
      const res = await instance.get(`/unit/${unitId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: isOpen && unitId !== -1,
  });

  useEffect(() => {
    if (unitData?.data) {
      reset({
        name: unitData.data.name,
        description: unitData.data.description,
        status: unitData.data.status,
      });
    }
  }, [unitData, reset]);

  const { isPending, mutate } = useMutation({
    mutationFn: async (data: UpdateUnitInput) => {
      const res = await instance.put(`/unit/${unitId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    },
    onSuccess: () => {
      onClose();
      addToast({
        title: "Unidad actualizada exitosamente",
        color: "success",
      });
      onConfirm?.();
    },
    onError: () => {
      addToast({
        title: "Error al actualizar la unidad",
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
            <ModalHeader className="text-white">Editar Unidad</ModalHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalBody>
                <Controller
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <Input
                      isRequired
                      label="Nombre"
                      placeholder="Ingresa el nombre de la unidad"
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
                  Actualizar Unidad
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
