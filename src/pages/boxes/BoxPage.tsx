import { useState } from "react";
import Load from "@/components/components/load/Load";
import Title from "@/components/components/title/Title";
import { Button, Pagination, useDisclosure } from "@heroui/react";
import { LuBox, LuPlus } from "react-icons/lu";
import BoxCard from "./components/BoxCard";
import CreateBoxModal from "./components/CreateBoxModal";
import UpdateBoxModal from "./components/UpdateBoxModal";
import DeleteBoxModal from "./components/DeleteBoxModal";
import { useBoxes } from "./hooks/useBoxes";
import type { ResponseBoxItem } from "@/interface/response.interface";

export default function BoxPage() {
  const { boxes, totalPages, page, setPage, isLoading } = useBoxes();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  
  const {
    isOpen: isUpdateOpen,
    onOpen: onOpenUpdate,
    onOpenChange: onUpdateOpenChange,
  } = useDisclosure();

  const {
    isOpen: isDeleteOpen,
    onOpen: onOpenDelete,
    onOpenChange: onDeleteOpenChange,
  } = useDisclosure();

  const [selectedBox, setSelectedBox] = useState<ResponseBoxItem | null>(null);

  const handleEdit = (box: ResponseBoxItem) => {
    setSelectedBox(box);
    onOpenUpdate();
  };

  const handleDelete = (box: ResponseBoxItem) => {
    setSelectedBox(box);
    onOpenDelete();
  };

  return (
    <div className="flex flex-col p-6 h-full w-full max-w-7xl mx-auto space-y-6">
      <Load loading={isLoading} />

      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Title className="flex items-center gap-2">
            <LuBox className="text-primary" /> Cajas Registradas
          </Title>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Gestión y administración de cajas por sucursal
          </p>
        </div>

        <Button
          color="primary"
          className="font-semibold shadow-md shadow-primary/20"
          onPress={onOpen}
        >
          <LuPlus size={18} />
          Agregar Caja
        </Button>
      </header>

      {boxes.length === 0 && !isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-center bg-white dark:bg-zinc-900">
          <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mb-3">
            <LuBox size={24} />
          </div>
          <h3 className="font-bold text-zinc-900 dark:text-white text-base">
            No hay cajas registradas
          </h3>
          <p className="text-xs text-zinc-500 mt-1">
            Aún no se han configurado cajas en el sistema.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {boxes.map((box) => (
            <BoxCard
              key={box.boxId}
              box={box}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination
            isCompact
            showControls
            color="primary"
            page={page}
            total={totalPages}
            onChange={(newPage) => setPage(newPage)}
          />
        </div>
      )}

      <CreateBoxModal isOpen={isOpen} onOpenChange={onOpenChange} />
      <UpdateBoxModal
        isOpen={isUpdateOpen}
        onOpenChange={onUpdateOpenChange}
        box={selectedBox}
      />
      <DeleteBoxModal
        isOpen={isDeleteOpen}
        onOpenChange={onDeleteOpenChange}
        box={selectedBox}
      />
    </div>
  );
}
