import {
  Button,
  cn,
  Form,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { useOrderEntry } from "../hooks/useOrderEntry";
import Container from "@/components/components/container/Container";
import Header from "@/components/layouts/header/Header";
import { LuBox } from "react-icons/lu";
import Load from "@/components/components/load/Load";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  OrderEntryDetailsSchema,
  OrderEntrySchema,
} from "@/schemas/order-entry/orderEntry.schema";
import InputDate from "@/components/components/input-date/InputDate";
import Table from "@/components/components/table/Table";
import { parseErrors } from "@/utils/parseErrors";

export default function CreateOrderEntry() {
  const {
    stores,
    provider,
    entriesTypes,
    payCondition,
    products,
    isLoading,
    mutate,
  } = useOrderEntry();
  const {
    control,
    formState: { errors },
    setValue,
    watch,
    handleSubmit,
  } = useForm({
    resolver: zodResolver(OrderEntrySchema),
    defaultValues: {
      entryDate: new Date(),
    },
  });

  const formProduct = useForm({
    resolver: zodResolver(OrderEntryDetailsSchema),
  });

  return (
    <Form
      validationErrors={parseErrors(errors)}
      onSubmit={handleSubmit((data) => {
        mutate(data);
      })}
    >
      <Load loading={isLoading} />
      <Container>
        <Header
          icon={<LuBox />}
          text={{
            header: "Crear Orden de Entrada",
            button: "Guardar Orden de Entrada",
          }}
          type="submit"
        />

        <div className="w-full border border-slate-200 rounded-xl p-4 mt-4 grid grid-cols-3 gap-2">
          <p className="text-lg font-medium mb-4 col-span-3">
            Información General
          </p>
          <Controller
            control={control}
            name="providerId"
            render={({ field: { value, onChange, name } }) => (
              <div>
                <Select
                  label="Proveedor"
                  labelPlacement="outside"
                  placeholder="Seleccione proveedor"
                  className={cn(!!errors.providerId && "mt-0!")}
                  items={provider.data}
                  selectedKeys={value ? new Set([String(value)]) : new Set()}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0];
                    if (selectedKey) {
                      onChange(Number(selectedKey));
                    }
                  }}
                  name={name}
                >
                  {(item) => (
                    <SelectItem key={item.providerId}>
                      {item.companyName}
                    </SelectItem>
                  )}
                </Select>
              </div>
            )}
          />

          <Controller
            control={control}
            name="storeId"
            render={({ field: { value, onChange, name } }) => (
              <div>
                <Select
                  label="Almacén"
                  labelPlacement="outside"
                  placeholder="Seleccione almacén"
                  className={cn(!!errors.storeId && "mt-0!")}
                  items={stores.data}
                  selectedKeys={value ? new Set([String(value)]) : new Set()}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0];
                    if (selectedKey) {
                      products.getProducts(Number(selectedKey));
                      onChange(Number(selectedKey));
                    }
                  }}
                  name={name}
                >
                  {(item) => (
                    <SelectItem key={item.storeId}>{item.name}</SelectItem>
                  )}
                </Select>
              </div>
            )}
          />

          <Controller
            control={control}
            name="entryDate"
            render={({ field: { value, onChange } }) => (
              <InputDate
                label="Fecha de Entrada"
                value={value}
                onChange={(date) => {
                  onChange(date);
                }}
              />
            )}
          />

          <div className="col-span-3 grid gap-2 grid-cols-4">
            <Controller
              control={control}
              name="entryOrderType"
              render={({ field: { value, onChange, name } }) => (
                <div>
                  <Select
                    label="Tipo de Entrada"
                    labelPlacement="outside"
                    placeholder="Seleccione tipo de entrada"
                    className={cn(!!errors.entryOrderType && "mt-0!")}
                    items={entriesTypes}
                    selectedKeys={
                      value !== undefined && value !== null
                        ? new Set([String(value)])
                        : new Set()
                    }
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0];
                      if (selectedKey !== undefined && selectedKey !== null) {
                        onChange(Number(selectedKey));
                      }
                    }}
                    name={name}
                  >
                    {(item) => (
                      <SelectItem key={item.value}>{item.label}</SelectItem>
                    )}
                  </Select>
                </div>
              )}
            />
            <Controller
              control={control}
              name="payCondition"
              render={({ field: { value, onChange, name } }) => (
                <div>
                  <Select
                    label="Condición de Pago"
                    labelPlacement="outside"
                    placeholder="Seleccione condición de pago"
                    className={cn(!!errors.payCondition && "mt-0!")}
                    items={payCondition}
                    selectedKeys={
                      value !== undefined && value !== null
                        ? new Set([String(value)])
                        : new Set()
                    }
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0];
                      if (selectedKey) {
                        onChange(Number(selectedKey));
                      }
                    }}
                    name={name}
                  >
                    {(item) => (
                      <SelectItem key={item.value}>{item.label}</SelectItem>
                    )}
                  </Select>
                </div>
              )}
            />
            <Controller
              control={control}
              name="typeMoney"
              render={({ field: { value, onChange, name } }) => (
                <Input
                  label="Condición de Pago"
                  labelPlacement="outside"
                  placeholder="Ingrese condición de pago"
                  value={value}
                  onChange={onChange}
                  name={name}
                />
              )}
            />{" "}
            <Controller
              control={control}
              name="tax"
              render={({ field: { value, onChange, name } }) => (
                <Input
                  label="Impuesto"
                  labelPlacement="outside"
                  placeholder="Ingrese impuesto"
                  value={value?.toString()}
                  onChange={(e) => {
                    const newValue = parseFloat(e.target.value);
                    if (!isNaN(newValue)) {
                      onChange(newValue);
                    } else {
                      onChange(0);
                    }
                  }}
                  name={name}
                />
              )}
            />
          </div>

          <Textarea
            className="col-span-3"
            label="Observaciones"
            labelPlacement="outside"
            placeholder="Ingrese observaciones"
            onChange={(e) => setValue("observations", e.target.value)}
            value={watch("observations")}
          />
        </div>

        <div className="w-full grid grid-cols-3 gap-2 mt-4">
          <div className="w-full border border-slate-200 rounded-xl p-4 mt-4 flex flex-col gap-4">
            <p className="text-lg font-medium mb-4 col-span-3">Productos</p>
            <Controller
              control={formProduct.control}
              name="productId"
              render={({
                field: { value, onChange, name },
                formState: { errors },
              }) => (
                <div>
                  <Select
                    label="Producto"
                    labelPlacement="outside"
                    placeholder="Seleccione producto"
                    items={products.data}
                    selectedKeys={value ? new Set([String(value)]) : new Set()}
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0];
                      if (selectedKey) {
                        onChange(Number(selectedKey));
                      }
                    }}
                    name={name}
                    className={cn(!!errors.productId && "mt-0!")}
                    errorMessage={errors.productId?.message}
                    isInvalid={!!errors.productId}
                  >
                    {(item) => (
                      <SelectItem key={item.productId}>{item.name}</SelectItem>
                    )}
                  </Select>
                </div>
              )}
            />

            <Controller
              control={formProduct.control}
              name="quantity"
              render={({
                field: { value, onChange, name },
                formState: { errors },
              }) => (
                <Input
                  label="Cantidad"
                  labelPlacement="outside"
                  placeholder="Ingrese cantidad"
                  value={value?.toString()}
                  onChange={(e) => {
                    const newValue = parseInt(e.target.value, 10);
                    if (!isNaN(newValue)) {
                      onChange(newValue);
                    } else {
                      onChange(0);
                    }
                  }}
                  name={name}
                  errorMessage={errors.quantity?.message}
                  isInvalid={!!errors.quantity}
                />
              )}
            />

            <Controller
              control={formProduct.control}
              name="unitPrice"
              render={({
                field: { value, onChange, name },
                formState: { errors },
              }) => (
                <Input
                  label="Precio Unitario"
                  labelPlacement="outside"
                  placeholder="Ingrese precio unitario"
                  value={value?.toString()}
                  onChange={(e) => {
                    const newValue = parseInt(e.target.value, 10);
                    if (!isNaN(newValue)) {
                      onChange(newValue);
                    } else {
                      onChange(0);
                    }
                  }}
                  name={name}
                  errorMessage={errors.unitPrice?.message}
                  isInvalid={!!errors.unitPrice}
                />
              )}
            />

            <Button
              variant="solid"
              color="primary"
              onPress={() =>
                formProduct.handleSubmit((data) => {
                  const currentDetails = watch("entryOrderDetails") ?? [];
                  setValue("entryOrderDetails", [...currentDetails, data]);
                  formProduct.reset();
                })()
              }
            >
              Agregar Producto
            </Button>
          </div>

          <div className="w-full col-span-2 p-4">
            <Table
              data={watch("entryOrderDetails") ?? []}
              columns={[
                {
                  header: "Producto",
                  accessorFn: (row) => {
                    const product = products.data.find(
                      (p) => p.productId === row.productId,
                    );
                    return product ? product.name : "Producto no encontrado";
                  },
                },
                {
                  header: "Cantidad",
                  accessorKey: "quantity",
                },
                {
                  header: "Precio Unitario",
                  accessorKey: "unitPrice",
                },
                {
                  header: "Acciones",
                  cell: ({ row }) => (
                    <Button
                      variant="solid"
                      color="danger"
                      onPress={() => {
                        const currentDetails = watch("entryOrderDetails") ?? [];
                        const newDetails = currentDetails.filter(
                          (_, index) => index !== row.index,
                        );
                        setValue("entryOrderDetails", newDetails);
                      }}
                    >
                      Eliminar
                    </Button>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </Container>
    </Form>
  );
}
