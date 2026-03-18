import Load from "@/components/components/load/Load";
import { useAuth } from "@/context/AuthContext";
import type { ResponsePayMethod } from "@/interface/response.interface";
import type { ModalProps } from "@/interface/utils.interface";
import { instance } from "@/libs/axios";
import {
  UpdatePayMethodSchema,
  type UpdatePayMethodInput,
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

interface UpdatePayMethodProps extends ModalProps {
  paymethod: ResponsePayMethod;
}

export default function UpdatePayMethod({
  isOpen,
  onClose,
  onConfirm,
  paymethod,
}: UpdatePayMethodProps) {
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(UpdatePayMethodSchema),
    defaultValues: {
      name: paymethod.name,
      turned: paymethod.turned,
      paymethodId: paymethod.paymethodId,
      status: paymethod.status,
    },
  });
  const { token } = useAuth();
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: UpdatePayMethodInput) => {
      const res = await instance.put(`/paymethod/${data.paymethodId}`, data, {
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
        title: "Metodo de pago actualizado exitosamente",
        color: "success",
      });
    },
    onError: () => {
      addToast({
        title: "Error al actualizar el metodo de pago",
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
            <ModalHeader>Actualizar Metodo de Pago</ModalHeader>

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

                <div className="grid grid-cols-2 gap-4">
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

                  <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <Checkbox
                        isSelected={field.value}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        Estado
                      </Checkbox>
                    )}
                  />
                </div>
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
                  Actualizar Metodo de Pago
                </Button>
              </ModalFooter>
            </Form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
