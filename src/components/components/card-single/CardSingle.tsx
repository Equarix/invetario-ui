import { Card, CardBody, CardHeader, Chip, Image } from "@heroui/react";

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
        <Image
          src="/src/assets/images/frutas.jpg"
          alt="Card Image"
          className="rounded-lg"
        />
      </CardHeader>
      <CardBody className="flex flex-row px-4 py-3 items-start justify-between">
        <div>
          <h4 className="font-bold text-large text-white">{title}</h4>
          <small className="text-white">{subtitle}</small>
        </div>
        <Chip
          color={status ? "success" : "danger"}
          className=" self-end text-tiny uppercase font-bold"
        >
          {status ? "Activo" : "Inactivo"}
        </Chip>
      </CardBody>
    </Card>
  );
}
