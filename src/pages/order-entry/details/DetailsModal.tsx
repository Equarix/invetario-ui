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
  Divider,
  Chip,
} from "@heroui/react";
import type { EntryOrderResponse } from "@/interface/response.interface";

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: EntryOrderResponse | null;
}

export default function DetailsModal({
  isOpen,
  onClose,
  order,
}: DetailsModalProps) {
  if (!order) return null;

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="4xl">
      <ModalContent className="overflow-y-auto max-h-[80vh]">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Detalles de Orden de Entrada #{order.entryOrderId}
            </ModalHeader>
            <ModalBody>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Proveedor
                  </p>
                  <p className="text-base">{order.provider.companyName}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Almacén</p>
                  <p className="text-base">{order.store.name}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Fecha de Entrada
                  </p>
                  <p className="text-base">
                    {new Date(order.entryDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Condición de Pago
                  </p>
                  <p className="text-base">{order.payCondition}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Moneda</p>
                  <p className="text-base">{order.typeMoney}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Estado</p>
                  {(() => {
                    const statusMap: Record<
                      string,
                      { label: string; color: "warning" | "success" | "danger" }
                    > = {
                      PENDING: { label: "Pendiente", color: "warning" },
                      COMPLETED: { label: "Completado", color: "success" },
                      CANCELLED: { label: "Cancelado", color: "danger" },
                    };

                    const currentStatus = statusMap[order.entryOrderStatus] || {
                      label: order.entryOrderStatus,
                      color: "default",
                    };

                    return (
                      <Chip
                        color={currentStatus.color}
                        variant="flat"
                        size="sm"
                      >
                        {currentStatus.label}
                      </Chip>
                    );
                  })()}
                </div>
              </div>

              <Divider className="my-4" />

              <p className="text-lg font-bold mb-2">Productos</p>
              <Table
                aria-label="Tabla de productos de la orden"
                removeWrapper
                shadow="none"
              >
                <TableHeader>
                  <TableColumn>PRODUCTO</TableColumn>
                  <TableColumn>CANTIDAD</TableColumn>
                  <TableColumn>PRECIO UNITARIO</TableColumn>
                  <TableColumn>SUBTOTAL</TableColumn>
                </TableHeader>
                <TableBody items={order.entryOrderDetails}>
                  {(item) => (
                    <TableRow key={item.entryOrderDetailId}>
                      <TableCell>{item.product.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>
                        {item.unitPrice.toLocaleString("es-PE", {
                          style: "currency",
                          currency: "PEN",
                        })}
                      </TableCell>
                      <TableCell>
                        {(item.quantity * item.unitPrice).toLocaleString(
                          "es-PE",
                          {
                            style: "currency",
                            currency: "PEN",
                          },
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <div className="mt-4 flex flex-col items-end gap-1">
                <p className="text-sm">
                  Subtotal:{" "}
                  <span className="font-semibold">
                    {order.entryOrderDetails
                      .reduce(
                        (acc, item) => acc + item.quantity * item.unitPrice,
                        0,
                      )
                      .toLocaleString("es-PE", {
                        style: "currency",
                        currency: "PEN",
                      })}
                  </span>
                </p>
                <p className="text-sm">
                  ITBIS ({order.tax}%):{" "}
                  <span className="font-semibold">
                    {(
                      order.entryOrderDetails.reduce(
                        (acc, item) => acc + item.quantity * item.unitPrice,
                        0,
                      ) *
                      (order.tax / 100)
                    ).toLocaleString("es-PE", {
                      style: "currency",
                      currency: "PEN",
                    })}
                  </span>
                </p>
                <p className="text-xl font-bold">
                  Total:{" "}
                  <span className="text-primary">
                    {(
                      order.entryOrderDetails.reduce(
                        (acc, item) => acc + item.quantity * item.unitPrice,
                        0,
                      ) *
                      (1 + order.tax / 100)
                    ).toLocaleString("es-PE", {
                      style: "currency",
                      currency: "PEN",
                    })}
                  </span>
                </p>
              </div>

              {order.observation && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-500">
                    Observaciones
                  </p>
                  <p className="text-sm italic text-gray-600">
                    {order.observation}
                  </p>
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
