import {
  Button,
  User,
  Pagination,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Card,
  CardBody,
  Select,
  SelectItem,
} from "@heroui/react";
import { useState } from "react";
import {
  MdVisibility,
  MdCalendarToday,
  MdOutlineReceiptLong,
  MdOutlineAttachMoney,
  MdOutlineTrendingUp,
  MdOutlineGroup,
} from "react-icons/md";
import type { ColumnDef } from "@tanstack/react-table";
import type { ResponseProforma } from "@/interface/response.interface";
import Load from "@/components/components/load/Load";
import Table from "@/components/components/table/Table";
import KpiCard from "@/components/components/kpi-card/KpiCard";
import Header from "@/components/layouts/header/Header";
import { useProforma } from "./hooks/useProforma";
import ProformaPdfButtons from "./components/ProformaPdfButtons";

export default function Proforma() {
  const { proformas, isLoading, pagination, stores, filters, config } = useProforma();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProforma, setSelectedProforma] = useState<ResponseProforma | null>(null);

  const handleDetails = (proforma: ResponseProforma) => {
    setSelectedProforma(proforma);
    onOpen();
  };

  // Calculate total for a proforma
  const calculateTotal = (details: ResponseProforma["details"]) => {
    return details.reduce((acc, detail) => acc + (detail.price * detail.quantity), 0);
  };

  const columns: ColumnDef<ResponseProforma>[] = [
    {
      header: "Id",
      cell: ({ row: { original: proforma } }) => (
        <span className="font-bold">
          # {proforma.proformaId.toString().padStart(6, "0")}
        </span>
      ),
    },
    {
      header: "Cliente",
      cell: ({ row: { original: proforma } }) => (
        <User
          description={proforma.client.documentNumber}
          name={proforma.client.name}
        >
          {proforma.client.name}
        </User>
      ),
    },
    {
      header: "Almacén",
      cell: ({ row: { original: proforma } }) => (
        <span className="text-sm">{proforma.store.name}</span>
      ),
    },
    {
      header: "Fecha",
      cell: ({ row: { original: proforma } }) => (
        <div className="flex flex-col">
          <p className="text-bold text-small capitalize">
            {new Date(proforma.createdAt).toLocaleDateString()}
          </p>
          <p className="text-bold text-tiny capitalize text-default-400">
            {new Date(proforma.createdAt).toLocaleTimeString()}
          </p>
        </div>
      ),
    },
    {
      header: "Total",
      cell: ({ row: { original: proforma } }) => (
        <span className="font-bold">
          S/ {calculateTotal(proforma.details).toFixed(2)}
        </span>
      ),
    },
    {
      header: "Acciones",
      cell: ({ row: { original: proforma } }) => (
        <div className="relative flex items-center gap-2">
          <Button
            isIconOnly
            size="sm"
            variant="light"
            color="primary"
            onPress={() => handleDetails(proforma)}
          >
            <MdVisibility className="text-lg" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 flex flex-col gap-6 min-h-screen bg-zinc-50/50 dark:bg-zinc-950">
      <Load loading={isLoading} />

      <Header
        icon={<MdOutlineReceiptLong />}
        text={{
          header: "Gestión de Proformas",
        }}
        disabledButton
      />

      <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-md border border-zinc-200 dark:border-zinc-800">
        <div>
          <h2 className="text-xl font-bold dark:text-white">Filtros</h2>
          <p className="text-zinc-500 text-sm mt-1">
            Filtra las proformas por almacén
          </p>
        </div>
        <div className="flex gap-4 w-full max-w-xs">
          <Select
            label="Almacén"
            labelPlacement="outside"
            placeholder="Seleccione almacén"
            items={stores}
            selectedKeys={
              filters.storeId
                ? new Set([String(filters.storeId)])
                : new Set()
            }
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0];
              if (selectedKey) {
                filters.setStoreId(Number(selectedKey));
                filters.setPage(1); // Reset page on filter change
              }
            }}
          >
            {(item) => <SelectItem key={item.storeId}>{item.name}</SelectItem>}
          </Select>
        </div>
      </div>

      {/* KPI Cards (Mocks) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Proformas"
          value="156"
          icon={<MdOutlineReceiptLong />}
          color="primary"
          description="Proformas emitidas este mes"
          trend="+12%"
          trendColor="success"
        />
        <KpiCard
          title="Valor Estimado"
          value="S/ 45,230.00"
          icon={<MdOutlineAttachMoney />}
          color="success"
          description="Suma total de proformas activas"
          trend="+5%"
          trendColor="success"
        />
        <KpiCard
          title="Tasa de Conversión"
          value="34%"
          icon={<MdOutlineTrendingUp />}
          color="secondary"
          description="Proformas convertidas a ventas"
          trend="-2%"
          trendColor="danger"
        />
        <KpiCard
          title="Clientes Interesados"
          value="89"
          icon={<MdOutlineGroup />}
          color="warning"
          description="Clientes con proformas recientes"
          trend="+8"
          trendColor="success"
        />
      </div>

      <Table
        bottomContent={
          pagination.totalPages > 1 ? (
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={pagination.currentPage}
                total={pagination.totalPages}
                onChange={filters.setPage}
              />
            </div>
          ) : null
        }
        data={proformas}
        emptyContent="No se encontraron proformas"
        columns={columns}
      />

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="4xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Detalle de Proforma # {selectedProforma?.proformaId.toString().padStart(6, "0")}
          </ModalHeader>
          <ModalBody>
            {selectedProforma && (
              <div className="flex flex-col gap-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="shadow-none border border-zinc-100 dark:border-zinc-800">
                    <CardBody className="p-4">
                      <p className="text-tiny text-zinc-500 font-bold uppercase mb-2">
                        Información del Cliente
                      </p>
                      <p className="font-bold text-lg">
                        {selectedProforma.client.name}
                      </p>
                      <p className="text-zinc-500 text-sm">
                        {selectedProforma.client.typeDocument}: {selectedProforma.client.documentNumber}
                      </p>
                      <p className="text-zinc-500 text-sm">
                        Correo: {selectedProforma.client.email}
                      </p>
                      <p className="text-zinc-500 text-sm">
                        Teléfono: {selectedProforma.client.phone}
                      </p>
                    </CardBody>
                  </Card>

                  <Card className="shadow-none border border-zinc-100 dark:border-zinc-800">
                    <CardBody className="p-4">
                      <p className="text-tiny text-zinc-500 font-bold uppercase mb-2">
                        Detalles de Emisión
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        <MdCalendarToday className="text-primary" />
                        <p className="font-bold">
                          {new Date(selectedProforma.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-zinc-500 text-sm mb-1">
                        Almacén: <span className="font-medium text-foreground">{selectedProforma.store.name}</span>
                      </p>
                      <p className="text-zinc-500 text-sm">
                        Agente: <span className="font-medium text-foreground">{selectedProforma.user.firstName} {selectedProforma.user.lastName}</span>
                      </p>
                    </CardBody>
                  </Card>
                </div>

                <div>
                  <h4 className="font-bold mb-3 flex items-center gap-2">
                    <span className="w-2 h-6 bg-primary rounded-full"></span>
                    Productos Cotizados
                  </h4>
                  <Table
                    data={selectedProforma.details}
                    columns={[
                      {
                        header: "Producto",
                        accessorKey: "productName",
                      },
                      {
                        header: "Código",
                        accessorKey: "product.code",
                      },
                      {
                        header: "Cant.",
                        accessorKey: "quantity",
                      },
                      {
                        header: "P. Unit.",
                        accessorKey: "price",
                      },
                      {
                        header: "Subtotal",
                        accessorFn: (detail) =>
                          (detail.quantity * detail.price).toFixed(2),
                      },
                    ]}
                  />
                  <div className="flex justify-end mt-4">
                    <div className="bg-zinc-100 dark:bg-zinc-800 px-6 py-3 rounded-xl w-full md:w-auto text-right">
                      <p className="text-zinc-500 text-sm font-medium">Total Estimado</p>
                      <p className="text-2xl font-black text-primary">
                        S/ {calculateTotal(selectedProforma.details).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  
                  {config && (
                    <ProformaPdfButtons proforma={selectedProforma} config={config} />
                  )}
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
