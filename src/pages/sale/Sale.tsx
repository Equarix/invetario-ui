import {
  Button,
  Chip,
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
  MdSearch,
  MdVisibility,
  MdPrint,
  MdCalendarToday,
} from "react-icons/md";
import { useSales } from "./hooks/useSales";
import type { ResponseSale } from "@/interface/response.interface";
import SaleTicket from "./create/components/SaleTicket";
import Load from "@/components/components/load/Load";
import Table from "@/components/components/table/Table";
import KpiCard from "@/components/components/kpi-card/KpiCard";
import { statusColorMap } from "@/utils/utils";

export default function Sale() {
  const { sales, isLoading, config, pagination, store, kpi } = useSales();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedSale, setSelectedSale] = useState<ResponseSale | null>(null);

  const handleDetails = (sale: ResponseSale) => {
    setSelectedSale(sale);
    onOpen();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 flex flex-col gap-6 min-h-screen bg-zinc-50/50 dark:bg-zinc-950">
      <Load loading={isLoading} />

      <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-md border border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Gestión de Ventas
          </h1>
          <p className="text-zinc-500 text-sm font-medium mt-1">
            Monitorea y administra el historial completo de transacciones.
          </p>
        </div>
        <div className="flex gap-4 w-full max-w-xs">
          <Select
            label="Almacén"
            labelPlacement="outside"
            placeholder="Seleccione almacén"
            items={[
              { storeId: 0, name: "Todos los almacenes" },
              ...store.stores,
            ]}
            selectedKeys={
              store.selectedStore
                ? new Set([String(store.selectedStore)])
                : new Set()
            }
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0];
              if (selectedKey) {
                store.setSelectedStore(Number(selectedKey));
              }
            }}
          >
            {(item) => <SelectItem key={item.storeId}>{item.name}</SelectItem>}
          </Select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Ventas"
          value={kpi.data ? kpi.data.totalSales.toString() : "0"}
          icon={<MdSearch />}
          color="primary"
          description="Total de ventas históricas"
          isLoading={kpi.isLoading}
        />
        <KpiCard
          title="Ingresos Totales"
          value={kpi.data ? kpi.data.totalRevenue.toFixed(2) : "0.00"}
          icon={<MdVisibility />}
          color="success"
          description="Recaudación total acumulada"
          isLoading={kpi.isLoading}
        />
        <KpiCard
          title="Ticket Promedio"
          value={
            kpi.data ? `S/ ${kpi.data.averageTicket.toFixed(2)}` : "S/ 0.00"
          }
          icon={<MdPrint />}
          color="secondary"
          description="Valor promedio por venta"
          isLoading={kpi.isLoading}
        />
        <KpiCard
          title="Ventas Hoy"
          value={kpi.data ? kpi.data.cantSaleToday.toString() : "0"}
          icon={<MdCalendarToday />}
          color="warning"
          description="Ventas registradas el día de hoy"
          isLoading={kpi.isLoading}
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
                onChange={pagination.setCurrentPage}
              />
            </div>
          ) : null
        }
        data={sales}
        emptyContent="No se encontraron ventas"
        columns={[
          {
            header: "Id",
            cell: ({ row: { original: sale } }) => (
              <span className="font-bold">
                # {sale.saleId.toString().padStart(6, "0")}
              </span>
            ),
          },
          {
            header: "Cliente",
            cell: ({ row: { original: sale } }) => (
              <User
                description={sale.client.documentNumber}
                name={sale.client.name}
              >
                {sale.client.name}
              </User>
            ),
          },
          {
            header: "Total",
            cell: ({ row: { original: sale } }) => (
              <div className="flex flex-col">
                <p className="text-bold text-small capitalize">
                  {sale.typeMoney === "SOL" ? "S/ " : "$ "}{" "}
                  {sale.total.toFixed(2)}
                </p>
                <p className="text-bold text-tiny capitalize text-default-400">
                  {sale.typeDocument}
                </p>
              </div>
            ),
          },
          {
            header: "Fecha",
            cell: ({ row: { original: sale } }) => (
              <div className="flex flex-col">
                <p className="text-bold text-small capitalize">
                  {new Date(sale.createdAt).toLocaleDateString()}
                </p>
                <p className="text-bold text-tiny capitalize text-default-400">
                  {new Date(sale.createdAt).toLocaleTimeString()}
                </p>
              </div>
            ),
          },
          {
            header: "Estado",
            cell: ({ row: { original: sale } }) => (
              <Chip
                className="capitalize"
                color={statusColorMap[sale.status.toString()]}
                size="sm"
                variant="flat"
              >
                {sale.status ? "Completado" : "Anulado"}
              </Chip>
            ),
          },
          {
            header: "Acciones",
            cell: ({ row: { original: sale } }) => (
              <div className="relative flex items-center gap-2">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={() => handleDetails(sale)}
                >
                  <MdVisibility className="text-lg" />
                </Button>
              </div>
            ),
          },
        ]}
      />
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="5xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Detalle de Venta #{" "}
            {selectedSale?.saleId.toString().padStart(6, "0")}
          </ModalHeader>
          <ModalBody>
            {selectedSale && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-4">
                <div className="lg:col-span-2 flex flex-col gap-6">
                  {/* Info Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="shadow-none border border-zinc-100 dark:border-zinc-800">
                      <CardBody className="p-4">
                        <p className="text-tiny text-zinc-500 font-bold uppercase mb-2">
                          Cliente
                        </p>
                        <p className="font-bold text-lg">
                          {selectedSale.client.name}
                        </p>
                        <p className="text-zinc-500">
                          {selectedSale.client.typeDocument}:{" "}
                          {selectedSale.client.documentNumber}
                        </p>
                      </CardBody>
                    </Card>
                    <Card className="shadow-none border border-zinc-100 dark:border-zinc-800">
                      <CardBody className="p-4">
                        <p className="text-tiny text-zinc-500 font-bold uppercase mb-2">
                          Fecha y Hora
                        </p>
                        <div className="flex items-center gap-2">
                          <MdCalendarToday className="text-primary" />
                          <p className="font-bold">
                            {new Date(selectedSale.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <p className="text-zinc-500 mt-1 uppercase text-tiny">
                          Vendedor: {selectedSale.user.firstName}
                        </p>
                      </CardBody>
                    </Card>
                  </div>

                  {/* Items Table */}
                  <div>
                    <h4 className="font-bold mb-3 flex items-center gap-2">
                      <span className="w-2 h-6 bg-primary rounded-full"></span>
                      Productos Vendidos
                    </h4>
                    <Table
                      data={selectedSale.saleDetails}
                      columns={[
                        {
                          header: "Producto",
                          accessorKey: "product.name",
                        },
                        {
                          header: "Cant.",
                          accessorKey: "quantity",
                        },
                        {
                          header: "P. Unit.",
                          accessorKey: "priceSell",
                        },
                        {
                          header: "Subtotal",
                          accessorFn: (detail) =>
                            detail.quantity * detail.priceSell,
                        },
                      ]}
                    />
                  </div>

                  {/* Payments */}
                  <div>
                    <h4 className="font-bold mb-3 flex items-center gap-2">
                      <span className="w-2 h-6 bg-success rounded-full"></span>
                      Métodos de Pago
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSale.saleMethods.map((method) => (
                        <Chip
                          key={method.saleMethodId}
                          variant="dot"
                          color="success"
                          className="px-3 py-4"
                        >
                          {method.paymethod.name}: S/ {method.amount.toFixed(2)}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Ticket Preview Column */}
                <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                  <h4 className="font-bold mb-4 text-center">
                    Vista Previa del Ticket
                  </h4>
                  <div className="bg-white p-2 rounded-lg shadow-inner overflow-auto max-h-125 mb-4">
                    {config && (
                      <SaleTicket sale={selectedSale} config={config} />
                    )}
                  </div>
                  <Button
                    color="primary"
                    variant="shadow"
                    className="w-full h-12 font-bold"
                    startContent={<MdPrint className="text-xl" />}
                    onPress={handlePrint}
                  >
                    IMPRIMIR TICKET
                  </Button>
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
