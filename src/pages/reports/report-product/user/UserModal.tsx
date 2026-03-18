import type { ModalProps } from "@/interface/utils.interface";
import type { ResponseReportProduct } from "../hooks/useReportProduct";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";

interface UserModalProps extends ModalProps {
  user?: ResponseReportProduct["users"];
}

export default function UserModal({ user, onClose, isOpen }: UserModalProps) {
  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="2xl">
      <ModalContent className="overflow-y-auto max-h-[80vh]">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Usuarios que reportaron el producto
            </ModalHeader>
            <ModalBody>
              <Table aria-label="Tabla de usuarios" removeWrapper shadow="none">
                <TableHeader>
                  <TableColumn>USUARIO</TableColumn>
                  <TableColumn>CORREO</TableColumn>
                  <TableColumn>CANTIDAD</TableColumn>
                </TableHeader>
                <TableBody items={user}>
                  {(item) => (
                    <TableRow key={item.userId}>
                      <TableCell>
                        {item.user.firstName} {item.user.lastName}
                      </TableCell>
                      <TableCell>{item.user.email}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
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
