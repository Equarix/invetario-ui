import { useAuth } from "@/context/AuthContext";
import { instance } from "@/libs/axios";
import {
  UnitSchema,
  type OmitUnitSchemaType,
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
  Textarea,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

interface CreateUnitProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

export default function CreateUnit({
  isOpen,
  onClose,
  onConfirm,
}: CreateUnitProps) {
  const { token } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(UnitSchema),
  });

  const { isPending, mutate } = useMutation({
    mutationFn: async (data: OmitUnitSchemaType) => {
      const res = await instance.post("/unit", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    },
    onSuccess: () => {
      onClose();
      addToast({
        title: "Unidad creada exitosamente",
        color: "success",
      });
      onConfirm?.();
    },
    onError: () => {
      addToast({
        title: "Error al crear la unidad",
        color: "danger",
      });
    },
  });

  const onSubmit = (data: OmitUnitSchemaType) => {
    mutate(data);
  };

  return (
    <Modal isOpen={isOpen} placement="top-center" onOpenChange={onClose}>
      {isPending && <Spinner />}
      <ModalContent className="bg-zinc-900">
        {(onClose) => (
          <>
            <ModalHeader className="text-white">Crear Unidad</ModalHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalBody>
                <Input
                  isRequired
                  label="Nombre"
                  placeholder="Ingresa el nombre de la unidad"
                  variant="bordered"
                  classNames={{
                    label: "text-white!",
                    input: "bg-zinc-800 text-white!",
                  }}
                  {...register("name")}
                  errorMessage={errors.name?.message}
                />

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
                  {...register("description")}
                  errorMessage={errors.description?.message}
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
                  Crear Unidad
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
