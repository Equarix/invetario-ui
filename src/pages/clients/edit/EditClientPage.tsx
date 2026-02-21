import Container from "@/components/components/container/Container";
import Load from "@/components/components/load/Load";
import Header from "@/components/layouts/header/Header";
import { useAuth } from "@/context/AuthContext";
import type {
  ApiResponse,
  ResponseClient,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import {
  updateClientSchema,
  ClientType,
  type UpdateClientInput,
} from "@/schemas/client/client.schema";
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

const clientTypeOptions = [
  { label: "Natural", value: String(ClientType.NATURAL) },
  { label: "Empresa", value: String(ClientType.COMPANY) },
];

export default function EditClientPage() {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    resolver: zodResolver(updateClientSchema),
  });

  const { data: clientData, isLoading: isLoadingFetch } = useQuery<
    ApiResponse<ResponseClient>
  >({
    queryKey: ["client", clientId],
    queryFn: async () => {
      const res = await instance.get(`/client/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!clientId,
  });

  useEffect(() => {
    if (clientData?.data) {
      const d = clientData.data;
      reset({
        name: d.name,
        email: d.email || "",
        phone: d.phone,
        typeDocument: d.typeDocument,
        documentNumber: d.documentNumber,
        clientType: d.clientTypeId, // Assuming clientTypeId maps directly to the enum ClientType behind enum ClientType
        status: d.status,
      });
    }
  }, [clientData, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: UpdateClientInput) => {
      const res = await instance.put(`/client/${clientId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      addToast({
        title: "Cliente actualizado",
        color: "success",
      });
      navigate("/clientes");
    },
    onError: () => {
      addToast({
        title: "Error al actualizar el cliente",
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
            header: "Editar Cliente",
            button: "Actualizar Cliente",
          }}
          type="submit"
        />

        <div className="grid grid-cols-2 gap-4 bg-default-50 p-6 rounded-lg">
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Input
                label="Nombre / Razón Social"
                placeholder="Nombre completo o razón social"
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
            name="clientType"
            render={({ field: { value, onChange, name } }) => (
              <div>
                <Select
                  label="Tipo de Cliente"
                  labelPlacement="outside"
                  placeholder="Seleccione tipo"
                  className={cn(!!errors.clientType && "mt-0!")}
                  items={clientTypeOptions}
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
