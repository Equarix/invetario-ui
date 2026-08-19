import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Image,
  Tabs,
  Tab,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { useEffect, useState } from "react";
import {
  MdBusiness,
  MdPhone,
  MdLocationOn,
  MdAttachMoney,
  MdCloudUpload,
  MdHistory,
  MdCheckCircle,
  MdInfo,
} from "react-icons/md";
import { useConfig } from "./hooks/useConfig";
import Load from "@/components/components/load/Load";
import SaleTicket from "../sale/create/components/SaleTicket";
import type { ResponseSale } from "@/interface/response.interface";
import { LuContact } from "react-icons/lu";

export default function Config() {
  const { lastConfig, allConfigs, isLoading, createConfig, isSaving } =
    useConfig();
  const [formData, setFormData] = useState({
    ruc: "",
    phone: "",
    address: "",
    logoUrl: "",
    contactEmail: "",
    localCurrency: "",
    enterpriseName: "",
  });

  useEffect(() => {
    if (lastConfig) {
      setFormData({
        ruc: lastConfig.ruc,
        phone: lastConfig.phone,
        address: lastConfig.address,
        logoUrl: lastConfig.logoUrl,
        contactEmail: lastConfig.contactEmail,
        localCurrency: lastConfig.localCurrency,
        enterpriseName: lastConfig.enterpriseName,
      });
    }
  }, [lastConfig]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createConfig(formData);
  };

  // Mock sale for ticket preview
  const mockSale: ResponseSale = {
    saleId: 0,
    total: 150.5,
    createdAt: new Date().toISOString(),
    status: true,
    typeDocument: "BOLETA",
    typeMoney: "SOL",
    client: {
      name: "CLIENTE DE PRUEBA",
      documentNumber: "00000000",
      typeDocument: "DNI",
      clientId: 1,
      clientType: "GENERAL",
      clientTypeId: 1,
      createdAt: new Date().toISOString(),
      email: "cliente@ejemplo.com",
      phone: "987654321",
      status: true,
    },
    user: {
      firstName: "VENDEDOR",
      email: "empleado@ejemplo.com",
      lastName: "DE PRUEBA",
      boxes: [],
      stores: [],
      role: 1,
      status: true,
      token: "",
      userId: 1,
    },
    saleDetails: [
      {
        productName: "PRODUCTO EJEMPLO",
        quantity: 2,
        priceSell: 75.25,
        priceSelected: 75.25,
        saleDetailId: 1,
        product: {
          productId: 1,
          name: "PRODUCTO EJEMPLO",
          status: true,
          category: {
            categoryId: 1,
            description: "CATEGORÍA DE PRUEBA",
            name: "CATEGORÍA DE PRUEBA",
            status: true,
          },
          code: "PROD001",
          codeInternal: "PROD001",
          description: "Descripción del producto de prueba",
          image: {
            createdAt: new Date().toISOString(),
            imageId: 1,
            imageName: "https://via.placeholder.com/150",
            imageUrl: "https://via.placeholder.com/150",
          },
          minStock: 10,
          priceBuy: 50,
          priceSell: 75.25,
          productPrices: [
            {
              productPriceId: 1,
              price: 75.25,
              status: true,
              createdAt: new Date().toISOString(),
            },
          ],
          unit: {
            description: "UNIDAD",
            name: "UNIDAD",
            status: true,
            unitId: 1,
          },
        },
      },
    ],
    saleMethods: [],
    observations: "VISTA PREVIA",
    store: {
      address: "AV. PRINCIPAL 123",
      code: "ALM001",
      createdAt: new Date().toISOString(),
      maxCapacity: 1000,
      name: "ALMACÉN PRINCIPAL",
      observations: "",
      phone: "987654321",
      status: true,
      storeId: 1,
      type: "PRINCIPAL",
      user: {
        firstName: "VENDEDOR",
        email: "empleado@ejemplo.com",
        lastName: "DE PRUEBA",
        role: 1,
        status: true,
        token: "",
        userId: 1,
        boxes: [],
        stores: [],
      },
    },
    box: {
      boxId: 1,
      boxName: "CAJA 01",
      serie: "B001",
      serieProforma: "P001",
      storeId: 1,
      status: true,
    },
  };

  return (
    <div className="p-4 flex flex-col gap-2 min-h-screen bg-zinc-50/50 dark:bg-zinc-950">
      <Load loading={isLoading} />

      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
          Configuración del Sistema
        </h1>
        <p className="text-zinc-500 text-sm font-medium">
          Gestiona la identidad y parámetros de tu empresa.
        </p>
      </div>

      <Tabs
        aria-label="Opciones de configuración"
        color="primary"
        variant="underlined"
        classNames={{
          tabList:
            "gap-6 w-full relative rounded-none p-0 border-b border-divider",
          cursor: "w-full bg-primary",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-primary font-bold",
        }}
      >
        <Tab
          key="general"
          title={
            <div className="flex items-center space-x-2">
              <MdBusiness size={20} />
              <span>General</span>
            </div>
          }
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="shadow-md border border-zinc-200 dark:border-zinc-800">
                <CardHeader className="flex gap-3 p-6 bg-zinc-50/50 dark:bg-zinc-900 border-b dark:border-zinc-800">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                    <MdInfo size={24} />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-md font-bold">Datos de la Empresa</p>
                    <p className="text-small text-default-500">
                      Esta información aparecerá en tus comprobantes y tickets.
                    </p>
                  </div>
                </CardHeader>
                <CardBody className="p-8">
                  <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    <Input
                      label="Nombre de la Empresa"
                      name="enterpriseName"
                      placeholder="Ej. Mi Empresa S.A.C."
                      variant="bordered"
                      labelPlacement="outside"
                      value={formData.enterpriseName}
                      onChange={handleChange}
                      startContent={<MdBusiness className="text-zinc-400" />}
                    />
                    <Input
                      label="RUC"
                      name="ruc"
                      placeholder="10123456789"
                      variant="bordered"
                      labelPlacement="outside"
                      value={formData.ruc}
                      onChange={handleChange}
                    />
                    <Input
                      label="Teléfono"
                      name="phone"
                      placeholder="987 654 321"
                      variant="bordered"
                      labelPlacement="outside"
                      value={formData.phone}
                      onChange={handleChange}
                      startContent={<MdPhone className="text-zinc-400" />}
                    />
                    <Input
                      label="Correo de Contacto"
                      name="contactEmail"
                      placeholder="contacto@empresa.com"
                      variant="bordered"
                      labelPlacement="outside"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      startContent={<LuContact className="text-zinc-400" />}
                    />
                    <Input
                      label="Dirección"
                      name="address"
                      placeholder="Av. Principal 123"
                      variant="bordered"
                      labelPlacement="outside"
                      className="md:col-span-2"
                      value={formData.address}
                      onChange={handleChange}
                      startContent={<MdLocationOn className="text-zinc-400" />}
                    />
                    <Input
                      label="Moneda y Localidad"
                      name="localCurrency"
                      placeholder="PERU-TRUJILLO-TRUJILLO"
                      variant="bordered"
                      labelPlacement="outside"
                      value={formData.localCurrency}
                      onChange={handleChange}
                      startContent={<MdAttachMoney className="text-zinc-400" />}
                    />
                    <Input
                      label="URL del Logo"
                      name="logoUrl"
                      placeholder="https://su-imagen.com/logo.png"
                      variant="bordered"
                      labelPlacement="outside"
                      value={formData.logoUrl}
                      onChange={handleChange}
                      startContent={<MdCloudUpload className="text-zinc-400" />}
                    />

                    <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                      <Button
                        color="primary"
                        size="lg"
                        className="font-bold h-12 px-10 shadow-lg shadow-primary/20"
                        type="submit"
                        isLoading={isSaving}
                        startContent={<MdCheckCircle className="text-xl" />}
                      >
                        GUARDAR CAMBIOS
                      </Button>
                    </div>
                  </form>
                </CardBody>
              </Card>
            </div>

            {/* Preview Column */}
            <div className="flex flex-col gap-6">
              {/* Logo Card */}
              <Card className="shadow-md border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <CardHeader className="bg-zinc-50 dark:bg-zinc-900 border-b dark:border-zinc-800 font-bold px-6 py-4">
                  Vista Previa Logo
                </CardHeader>
                <CardBody className="p-8 items-center justify-center min-h-62.5 bg-white dark:bg-zinc-900 ring-1 ring-zinc-100 dark:ring-zinc-800 rounded-b-xl">
                  {formData.logoUrl ? (
                    <Image
                      src={formData.logoUrl}
                      alt="Enterprise Logo"
                      width={200}
                      className="object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-zinc-400 gap-2">
                      <MdCloudUpload size={48} />
                      <p className="text-tiny font-bold uppercase tracking-widest">
                        Sin imagen cargada
                      </p>
                    </div>
                  )}
                </CardBody>
              </Card>

              {/* Ticket Card Preview */}
              <Card className="shadow-md border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <CardHeader className="bg-zinc-50 dark:bg-zinc-900 border-b dark:border-zinc-800 font-bold px-6 py-4">
                  Vista Previa Ticket
                </CardHeader>
                <CardBody className="p-4 bg-zinc-100 dark:bg-zinc-800/50 items-center">
                  <div className="bg-white p-2 rounded shadow-inner w-full overflow-auto max-h-87.5">
                    {formData && lastConfig && (
                      <SaleTicket
                        sale={mockSale}
                        config={{ ...lastConfig, ...formData }}
                      />
                    )}
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </Tab>

        <Tab
          key="history"
          title={
            <div className="flex items-center space-x-2">
              <MdHistory size={20} />
              <span>Historial</span>
            </div>
          }
        >
          <div className="mt-4">
            <Card className="shadow-md border border-zinc-200 dark:border-zinc-800">
              <Table
                aria-label="Historial de configuración"
                shadow="none"
                className="p-0 rounded-xl"
              >
                <TableHeader>
                  <TableColumn>EMPRESA</TableColumn>
                  <TableColumn>RUC</TableColumn>
                  <TableColumn>TELÉFONO</TableColumn>
                  <TableColumn>DIRECCIÓN</TableColumn>
                  <TableColumn>FECHA CAMBIO</TableColumn>
                </TableHeader>
                <TableBody emptyContent="No hay historial registrado">
                  {allConfigs.map((config) => (
                    <TableRow key={config.configId}>
                      <TableCell className="font-bold">
                        {config.enterpriseName}
                      </TableCell>
                      <TableCell>{config.ruc}</TableCell>
                      <TableCell>{config.phone}</TableCell>
                      <TableCell>{config.address}</TableCell>
                      <TableCell>
                        {new Date(config.createdAt).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
