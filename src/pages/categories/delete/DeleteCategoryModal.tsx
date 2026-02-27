import { useAuth } from "@/context/AuthContext";
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

interface DeleteCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  categoryId: number;
}

export default function DeleteCategoryModal({
  isOpen,
  onClose,
  onConfirm,
  categoryId,
}: DeleteCategoryModalProps) {
  const { token } = useAuth();
  const { mutate } = useMutation({
    mutationFn: async () => {
      const res = await instance.delete(`/category/${categoryId}`, {
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
        title: "Categoria eliminada exitosamente",
        color: "success",
      });
    },
    onError: () => {
      addToast({
        title: "Error al eliminar la categoria",
        color: "danger",
      });
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent className="bg-zinc-900">
        {(onClose) => (
          <>
            <ModalHeader className="text-white">Eliminar Categoria</ModalHeader>
            <ModalBody>
              <p className="text-white">
                ¿Estás seguro de que deseas eliminar esta categoria? Esta acción
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
