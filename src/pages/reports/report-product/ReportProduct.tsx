import Header from "@/components/layouts/header/Header";
import { MdOutlineReceiptLong, MdRemoveRedEye } from "react-icons/md";
import { useReportProduct, type ResponseReportProduct } from "./hooks/useReportProduct";
import Load from "@/components/components/load/Load";
import InputDate from "@/components/components/input-date/InputDate";
import Table from "@/components/components/table/Table";
import { useState } from "react";
import { Button, Tooltip } from "@heroui/react";
import UserModal from "./user/UserModal";

export default function ReportProduct() {
  const { report, dates, setDates } = useReportProduct();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<ResponseReportProduct["users"] | undefined>(undefined);

  const handleOpenUserModal = (users: ResponseReportProduct["users"]) => {
    setSelectedUsers(users);
    setIsOpenModal(true);
  };

  const handleCloseUserModal = () => {
    setIsOpenModal(false);
    setTimeout(() => setSelectedUsers(undefined), 300);
  };

  return (
    <div className="p-6 flex flex-col gap-6 min-h-screen bg-zinc-50/50 dark:bg-zinc-950">
      <Load loading={report.isLoading} />

      <Header
        icon={<MdOutlineReceiptLong />}
        text={{
          header: "Ver Productos Faltantes",
        }}
        disabledButton
      />

      <nav className="flex justify-between items-center bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-md border border-zinc-200 dark:border-zinc-800">
        <article>
          <h2 className="text-xl font-bold dark:text-white">Filtros</h2>
          <p className="text-zinc-500 text-sm mt-1">
            Filtra por rango de fechas
          </p>
        </article>
        <div className="flex gap-4 w-full max-w-xs">
          <InputDate
            label="Fecha Inicio"
            value={dates.startDate}
            onChange={(date) =>
              setDates((prev) => ({ ...prev, startDate: date }))
            }
          />

          <InputDate
            label="Fecha Fin"
            value={dates.endDate}
            onChange={(date) =>
              setDates((prev) => ({ ...prev, endDate: date }))
            }
          />
        </div>
      </nav>

      <Table
        data={report.data}
        emptyContent="No hay productos faltantes en este rango de fechas"
        columns={[
          {
            header: "Producto",
            accessorKey: "product.name",
          },
          {
            header: "Cantidad Faltante",
            accessorKey: "totalQuantity",
          },
          {
            header: "Veces Reportado",
            accessorKey: "count",
          },
          {
            header: "Tienda",
            accessorKey: "store.name",
          },
          {
            header: "Acciones",
            id: "actions",
            cell: ({ row }) => (
              <div className="flex gap-2">
                <Tooltip content="Ver Usuarios">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="primary"
                    onPress={() => handleOpenUserModal(row.original.users)}
                  >
                    <MdRemoveRedEye className="text-lg" />
                  </Button>
                </Tooltip>
              </div>
            ),
          },
        ]}
      />

      <UserModal
        isOpen={isOpenModal}
        onClose={handleCloseUserModal}
        user={selectedUsers}
      />
    </div>
  );
}
