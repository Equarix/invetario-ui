import Load from "@/components/components/load/Load";
import { useAuth } from "@/context/AuthContext";
import type { ModalProps } from "@/interface/utils.interface";
import { instance } from "@/libs/axios";
import {
  PayMethodSchema,
  type PayMethodInput,
} from "@/schemas/pay-method/payMethod.schema";
import {
  addToast,
  Button,
  Checkbox,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";

export default function CreatePayMethod({
  isOpen,
  onClose,
  onConfirm,
}: ModalProps) {
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(PayMethodSchema),
    defaultValues: {
      turned: false,
    },
  });
  const { token } = useAuth();
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: PayMethodInput) => {
      const res = await instance.post("/paymethod", data, {
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
        title: "Metodo de pago creado exitosamente",
        color: "success",
      });
    },
    onError: () => {
      addToast({
        title: "Error al crear el metodo de pago",
        color: "danger",
      });
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Load loading={isPending} />
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Crear Metodo de Pago</ModalHeader>

            <Form onSubmit={handleSubmit((v) => mutate(v))}>
              <ModalBody className="w-full">
                <Controller
                  control={control}
                  name="name"
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      label="Nombre del metodo de pago"
                      errorMessage={fieldState.error?.message}
                      placeholder="Efectivo"
                      labelPlacement="outside"
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="turned"
                  render={({ field }) => (
                    <Checkbox
                      isSelected={field.value}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      Recibe vuelto
                    </Checkbox>
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
                  Crear Categoria
                </Button>
              </ModalFooter>
            </Form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
