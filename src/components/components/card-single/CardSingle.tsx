import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  CardFooter,
} from "@heroui/react";
import { MdInventory } from "react-icons/md";
import { Button } from "@heroui/react";
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";

interface CardSingleProps {
  title: string;
  subtitle: string;
  status: boolean;
}

export default function CardSingle({
  title,
  subtitle,
  status,
}: CardSingleProps) {
  return (
    <Card className="max-w-100 bg-zinc-800">
      <CardHeader className="overflow-visible pt-3 pb-0">
        <MdInventory className="text-white" />
        <h4 className="font-bold text-large text-white px-3">{title}</h4>
      </CardHeader>
      <Divider className="bg-gray-800" />
      <CardBody className="flex flex-row px-4 py-3 items-start justify-between">
        <div>
          <small className="text-white">{subtitle}</small>
        </div>
        <Chip
          color={status ? "success" : "danger"}
          className=" self-end text-tiny uppercase font-bold"
        >
          {status ? "Activo" : "Inactivo"}
        </Chip>
      </CardBody>
      <Divider className="bg-gray-800" />
      <CardFooter>
        <div className="flex gap-4 items-center">
          <Button color="success" endContent={<MdEdit />}>
            Editar
          </Button>
          <Button color="danger" startContent={<FaTrash />} variant="bordered">
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
