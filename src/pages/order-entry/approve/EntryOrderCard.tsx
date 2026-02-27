import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Button,
  Chip,
  Divider,
} from "@heroui/react";
import { LuEye, LuCheck, LuX, LuStore, LuUser } from "react-icons/lu";
import type { EntryOrderResponse } from "@/interface/response.interface";

interface EntryOrderCardProps {
  order: EntryOrderResponse;
  onViewDetails: (order: EntryOrderResponse) => void;
  onApprove: (id: number) => void;
  onCancel: (id: number) => void;
  isProcessing: boolean;
}

export default function EntryOrderCard({
  order,
  onViewDetails,
  onApprove,
  onCancel,
  isProcessing,
}: EntryOrderCardProps) {
  const total =
    order.entryOrderDetails.reduce(
      (acc, item) => acc + item.quantity * item.unitPrice,
      0,
    ) *
    (1 + order.tax / 100);

  return (
    <Card className="bg-zinc-100 dark:bg-zinc-800">
      <CardHeader className="flex justify-between items-center pb-2">
        <div className="flex flex-col">
          <p className="text-md font-bold">Orden #{order.entryOrderId}</p>
          <p className="text-small text-default-500">
            {new Date(order.entryDate).toLocaleDateString()}
          </p>
        </div>
        <Chip color="warning" variant="flat" size="sm">
          Pendiente
        </Chip>
      </CardHeader>
      <Divider />
      <CardBody className="py-4 gap-3">
        <div className="flex items-center gap-2">
          <LuUser className="text-default-400" />
          <div className="flex flex-col">
            <p className="text-tiny text-default-500 uppercase font-bold">
              Proveedor
            </p>
            <p className="text-small font-semibold">
              {order.provider.companyName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LuStore className="text-default-400" />
          <div className="flex flex-col">
            <p className="text-tiny text-default-500 uppercase font-bold">
              Almacén
            </p>
            <p className="text-small font-semibold">{order.store.name}</p>
          </div>
        </div>
        <div className="mt-2 text-right">
          <p className="text-tiny text-default-500 uppercase font-bold">
            Total
          </p>
          <p className="text-xl font-bold text-primary">
            {total.toLocaleString("es-PE", {
              style: "currency",
              currency: "PEN",
            })}
          </p>
        </div>
      </CardBody>
      <Divider />
      <CardFooter className="flex justify-between gap-2">
        <Button
          size="sm"
          variant="flat"
          startContent={<LuEye />}
          onPress={() => onViewDetails(order)}
        >
          Ver
        </Button>
        <div className="flex gap-2">
          <Button
            size="sm"
            color="success"
            variant="flat"
            startContent={<LuCheck />}
            isLoading={isProcessing}
            onPress={() => onApprove(order.entryOrderId)}
          >
            Aprobar
          </Button>
          <Button
            size="sm"
            color="danger"
            variant="flat"
            startContent={<LuX />}
            isLoading={isProcessing}
            onPress={() => onCancel(order.entryOrderId)}
          >
            Cancelar
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
