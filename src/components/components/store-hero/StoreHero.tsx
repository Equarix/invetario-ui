import { Card, CardBody, CardHeader, Chip, Divider } from "@heroui/react";
import {
  LuBox,
  LuHash,
  LuMapPin,
  LuPhone,
  LuStore,
  LuUsers,
} from "react-icons/lu";
import type { ResponseStore } from "@/interface/response.interface";

interface StoreHeroProps {
  store?: ResponseStore;
}

export default function StoreHero({ store }: StoreHeroProps) {
  return (
    <Card className="w-full bg-linear-to-r from-background to-content2 border-none flex min-h-64 h-full">
      <CardHeader className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-xl text-primary">
            <LuStore size={32} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
                {store?.name}
              </h1>
              <Chip
                color={store?.status ? "success" : "warning"}
                variant="flat"
                size="sm"
                className="ml-2"
              >
                {store?.status ? "Activo" : "Inactivo"}
              </Chip>
            </div>
            <p className="text-default-500 text-sm flex items-center gap-1 mt-1">
              <LuHash size={14} />
              {store?.code}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          {/* Placeholder for actions if needed later */}
        </div>
      </CardHeader>

      <Divider className="bg-default-100" />

      <CardBody className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="mt-1 text-primary">
              <LuMapPin size={20} />
            </div>
            <div>
              <p className="text-xs text-default-500 font-medium uppercase tracking-wider">
                Dirección
              </p>
              <p className="text-sm font-medium">{store?.address}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1 text-primary">
              <LuPhone size={20} />
            </div>
            <div>
              <p className="text-xs text-default-500 font-medium uppercase tracking-wider">
                Teléfono
              </p>
              <p className="text-sm font-medium">{store?.phone}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1 text-primary">
              <LuUsers size={20} />
            </div>
            <div>
              <p className="text-xs text-default-500 font-medium uppercase tracking-wider">
                Capacidad
              </p>
              <p className="text-sm font-medium">
                {store?.maxCapacity} personas
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1 text-primary">
              <LuBox size={20} />
            </div>
            <div>
              <p className="text-xs text-default-500 font-medium uppercase tracking-wider">
                Tipo
              </p>
              <p className="text-sm font-medium capitalize">{store?.type}</p>
            </div>
          </div>
        </div>

        {store?.observations && (
          <div className="mt-6 p-3 bg-default-50 rounded-lg border border-default-100">
            <p className="text-xs text-default-500 font-medium uppercase mb-1">
              Observaciones
            </p>
            <p className="text-sm text-default-600 italic">
              "{store.observations}"
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
