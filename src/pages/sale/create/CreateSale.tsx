import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Input,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Form,
  Tooltip,
} from "@heroui/react";
import {
  TypeDocumentSale,
  TypeMoney,
  useCreateSale,
} from "./hooks/useCreateSale";
import {
  MdAdd,
  MdDelete,
  MdSave,
  MdRefresh,
  MdShoppingCart,
  MdPersonAdd,
} from "react-icons/md";
import { useState, useMemo, useEffect } from "react";
import type { ResponseProductStore } from "@/interface/response.interface";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ClientSchema,
  ClientType,
  type ClientInput,
} from "@/schemas/client/client.schema";
import { parseErrors } from "@/utils/parseErrors";
import SaleTicket from "./components/SaleTicket";
import { useNavigate } from "react-router";
import Load from "@/components/components/load/Load";
import { ModalReport } from "./components/ModalReport";

export default function CreateSale() {
  const {
    load,
    subtotal,
    igv,
    total,
    items,
    removeItem,
    addItem,
    products,
    setProductTerm,
    isSearchingProduct,
    payMethods,
    payments,
    addPayment,
    removePayment,
    observation,
    setObservation,
    clients,
    setClientTerm,
    isSearchingClient,
    selectedClient,
    setSelectedClient,
    createClient,
    isCreatingClient,
    typeMoney,
    setTypeMoney,
    typeDocument,
    setTypeDocument,
    registerSale,
    isRegisteringSale,
    createdSale,
    config,
    resetSale,
  } = useCreateSale();

  const navigate = useNavigate();

  const {
    isOpen: isRegisterClientOpen,
    onOpen: onOpenRegisterClient,
    onClose: onCloseRegisterClient,
  } = useDisclosure();

  const {
    isOpen: isSuccessOpen,
    onOpen: onOpenSuccess,
    onClose: onCloseSuccess,
  } = useDisclosure();

  const {
    isOpen: isReportOpen,
    onOpen: onOpenReport,
    onClose: onCloseReport,
  } = useDisclosure();

  const [selectedProd, setSelectedProd] = useState<ResponseProductStore | null>(
    null,
  );
  const [quantity, setQuantity] = useState("1");
  const [currentPayMethod, setCurrentPayMethod] = useState("");
  const [currentPayAmount, setCurrentPayAmount] = useState("");

  const totalPayments = useMemo(
    () => payments.reduce((acc, p) => acc + p.amount, 0),
    [payments],
  );
  const remainingToPay = useMemo(
    () => Math.max(0, total - totalPayments),
    [total, totalPayments],
  );

  const handleAddProduct = () => {
    if (selectedProd && quantity) {
      addItem(selectedProd, Number(quantity));
      setSelectedProd(null);
      setQuantity("1");
    }
  };

  const openReportModal = () => {
    if (selectedProd) {
      onOpenReport();
    }
  };

  const handleAddPayment = () => {
    if (currentPayMethod && currentPayAmount) {
      const method = payMethods.find(
        (m) => String(m.paymethodId) === currentPayMethod,
      );

      if (method) {
        addPayment(
          method.paymethodId,
          method.name,
          Number(currentPayAmount),
          method.turned,
        );
        setCurrentPayMethod("");
        setCurrentPayAmount("");
      }
    }
  };

  useEffect(() => {
    if (createdSale) {
      onOpenSuccess();
    }
  }, [createdSale]);

  const handleRegisterSale = () => {
    registerSale();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleNewSale = () => {
    resetSale();
    onCloseSuccess();
  };

  const handleGoToList = () => {
    navigate("/venta");
  };

  // Client Form
  const {
    handleSubmit,
    formState: { errors: clientErrors },
    control: clientControl,
    reset: resetClientForm,
  } = useForm({
    resolver: zodResolver(ClientSchema),
    defaultValues: {
      clientType: ClientType.NATURAL,
      typeDocument: "DNI",
    },
  });

  const onRegisterClient = (data: ClientInput) => {
    createClient(data, {
      onSuccess: () => {
        onCloseRegisterClient();
        resetClientForm();
      },
    });
  };

  return (
    <div className="flex flex-col gap-4 p-4 min-h-screen bg-zinc-50/50 dark:bg-zinc-950">
      <Load loading={load} />

      {/* Hero Header with subtle gradient */}
      <div className="flex flex-col gap-1 mb-2">
        <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
          Nueva Venta
        </h1>
        <p className="text-zinc-500 text-sm font-medium">
          Completa los detalles de la transacción para emitir el comprobante.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard label="GRAVADA" value={subtotal.toFixed(2)} />
        <MetricCard label="IGV" value={igv.toFixed(2)} />
        <MetricCard label="DESCUENTO" value="0.00" />
        <MetricCard label="TOTAL" value={total.toFixed(2)} highlighted />
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Main Section */}
        <div className="flex-1 flex flex-col gap-4">
          <Card className="bg-white dark:bg-zinc-900 border-none shadow-sm">
            <CardBody className="gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Codigo de barra"
                  placeholder="Escanee código..."
                  variant="underlined"
                />

                <Autocomplete
                  label="Producto"
                  placeholder="Busque un producto..."
                  variant="underlined"
                  isLoading={isSearchingProduct}
                  items={products}
                  onInputChange={setProductTerm}
                  onSelectionChange={(key) => {
                    const prod = products.find(
                      (p) => p.productStoreId === Number(key),
                    );
                    if (prod) setSelectedProd(prod);
                  }}
                >
                  {(prod) => (
                    <AutocompleteItem
                      key={prod.productStoreId}
                      textValue={prod.product.name}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="font-bold">{prod.product.name}</span>
                          <span className="text-tiny text-zinc-500">
                            {prod.product.codeInternal}
                          </span>
                        </div>
                        <Chip size="sm" color="primary" variant="flat">
                          S/ {prod.product.priceSell.toFixed(2)}
                        </Chip>
                      </div>
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              </div>

              <Textarea
                label="Información"
                placeholder="Detalles del producto seleccionado"
                value={
                  selectedProd
                    ? `${selectedProd.product.description}\nStock actual: ${selectedProd.actualStock}`
                    : ""
                }
                readOnly
                variant="flat"
                size="sm"
                className="max-h-20"
              />

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end w-full">
                <Input
                  label="Precio"
                  placeholder="0.00"
                  variant="bordered"
                  size="sm"
                  value={selectedProd?.product.priceSell.toFixed(2) ?? ""}
                  isDisabled
                />
                <Input
                  label="Cantidad"
                  type="number"
                  variant="bordered"
                  size="sm"
                  value={quantity}
                  onValueChange={setQuantity}
                />
                <Input
                  label="Stock"
                  placeholder="0"
                  variant="flat"
                  size="sm"
                  value={selectedProd?.actualStock.toString() ?? "0"}
                  readOnly
                />
                <div className="flex items-center gap-2">
                  <Button
                    color="primary"
                    className="w-full col-span-2"
                    onPress={handleAddProduct}
                    isDisabled={!selectedProd}
                    startContent={<MdAdd className="text-xl" />}
                  >
                    Agregar
                  </Button>

                  <Tooltip
                    content="Reportar producto por stock"
                    color="primary"
                  >
                    <Button
                      variant="bordered"
                      startContent={<MdRefresh className="text-xl" />}
                      className="max-w-max px-0 min-w-15"
                      isDisabled={!selectedProd}
                      onPress={openReportModal}
                    />
                  </Tooltip>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Table */}
          <Card className="bg-white dark:bg-zinc-900 border-none shadow-md overflow-hidden min-h-75">
            <CardHeader className="bg-zinc-50/50 dark:bg-zinc-800/50 border-b dark:border-zinc-800 py-4 px-6">
              <div className="flex flex-col">
                <h3 className="text-lg font-bold flex items-center gap-2 text-zinc-800 dark:text-zinc-100">
                  <span className="w-2 h-6 bg-secondary rounded-full"></span>
                  ITEMS DE VENTA
                </h3>
                <p className="text-tiny text-zinc-500 font-bold uppercase tracking-wider">
                  Productos seleccionados
                </p>
              </div>
            </CardHeader>
            <Divider />
            <Table removeWrapper aria-label="Items de venta">
              <TableHeader>
                <TableColumn>#</TableColumn>
                <TableColumn>CODIGO</TableColumn>
                <TableColumn>PRODUCTO</TableColumn>
                <TableColumn>CANTIDAD</TableColumn>
                <TableColumn>PRECIO</TableColumn>
                <TableColumn>IMPORTE</TableColumn>
                <TableColumn>DCTO</TableColumn>
                <TableColumn>UNI MED</TableColumn>
                <TableColumn>ACCIONES</TableColumn>
              </TableHeader>
              <TableBody emptyContent="No hay productos agregados">
                {items.map((item, index) => (
                  <TableRow key={item.productStoreId}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.product.codeInternal}</TableCell>
                    <TableCell>{item.product.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.price.toFixed(2)}</TableCell>
                    <TableCell>{item.total.toFixed(2)}</TableCell>
                    <TableCell>{item.discount.toFixed(2)}</TableCell>
                    <TableCell>{item.product.unit.name}</TableCell>
                    <TableCell>
                      <Button
                        isIconOnly
                        color="danger"
                        variant="light"
                        onPress={() => removeItem(item.productStoreId)}
                      >
                        <MdDelete />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Client Section Below Table */}
          <Card className="bg-white dark:bg-zinc-900 border-none shadow-sm">
            <CardBody className="gap-4">
              <div className="flex gap-2 items-end">
                <Autocomplete
                  label="Buscar DNI/RUC/Cliente"
                  placeholder="Busque un cliente..."
                  className="flex-1"
                  variant="underlined"
                  isLoading={isSearchingClient}
                  items={clients}
                  onInputChange={setClientTerm}
                  selectedKey={selectedClient?.clientId.toString()}
                  onSelectionChange={(key) => {
                    const client = clients.find(
                      (c) => c.clientId === Number(key),
                    );
                    if (client) setSelectedClient(client);
                  }}
                >
                  {(client) => (
                    <AutocompleteItem
                      key={client.clientId}
                      textValue={`${client.documentNumber} - ${client.name}`}
                    >
                      <div className="flex flex-col">
                        <span className="font-bold">{client.name}</span>
                        <span className="text-tiny text-zinc-500">
                          {client.documentNumber} ({client.clientType})
                        </span>
                      </div>
                    </AutocompleteItem>
                  )}
                </Autocomplete>
                <Button
                  isIconOnly
                  color="primary"
                  variant="flat"
                  size="lg"
                  onPress={onOpenRegisterClient}
                  className="mb-1"
                >
                  <MdPersonAdd className="text-2xl" />
                </Button>
              </div>

              {selectedClient && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700">
                  <div className="flex flex-col">
                    <span className="text-tiny text-zinc-500 uppercase font-bold">
                      Documento
                    </span>
                    <span className="font-medium text-black dark:text-white">
                      {selectedClient.typeDocument}:{" "}
                      {selectedClient.documentNumber}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-tiny text-zinc-500 uppercase font-bold">
                      Tipo
                    </span>
                    <span className="font-medium text-black dark:text-white">
                      {selectedClient.clientType}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-tiny text-zinc-500 uppercase font-bold">
                      Contacto
                    </span>
                    <span className="font-medium text-black dark:text-white">
                      {selectedClient.phone || "N/A"}
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  label="Tipo Documento *"
                  variant="bordered"
                  size="sm"
                  selectedKeys={[String(typeDocument)]}
                  onSelectionChange={(keys) =>
                    setTypeDocument(
                      Number(Array.from(keys)[0]) as TypeDocumentSale,
                    )
                  }
                >
                  <SelectItem key={String(TypeDocumentSale.BOLETA)}>
                    BOLETA DE VENTA
                  </SelectItem>
                  <SelectItem key={String(TypeDocumentSale.FACTURA)}>
                    FACTURA
                  </SelectItem>
                </Select>
                <Select
                  label="Moneda *"
                  variant="bordered"
                  size="sm"
                  selectedKeys={[String(typeMoney)]}
                  onSelectionChange={(keys) =>
                    setTypeMoney(Number(Array.from(keys)[0]) as TypeMoney)
                  }
                >
                  <SelectItem key={String(TypeMoney.SOL)}>SOLES</SelectItem>
                  <SelectItem key={String(TypeMoney.DOLAR)}>DOLARES</SelectItem>
                </Select>
                <Input
                  label="Fecha"
                  variant="bordered"
                  size="sm"
                  type="date"
                  defaultValue={new Date().toISOString().split("T")[0]}
                  readOnly
                />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 flex flex-col gap-4">
          <Card className="bg-white dark:bg-zinc-900 border-none shadow-md overflow-hidden">
            <CardHeader className="bg-zinc-50/50 dark:bg-zinc-800/50 border-b dark:border-zinc-800 py-4 px-6">
              <div className="flex flex-col">
                <h4 className="font-bold text-primary flex items-center gap-2">
                  <MdAdd /> MÉTODOS DE PAGO
                </h4>
                <p className="text-tiny text-zinc-500 font-bold uppercase tracking-wider">
                  Gestión de cobro
                </p>
              </div>
            </CardHeader>
            <CardBody className="gap-3">
              <div className="flex gap-2">
                <Select
                  placeholder="Metodo"
                  size="sm"
                  variant="bordered"
                  selectedKeys={currentPayMethod ? [currentPayMethod] : []}
                  onSelectionChange={(keys) =>
                    setCurrentPayMethod(Array.from(keys)[0] as string)
                  }
                >
                  {payMethods.map((m) => (
                    <SelectItem
                      key={m.paymethodId?.toString()}
                      textValue={m.name}
                    >
                      {m.name}
                    </SelectItem>
                  ))}
                </Select>
                <Input
                  placeholder="Monto"
                  type="number"
                  size="sm"
                  variant="bordered"
                  value={currentPayAmount}
                  onValueChange={setCurrentPayAmount}
                />
                <Button
                  isIconOnly
                  size="sm"
                  color="primary"
                  onPress={handleAddPayment}
                >
                  <MdAdd />
                </Button>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                {payments.map((p, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-zinc-100 dark:bg-zinc-800 p-2 rounded-lg"
                  >
                    <span className="text-small font-medium">{p.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">
                        S/ {p.amount.toFixed(2)}
                      </span>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        onPress={() => removePayment(i)}
                      >
                        <MdDelete />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {total > 0 && (
                <div className="flex flex-col gap-2 border-t dark:border-zinc-700 pt-3 mt-1">
                  <div
                    className={`text-tiny font-bold flex justify-between p-2 rounded ${remainingToPay > 0 ? "text-warning" : "text-success bg-success/10"}`}
                  >
                    <span>{remainingToPay > 0 ? "PENDIENTE:" : "PAGADO:"}</span>
                    <span>S/ {remainingToPay.toFixed(2)}</span>
                  </div>

                  {totalPayments > total && payments.some((p) => p.turned) && (
                    <div className="flex flex-col gap-1 px-1 bg-success/5 p-2 rounded-lg border border-success/20">
                      <div className="flex justify-between text-tiny items-center">
                        <span className="text-zinc-500 font-bold uppercase text-[10px]">
                          Vuelto a entregar:
                        </span>
                        <span className="text-success font-bold text-xl">
                          S/ {(totalPayments - total).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardBody>
          </Card>

          <Card className="bg-white dark:bg-zinc-900 border-none shadow-sm">
            <CardHeader className="pb-0">
              <h4 className="font-bold text-large">CPE:</h4>
            </CardHeader>
            <CardBody className="gap-4">
              <p className="text-zinc-500 text-small">
                Fecha: {new Date().toLocaleDateString()}
              </p>
              <Textarea
                placeholder="Observación"
                variant="bordered"
                value={observation}
                onValueChange={setObservation}
              />
              <div className="grid grid-cols-2 gap-2">
                <Button
                  color="primary"
                  className="bg-blue-700 h-12"
                  startContent={<MdSave />}
                  isDisabled={
                    items.length === 0 ||
                    remainingToPay > 0.01 ||
                    !selectedClient
                  }
                  isLoading={isRegisteringSale}
                  onPress={handleRegisterSale}
                >
                  Registrar
                </Button>
                <Button
                  color="danger"
                  className="bg-red-600 h-12"
                  startContent={<MdRefresh />}
                  onPress={resetSale}
                >
                  NUEVO
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-zinc-100 dark:bg-zinc-800 border-none">
            <CardBody className="p-6 items-center text-center gap-2">
              <MdShoppingCart className="text-4xl text-zinc-400" />
              <p className="text-tiny text-zinc-500 uppercase font-bold tracking-widest">
                Resumen de Venta
              </p>
              <h2 className="text-4xl font-bold dark:text-white">
                S/ {total.toFixed(2)}
              </h2>
            </CardBody>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={isRegisterClientOpen}
        onClose={onCloseRegisterClient}
        size="2xl"
      >
        <Form
          validationErrors={parseErrors(clientErrors)}
          onSubmit={handleSubmit(onRegisterClient)}
        >
          <ModalContent>
            <ModalHeader>Registrar Nuevo Cliente</ModalHeader>
            <ModalBody className="gap-4">
              <div className="grid grid-cols-2 gap-4">
                <Controller
                  control={clientControl}
                  name="name"
                  render={({ field }) => (
                    <Input
                      label="Nombre / Razón Social"
                      placeholder="Nombre completo"
                      labelPlacement="outside"
                      {...field}
                    />
                  )}
                />
                <Controller
                  control={clientControl}
                  name="typeDocument"
                  render={({ field }) => (
                    <Input
                      label="Tipo Documento"
                      placeholder="DNI, RUC"
                      labelPlacement="outside"
                      {...field}
                    />
                  )}
                />
                <Controller
                  control={clientControl}
                  name="documentNumber"
                  render={({ field }) => (
                    <Input
                      label="Número Documento"
                      placeholder="Documento"
                      labelPlacement="outside"
                      {...field}
                    />
                  )}
                />
                <Controller
                  control={clientControl}
                  name="phone"
                  render={({ field }) => (
                    <Input
                      label="Teléfono"
                      placeholder="Teléfono"
                      labelPlacement="outside"
                      {...field}
                    />
                  )}
                />
                <Controller
                  control={clientControl}
                  name="email"
                  render={({ field }) => (
                    <Input
                      label="Correo"
                      placeholder="email@ejemplo.com"
                      labelPlacement="outside"
                      {...field}
                    />
                  )}
                />
                <Controller
                  control={clientControl}
                  name="clientType"
                  render={({ field: { value, onChange } }) => (
                    <Select
                      label="Tipo Cliente"
                      labelPlacement="outside"
                      selectedKeys={[String(value)]}
                      onSelectionChange={(keys) =>
                        onChange(Number(Array.from(keys)[0]))
                      }
                    >
                      <SelectItem key={String(ClientType.NATURAL)}>
                        Natural
                      </SelectItem>
                      <SelectItem key={String(ClientType.COMPANY)}>
                        Empresa
                      </SelectItem>
                    </Select>
                  )}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={onCloseRegisterClient}
              >
                Cancelar
              </Button>
              <Button
                color="primary"
                type="submit"
                isLoading={isCreatingClient}
              >
                Guardar y Seleccionar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Form>
      </Modal>

      <ModalReport
        isOpen={isReportOpen}
        onClose={onCloseReport}
        producto={selectedProd?.product}
      />

      {/* Success & PDF Modal */}
      <Modal
        isOpen={isSuccessOpen}
        onClose={onCloseSuccess} // Force using buttons
        size="3xl"
        scrollBehavior="inside"
        classNames={{
          base: "bg-zinc-100 dark:bg-zinc-900",
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <span className="text-success font-bold text-xl uppercase">
              ¡VENTA REGISTRADA CON ÉXITO!
            </span>
            <span className="text-zinc-500 text-small">
              La boleta ha sido generada correctamente.
            </span>
          </ModalHeader>
          <ModalBody className="py-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1 bg-white p-2 rounded-lg shadow-inner overflow-auto max-h-125">
                {createdSale && config && (
                  <SaleTicket sale={createdSale} config={config} />
                )}
              </div>
              <div className="w-full md:w-48 flex flex-col gap-3">
                <Button
                  color="primary"
                  variant="shadow"
                  size="lg"
                  className="font-bold"
                  startContent={<MdRefresh />}
                  onPress={handlePrint}
                >
                  Imprimir PDF
                </Button>
                <Divider />
                <p className="text-tiny text-zinc-500 uppercase font-bold">
                  Siguientes pasos
                </p>
                <Button variant="flat" color="primary" onPress={handleNewSale}>
                  Hacer otra venta
                </Button>
                <Button variant="light" onPress={handleGoToList}>
                  Ver listado
                </Button>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}

function MetricCard({
  label,
  value,
  highlighted = false,
}: {
  label: string;
  value: string;
  highlighted?: boolean;
}) {
  return (
    <Card
      className={`border-none shadow-sm ${highlighted ? "bg-blue-600 dark:bg-blue-600 shadow-blue-200 dark:shadow-none" : "bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700"}`}
    >
      <CardBody className="p-4 items-center text-center">
        <p
          className={`text-[10px] font-extrabold uppercase tracking-widest ${highlighted ? "text-blue-100" : "text-zinc-500 dark:text-zinc-400"}`}
        >
          {label}
        </p>
        <p
          className={`text-2xl font-black tabular-nums tracking-tight ${highlighted ? "text-white" : "text-zinc-900 dark:text-white"}`}
        >
          {value}
        </p>
      </CardBody>
    </Card>
  );
}
