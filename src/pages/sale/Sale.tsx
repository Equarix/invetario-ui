import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
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
} from "@heroui/react";
import { useState, useMemo } from "react";
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

const statusColorMap: Record<string, "success" | "danger" | "warning"> = {
  true: "success",
  false: "danger",
};

export default function Sale() {
  const { sales, isLoading, config } = useSales();
  const [filterValue, setFilterValue] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedSale, setSelectedSale] = useState<ResponseSale | null>(null);

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const filteredItems = useMemo(() => {
    let filteredSales = [...sales];

    if (filterValue) {
      filteredSales = filteredSales.filter(
        (sale) =>
          sale.client.name.toLowerCase().includes(filterValue.toLowerCase()) ||
          sale.saleId.toString().includes(filterValue),
      );
    }

    return filteredSales;
  }, [sales, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems]);

  const handleDetails = (sale: ResponseSale) => {
    setSelectedSale(sale);
    onOpen();
  };

  const handlePrint = () => {
    window.print();
  };

  const renderCell = (sale: ResponseSale, columnKey: React.Key) => {
    switch (columnKey) {
      case "id":
        return (
          <span className="font-bold">
            # {sale.saleId.toString().padStart(6, "0")}
          </span>
        );
      case "client":
        return (
          <User
            description={sale.client.documentNumber}
            name={sale.client.name}
          >
            {sale.client.name}
          </User>
        );
      case "total":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">
              {sale.typeMoney === "SOL" ? "S/ " : "$ "} {sale.total.toFixed(2)}
            </p>
            <p className="text-bold text-tiny capitalize text-default-400">
              {sale.typeDocument}
            </p>
          </div>
        );
      case "date":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">
              {new Date(sale.createdAt).toLocaleDateString()}
            </p>
            <p className="text-bold text-tiny capitalize text-default-400">
              {new Date(sale.createdAt).toLocaleTimeString()}
            </p>
          </div>
        );
      case "status":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[sale.status.toString()]}
            size="sm"
            variant="flat"
          >
            {sale.status ? "Completado" : "Anulado"}
          </Chip>
        );
      case "actions":
        return (
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
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 flex flex-col gap-6 min-h-screen bg-zinc-50/50 dark:bg-zinc-950">
      <Load loading={isLoading} />

      <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-md border border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Gestión de Ventas
          </h1>
          <p className="text-zinc-500 text-sm font-medium mt-1">
            Monitorea y administra el historial completo de transacciones.
          </p>
        </div>
        <div className="flex gap-4">
          <Input
            isClearable
            className="w-full sm:max-w-[350px]"
            placeholder="Buscar por cliente o ID..."
            startContent={<MdSearch className="text-zinc-400 text-xl" />}
            value={filterValue}
            onClear={() => setFilterValue("")}
            onValueChange={setFilterValue}
            variant="bordered"
          />
        </div>
      </div>

      <Table
        aria-label="Tabla de ventas"
        className="bg-white dark:bg-zinc-900 rounded-2xl shadow-md border border-zinc-200 dark:border-zinc-800"
        bottomContent={
          pages > 1 ? (
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={pages}
                onChange={setPage}
              />
            </div>
          ) : null
        }
      >
        <TableHeader>
          <TableColumn key="id">ID VENTA</TableColumn>
          <TableColumn key="client">CLIENTE</TableColumn>
          <TableColumn key="total">TOTAL / DOC</TableColumn>
          <TableColumn key="date">FECHA</TableColumn>
          <TableColumn key="status">ESTADO</TableColumn>
          <TableColumn key="actions">ACCIONES</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"No se encontraron ventas"} items={items}>
          {(item) => (
            <TableRow key={item.saleId}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

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
                      aria-label="Items de venta"
                      shadow="none"
                      className="border border-zinc-100 dark:border-zinc-800 rounded-xl"
                    >
                      <TableHeader>
                        <TableColumn>PRODUCTO</TableColumn>
                        <TableColumn>CANT.</TableColumn>
                        <TableColumn>P. UNIT.</TableColumn>
                        <TableColumn>SUBTOTAL</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {selectedSale.saleDetails.map((detail) => (
                          <TableRow key={detail.saleDetailId}>
                            <TableCell>{detail.product.name}</TableCell>
                            <TableCell>{detail.quantity}</TableCell>
                            <TableCell>
                              S/ {detail.priceSell.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              S/{" "}
                              {(detail.quantity * detail.priceSell).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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
                  <div className="bg-white p-2 rounded-lg shadow-inner overflow-auto max-h-[500px] mb-4">
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
