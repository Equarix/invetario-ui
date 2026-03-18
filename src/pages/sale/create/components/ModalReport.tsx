import { useAuth } from "@/context/AuthContext";
import type { Product } from "@/interface/response.interface";
import type { ModalProps } from "@/interface/utils.interface";
import { instance } from "@/libs/axios";
import {
  ReportProductSchema,
  type ReportProductInput,
} from "@/schemas/store/report-product.schema";
import {
  addToast,
  Button,
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

interface ModalReportProps extends ModalProps {
  producto?: Product;
}

export function ModalReport({
  producto,
  onClose,
  isOpen,
  onConfirm,
}: ModalReportProps) {
  const { storeId, token } = useAuth();
  const { control, handleSubmit, setValue } = useForm({
    resolver: zodResolver(ReportProductSchema),
    defaultValues: {
      storeId,
      productId: producto?.productId || 0,
      quantity: 1,
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (data: ReportProductInput) => {
      const res = await instance.post("/store/report", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    },
    onSuccess: () => {
      onClose?.();
      onConfirm?.();
      addToast({
        title: "Producto reportado exitosamente",
        color: "success",
      });
      setValue("quantity", 1);
    },
    onError: () => {
      addToast({
        title: "Error al reportar el producto contáctese con soporte",
        color: "danger",
      });
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              Reportar Producto: {producto?.name} por stock faltante
            </ModalHeader>
            <Form className="w-full" onSubmit={handleSubmit((v) => mutate(v))}>
              <ModalBody className="w-full">
                <Controller
                  control={control}
                  name="quantity"
                  render={({ field }) => (
                    <Input
                      label="Cantidad para reponer"
                      type="number"
                      min={1}
                      labelPlacement="outside"
                      value={field.value?.toString()}
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
                <Button color="primary" className="ml-2" type="submit">
                  Reportar
                </Button>
              </ModalFooter>
            </Form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
