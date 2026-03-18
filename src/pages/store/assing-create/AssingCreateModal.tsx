import type { ModalProps } from "@/interface/utils.interface";
import { useAssingCreate } from "./hooks/useAssingCreate";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
  Spinner,
} from "@heroui/react";

interface AssingCreateModalProps extends ModalProps {
  storeId?: number;
}

export default function AssingCreateModal({
  isOpen,
  onClose,
  storeId,
}: AssingCreateModalProps) {
  const { users, storeUsers, functions } = useAssingCreate({ storeId, isOpen });

  const getAssignedData = (userId: number) => {
    return storeUsers.data.find((su) => su.user.userId === userId);
  };

  const handleToggleAssign = (userId: number) => {
    const assigned = getAssignedData(userId);
    if (assigned) {
      functions.removeStoreUser(assigned.storeUserId);
    } else {
      functions.addStoreUser(userId);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="lg">
      <ModalContent className="overflow-y-auto max-h-[80vh]">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Asignar Usuarios al Almacén
            </ModalHeader>
            <ModalBody>
              {users.isLoading || storeUsers.isLoading ? (
                <div className="flex justify-center p-4">
                  <Spinner label="Cargando..." />
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {users.data.map((user) => {
                    const assigned = getAssignedData(user.userId);
                    return (
                      <Chip
                        key={user.userId}
                        color={assigned ? "primary" : "default"}
                        variant={assigned ? "solid" : "flat"}
                        className="cursor-pointer hover:opacity-80 transition-opacity select-none"
                        onClick={() => handleToggleAssign(user.userId)}
                      >
                        {user.firstName} {user.lastName}
                      </Chip>
                    );
                  })}
                  {users.data.length === 0 && (
                    <p className="text-zinc-500 text-sm">
                      No hay usuarios disponibles.
                    </p>
                  )}
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cerrar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
