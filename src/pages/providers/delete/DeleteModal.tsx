import { useAuth } from "@/context/AuthContext";
import type { ModalProps } from "@/interface/utils.interface";
import { instance } from "@/libs/axios";
import {
  addToast,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useMutation } from "@tanstack/react-query";

interface DeleteModalProps extends ModalProps {
  providerId: number;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  providerId,
}: DeleteModalProps) {
  const { token } = useAuth();
  const { mutate } = useMutation({
    mutationFn: async () => {
      const res = await instance.delete(`/provider/${providerId}`, {
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
        title: "Proveedor eliminado exitosamente",
        color: "success",
      });
    },
    onError: () => {
      addToast({
        title: "Error al eliminar el proveedor",
        color: "danger",
      });
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent className="bg-zinc-900">
        {(onClose) => (
          <>
            <ModalHeader>Eliminar Proveedor</ModalHeader>
            <ModalBody>
              <p className="text-white">
                ¿Estás seguro de que deseas eliminar este proveedor? Esta acción
                no se puede deshacer.
              </p>
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
              <Button color="primary" className="ml-2" onPress={() => mutate()}>
                Eliminar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
