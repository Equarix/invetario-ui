import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Button,
} from "@heroui/react";
import { LuBox, LuStore, LuTicket } from "react-icons/lu";
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import type { ResponseBoxItem } from "@/interface/response.interface";

interface BoxCardProps {
  box: ResponseBoxItem;
  onEdit?: (box: ResponseBoxItem) => void;
  onDelete?: (box: ResponseBoxItem) => void;
}

export default function BoxCard({ box, onEdit, onDelete }: BoxCardProps) {
  return (
    <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-all duration-200">
      <CardHeader className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800/60">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <LuBox size={20} />
          </div>
          <div className="flex flex-col truncate">
            <h3 className="font-bold text-base text-zinc-900 dark:text-white truncate">
              {box.boxName}
            </h3>
            {box.store && (
              <span className="text-xs text-zinc-500 flex items-center gap-1 truncate">
                <LuStore size={12} className="shrink-0" />
                {box.store.name}
              </span>
            )}
          </div>
        </div>
        <Chip
          color={box.status ? "success" : "danger"}
          variant="flat"
          size="sm"
          className="font-bold uppercase text-[10px] shrink-0"
        >
          {box.status ? "Activo" : "Inactivo"}
        </Chip>
      </CardHeader>

      <CardBody className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
            <span className="text-zinc-400 font-medium block text-[10px] uppercase tracking-wider mb-0.5">
              Serie Venta
            </span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1">
              <LuTicket size={14} className="text-primary shrink-0" />
              {box.serie || "-"}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
            <span className="text-zinc-400 font-medium block text-[10px] uppercase tracking-wider mb-0.5">
              Serie Proforma
            </span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1">
              <LuTicket size={14} className="text-primary shrink-0" />
              {box.serieProforma || "-"}
            </span>
          </div>
        </div>

        {(onEdit || onDelete) && (
          <div className="flex gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/60 justify-end">
            {onEdit && (
              <Button
                size="sm"
                color="primary"
                variant="flat"
                startContent={<MdEdit size={14} />}
                onPress={() => onEdit(box)}
              >
                Editar
              </Button>
            )}
            {onDelete && (
              <Button
                size="sm"
                color="danger"
                variant="light"
                startContent={<FaTrash size={12} />}
                onPress={() => onDelete(box)}
              >
                Eliminar
              </Button>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
