import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  addToast,
} from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { instance } from "@/libs/axios";
import { useAuth } from "@/context/AuthContext";
import type { ResponseBoxItem } from "@/interface/response.interface";
import { LuTrash2 } from "react-icons/lu";

interface DeleteBoxModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  box: ResponseBoxItem | null;
}

export default function DeleteBoxModal({
  isOpen,
  onOpenChange,
  box,
}: DeleteBoxModalProps) {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!box) return;
      const res = await instance.delete(`/box/${box.boxId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boxes-list"] });
      addToast({
        title: "Caja eliminada exitosamente",
        color: "success",
      });
      setErrorMsg(null);
      onOpenChange(false);
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message || "Ocurrió un error al eliminar la caja.";
      setErrorMsg(msg);
      addToast({
        title: "Error al eliminar la caja",
        color: "danger",
      });
    },
  });

  if (!box) return null;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      backdrop="blur"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center gap-2 text-danger">
              <LuTrash2 size={20} />
              <span>Eliminar Caja</span>
            </ModalHeader>

            <ModalBody className="space-y-3">
              {errorMsg && (
                <div className="p-3 text-xs bg-danger-50 text-danger border border-danger-200 rounded-lg">
                  {errorMsg}
                </div>
              )}
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                ¿Estás seguro de que deseas eliminar la caja{" "}
                <strong className="text-zinc-900 dark:text-white font-semibold">
                  "{box.boxName}"
                </strong>{" "}
                (Serie: {box.serie})?
              </p>
              <p className="text-xs text-zinc-400">
                Esta acción eliminará el registro de la caja del sistema.
              </p>
            </ModalBody>

            <ModalFooter>
              <Button variant="flat" color="default" onPress={onClose}>
                Cancelar
              </Button>
              <Button
                color="danger"
                onPress={() => deleteMutation.mutate()}
                isLoading={deleteMutation.isPending}
                className="font-semibold"
              >
                Eliminar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
