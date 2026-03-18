import Title from "@/components/components/title/Title";
import { Button, useDisclosure } from "@heroui/react";
import { LuPlus } from "react-icons/lu";
import { usePayMethod } from "./hook/usePayMethod";
import CardSingle from "@/components/components/card-single/CardSingle";
import { useState } from "react";
import CreatePayMethod from "./create/CreatePayMethod";
import Load from "@/components/components/load/Load";
import type { ResponsePayMethod } from "@/interface/response.interface";
import UpdatePayMethod from "./update/CreatePayMethod";
import DeletePayMethodModal from "./delete/DeleteCategoryModal";

export default function PayMethodPage() {
  const { payMethods, isLoadingPayMethod, refetchPayMethods } = usePayMethod();
  const [selectedPayMethodId, setSelectedPayMethodId] =
    useState<ResponsePayMethod | null>(null);
  const {
    onOpen: onOpenEdit,
    isOpen: isOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();

  const {
    onOpen: onOpenDelete,
    isOpen: isOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();

  const {
    onOpen: onOpenCreate,
    isOpen: isOpenCreate,
    onClose: onCloseCreate,
  } = useDisclosure();

  const handleEdit = (paymethod: ResponsePayMethod) => {
    setSelectedPayMethodId(paymethod);
    onOpenEdit();
  };

  const handleDelete = (paymethod: ResponsePayMethod) => {
    setSelectedPayMethodId(paymethod);
    onOpenDelete();
  };

  const onSubmitUD = () => {
    setSelectedPayMethodId(null);
    refetchPayMethods();
  };

  return (
    <div className="flex flex-col p-4 h-full w-full">
      <Load loading={isLoadingPayMethod} />
      <header className="flex items-center justify-between">
        <Title>Metodos de pago</Title>

        <Button
          color="primary"
          className="font-semibold"
          onPress={onOpenCreate}
        >
          <LuPlus size={16} />
          Agregar Metodo de Pago
        </Button>
      </header>

      <section className="w-full grid grid-cols-4 gap-2 mt-4">
        {payMethods.map((u) => (
          <CardSingle
            key={u.paymethodId}
            title={u.name}
            subtitle={"Recibe vuelto: " + (u.turned ? "Si" : "No")}
            status={u.status}
            onEdit={() => handleEdit(u)}
            onDelete={() => handleDelete(u)}
          />
        ))}
      </section>

      <CreatePayMethod
        isOpen={isOpenCreate}
        onClose={onCloseCreate}
        onConfirm={refetchPayMethods}
      />

      {selectedPayMethodId && (
        <UpdatePayMethod
          isOpen={isOpenEdit}
          onClose={onCloseEdit}
          onConfirm={onSubmitUD}
          paymethod={selectedPayMethodId}
        />
      )}

      {selectedPayMethodId && (
        <DeletePayMethodModal
          isOpen={isOpenDelete}
          onClose={onCloseDelete}
          onConfirm={onSubmitUD}
          paymethodId={selectedPayMethodId.paymethodId}
        />
      )}
    </div>
  );
}
