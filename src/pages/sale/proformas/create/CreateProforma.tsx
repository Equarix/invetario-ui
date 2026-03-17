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
} from "@heroui/react";
import { useCreateProforma } from "./hooks/useCreateProforma";
import { useProforma } from "../hooks/useProforma"; // to get config
import {
  MdAdd,
  MdDelete,
  MdSave,
  MdRefresh,
  MdShoppingCart,
  MdPersonAdd,
} from "react-icons/md";
import { useState, useEffect } from "react";
import type { ResponseProductStore } from "@/interface/response.interface";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ClientSchema,
  ClientType,
  type ClientInput,
} from "@/schemas/client/client.schema";
import { parseErrors } from "@/utils/parseErrors";
import { useNavigate } from "react-router";
import ProformaPdfButtons from "../components/ProformaPdfButtons";

const MetricCard = ({ label, value, highlighted = false }: { label: string, value: string, highlighted?: boolean }) => (
  <Card className={`border-none shadow-sm ${highlighted ? 'bg-primary text-white' : 'bg-white dark:bg-zinc-900'}`}>
    <CardBody className="p-4 flex flex-col items-center justify-center">
      <p className={`text-tiny font-bold uppercase ${highlighted ? 'text-primary-100' : 'text-zinc-500'}`}>{label}</p>
      <p className="text-xl font-bold">S/ {value}</p>
    </CardBody>
  </Card>
);

export default function CreateProforma() {
  const {
    subtotal,
    igv,
    total,
    items,
    removeItem,
    addItem,
    products,
    setProductTerm,
    isSearchingProduct,
    clients,
    setClientTerm,
    isSearchingClient,
    selectedClient,
    setSelectedClient,
    createClient,
    isCreatingClient,
    registerProforma,
    isRegisteringProforma,
    createdProforma,
    resetProforma,
  } = useCreateProforma();

  const { config } = useProforma();

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

  const [selectedProd, setSelectedProd] = useState<ResponseProductStore | null>(null);
  const [quantity, setQuantity] = useState("1");

  const handleAddProduct = () => {
    if (selectedProd && quantity) {
      addItem(selectedProd, Number(quantity));
      setSelectedProd(null);
      setQuantity("1");
    }
  };

  useEffect(() => {
    if (createdProforma) {
      onOpenSuccess();
    }
  }, [createdProforma]);

  const handleRegisterProforma = () => {
    registerProforma();
  };

  const handleNewProforma = () => {
    resetProforma();
    onCloseSuccess();
  };

  const handleGoToList = () => {
    navigate("/venta/proforma");
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
      {/* Hero Header */}
      <div className="flex flex-col gap-1 mb-2">
        <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
          Nueva Proforma
        </h1>
        <p className="text-zinc-500 text-sm font-medium">
          Crea una cotización para tu cliente sin afectar inventario ni caja.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard label="GRAVADA" value={subtotal.toFixed(2)} />
        <MetricCard label="IGV" value={igv.toFixed(2)} />
        <MetricCard label="DESCUENTO" value="0.00" />
        <MetricCard label="TOTAL ESTIMADO" value={total.toFixed(2)} highlighted />
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

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <Input
                  label="Precio Referencial"
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
                  label="Stock Disp."
                  placeholder="0"
                  variant="flat"
                  size="sm"
                  value={selectedProd?.actualStock.toString() ?? "0"}
                  readOnly
                />
                <Button
                  color="primary"
                  className="w-full"
                  onPress={handleAddProduct}
                  isDisabled={!selectedProd}
                  startContent={<MdAdd className="text-xl" />}
                >
                  Agregar
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Table */}
          <Card className="bg-white dark:bg-zinc-900 border-none shadow-md overflow-hidden min-h-75">
            <CardHeader className="bg-zinc-50/50 dark:bg-zinc-800/50 border-b dark:border-zinc-800 py-4 px-6">
              <div className="flex flex-col">
                <h3 className="text-lg font-bold flex items-center gap-2 text-zinc-800 dark:text-zinc-100">
                  <span className="w-2 h-6 bg-secondary rounded-full"></span>
                  ITEMS DE COTIZACIÓN
                </h3>
                <p className="text-tiny text-zinc-500 font-bold uppercase tracking-wider">
                  Productos seleccionados
                </p>
              </div>
            </CardHeader>
            <Divider />
            <Table removeWrapper aria-label="Items de proforma">
              <TableHeader>
                <TableColumn>#</TableColumn>
                <TableColumn>CÓDIGO</TableColumn>
                <TableColumn>PRODUCTO</TableColumn>
                <TableColumn>CANTIDAD</TableColumn>
                <TableColumn>PRECIO UNIT.</TableColumn>
                <TableColumn>SUBTOTAL</TableColumn>
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
            </CardBody>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 flex flex-col gap-4">
          <Card className="bg-zinc-100 dark:bg-zinc-800 border-none shadow-sm">
            <CardBody className="p-6 items-center text-center gap-2">
              <MdShoppingCart className="text-4xl text-zinc-400" />
              <p className="text-tiny text-zinc-500 uppercase font-bold tracking-widest">
                Importe Total Estimado
              </p>
              <h2 className="text-4xl font-bold dark:text-white text-primary">
                S/ {total.toFixed(2)}
              </h2>
            </CardBody>
          </Card>

          <Card className="bg-white dark:bg-zinc-900 border-none shadow-sm">
            <CardBody className="gap-4">
              <Button
                color="primary"
                className="bg-blue-700 h-14 w-full font-bold text-lg"
                startContent={<MdSave className="text-xl" />}
                isDisabled={items.length === 0 || !selectedClient}
                isLoading={isRegisteringProforma}
                onPress={handleRegisterProforma}
              >
                REGISTRAR PROFORMA
              </Button>
              <Button
                color="danger"
                variant="flat"
                className="h-12 w-full font-bold"
                startContent={<MdRefresh />}
                onPress={resetProforma}
              >
                LIMPIAR
              </Button>
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

      {/* Success Modal */}
      <Modal
        isOpen={isSuccessOpen}
        onClose={onCloseSuccess}
        size="2xl"
        classNames={{
          base: "bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800",
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 items-center pb-0 border-b-none border-b-transparent">
            <div className="w-16 h-16 bg-success/20 text-success rounded-full flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <span className="text-zinc-900 dark:text-white font-bold text-2xl uppercase">
              Proforma Registrada
            </span>
            <span className="text-zinc-500 text-small">
              La proforma {createdProforma?.proformaId.toString().padStart(8, "0")} ha sido guardada exitosamente.
            </span>
          </ModalHeader>
          <ModalBody className="py-6 px-8 flex flex-col items-center">
            {createdProforma && config && (
              <div className="w-full">
                <ProformaPdfButtons proforma={createdProforma} config={config} />
              </div>
            )}
            <Divider className="my-6 w-full" />
            <div className="flex gap-4 w-full">
              <Button className="flex-1 font-bold" variant="bordered" onPress={handleGoToList}>
                VER LISTA
              </Button>
              <Button className="flex-1 font-bold" color="primary" onPress={handleNewProforma}>
                NUEVA PROFORMA
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
