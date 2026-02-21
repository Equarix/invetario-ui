import Container from "@/components/components/container/Container";
import Load from "@/components/components/load/Load";
import Header from "@/components/layouts/header/Header";
import { useAuth } from "@/context/AuthContext";
import { instance } from "@/libs/axios";
import {
  ClientSchema,
  ClientType,
  type ClientInput,
} from "@/schemas/client/client.schema";
import { parseErrors } from "@/utils/parseErrors";
import { addToast, Form, Input, Select, SelectItem } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { LuPlus } from "react-icons/lu";
import { useNavigate } from "react-router";
import { cn } from "@/utils/cn";

const clientTypeOptions = [
  { label: "Natural", value: String(ClientType.NATURAL) },
  { label: "Empresa", value: String(ClientType.COMPANY) },
];

export default function CreateClientPage() {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: zodResolver(ClientSchema),
  });

  const { token } = useAuth();
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ClientInput) => {
      const payload = { ...data };
      const res = await instance.post("/client", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      addToast({
        title: "Cliente creado",
        color: "success",
      });
      navigate("/clientes");
    },
    onError: () => {
      addToast({
        title: "Error al crear el cliente",
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
      <Load loading={isPending} />
      <Container>
        <Header
          icon={<LuPlus />}
          text={{
            header: "Crear Cliente",
            button: "Guardar Cliente",
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
        </div>
      </Container>
    </Form>
  );
}
