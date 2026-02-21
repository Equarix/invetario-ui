import Container from "@/components/components/container/Container";
import Load from "@/components/components/load/Load";
import Header from "@/components/layouts/header/Header";
import { useAuth } from "@/context/AuthContext";
import type {
  ApiResponse,
  ResponseProvider,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import {
  PayCondition,
  type ProviderInput,
  updateProviderSchema,
} from "@/schemas/provider/provider.schema";
import { parseErrors } from "@/utils/parseErrors";
import {
  addToast,
  Form,
  Input,
  Select,
  SelectItem,
  Switch,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { LuSave } from "react-icons/lu";
import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import { cn } from "@/utils/cn";

const payConditionOptions = [
  { label: "Contado", value: PayCondition.Contado },
  { label: "Crédito 30", value: PayCondition.Credito30 },
  { label: "Crédito 60", value: PayCondition.Credito60 },
  { label: "Crédito 90", value: PayCondition.Credito90 },
];

export default function EditProviderPage() {
  const { providerId } = useParams<{ providerId: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    resolver: zodResolver(updateProviderSchema),
  });

  const { data: providerData, isLoading: isLoadingFetch } = useQuery<
    ApiResponse<ResponseProvider>
  >({
    queryKey: ["provider", providerId],
    queryFn: async () => {
      const res = await instance.get(`/provider/${providerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!providerId,
  });

  useEffect(() => {
    if (providerData?.data) {
      const d = providerData.data;
      reset({
        code: d.code,
        email: d.email || "",
        phone: d.phone,
        address: d.address || "",
        typeMoney: d.typeMoney,
        publicName: d.publicName,
        companyName: d.companyName,
        mainContact: d.mainContact,
        contactPhone: d.contactPhone,
        typeDocument: d.typeDocument,
        documentNumber: d.documentNumber,
        payCondition: d.payConditionId,
        daysDelivery: d.daysDelivery,
        status: d.status,
      });
    }
  }, [providerData, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ProviderInput) => {
      const res = await instance.put(`/provider/${providerId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      addToast({
        title: "Proveedor actualizado",
        color: "success",
      });
      navigate("/proveedores");
    },
    onError: () => {
      addToast({
        title: "Error al actualizar el proveedor",
        color: "danger",
      });
    },
  });

  return (
    <Form
      validationErrors={parseErrors(errors)}
      onSubmit={handleSubmit((data) => {
        mutate(data);
      })}
    >
      <Load loading={isLoadingFetch || isPending} />
      <Container>
        <Header
          icon={<LuSave />}
          text={{
            header: "Editar Proveedor",
            button: "Actualizar Proveedor",
          }}
          type="submit"
        />

        <div className="grid grid-cols-2 gap-4 bg-default-50 p-6 rounded-lg">
          <Controller
            control={control}
            name="code"
            render={({ field }) => (
              <Input
                label="Código"
                placeholder="Código del proveedor"
                labelPlacement="outside"
                {...field}
                value={field.value || ""}
              />
            )}
          />

          <Controller
            control={control}
            name="companyName"
            render={({ field }) => (
              <Input
                label="Razón Social (Compañía)"
                placeholder="Razón social del proveedor"
                labelPlacement="outside"
                {...field}
                value={field.value || ""}
              />
            )}
          />

          <Controller
            control={control}
            name="publicName"
            render={({ field }) => (
              <Input
                label="Nombre Público"
                placeholder="Nombre comercial o público"
                labelPlacement="outside"
                {...field}
                value={field.value || ""}
              />
            )}
          />

          <Controller
            control={control}
            name="typeDocument"
            render={({ field }) => (
              <Input
                label="Tipo de Documento"
                placeholder="Ej: RUC, DNI"
                labelPlacement="outside"
                {...field}
                value={field.value || ""}
              />
            )}
          />

          <Controller
            control={control}
            name="documentNumber"
            render={({ field }) => (
              <Input
                label="Número de Documento"
                placeholder="Número de documento"
                labelPlacement="outside"
                {...field}
                value={field.value || ""}
              />
            )}
          />

          <Controller
            control={control}
            name="phone"
            render={({ field }) => (
              <Input
                label="Teléfono"
                placeholder="Teléfono principal"
                labelPlacement="outside"
                {...field}
                value={field.value || ""}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Input
                label="Correo Electrónico"
                placeholder="correo@ejemplo.com"
                labelPlacement="outside"
                {...field}
                value={field.value || ""}
              />
            )}
          />

          <Controller
            control={control}
            name="address"
            render={({ field }) => (
              <Input
                label="Dirección"
                placeholder="Dirección del proveedor"
                labelPlacement="outside"
                {...field}
                value={field.value || ""}
              />
            )}
          />

          <Controller
            control={control}
            name="mainContact"
            render={({ field }) => (
              <Input
                label="Contacto Principal"
                placeholder="Nombre del contacto"
                labelPlacement="outside"
                {...field}
                value={field.value || ""}
              />
            )}
          />

          <Controller
            control={control}
            name="contactPhone"
            render={({ field }) => (
              <Input
                label="Teléfono del Contacto"
                placeholder="Teléfono del contacto principal"
                labelPlacement="outside"
                {...field}
                value={field.value || ""}
              />
            )}
          />
          <Controller
            control={control}
            name="daysDelivery"
            render={({ field }) => (
              <Input
                label="Días de Entrega"
                placeholder="Número de días de entrega"
                labelPlacement="outside"
                type="number"
                {...field}
                value={field.value?.toString() || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value ? Number(value) : 0);
                }}
              />
            )}
          />
          <Controller
            control={control}
            name="typeMoney"
            render={({ field }) => (
              <Input
                label="Tipo de Moneda"
                placeholder="Ej: USD, PEN"
                labelPlacement="outside"
                {...field}
                value={field.value || ""}
              />
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
                  placeholder="Seleccione condición"
                  className={cn(!!errors.payCondition && "mt-0!")}
                  items={payConditionOptions}
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
                    <SelectItem key={item.value}>{item.label}</SelectItem>
                  )}
                </Select>
              </div>
            )}
          />

          <Controller
            control={control}
            name="status"
            render={({ field: { value, onChange, name } }) => (
              <div className="flex items-center mt-6">
                <Switch
                  isSelected={!!value}
                  onValueChange={onChange}
                  name={name}
                >
                  Estado (Activo/Inactivo)
                </Switch>
              </div>
            )}
          />
        </div>
      </Container>
    </Form>
  );
}
