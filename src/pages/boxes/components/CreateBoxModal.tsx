import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { useForm, Controller } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { instance } from "@/libs/axios";
import { useAuth } from "@/context/AuthContext";
import type { ApiResponse, ResponseStore } from "@/interface/response.interface";
import { LuBox } from "react-icons/lu";

interface CreateBoxModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CreateBoxFormData {
  boxName: string;
  serie: string;
  serieProforma: string;
  storeId: string;
}

export default function CreateBoxModal({
  isOpen,
  onOpenChange,
}: CreateBoxModalProps) {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateBoxFormData>({
    defaultValues: {
      boxName: "",
      serie: "",
      serieProforma: "",
      storeId: "",
    },
  });

  // Fetch stores for dropdown (GET /store)
  const { data: storesData, isLoading: isLoadingStores } = useQuery<
    ApiResponse<ResponseStore[]>
  >({
    queryKey: ["stores-list-select"],
    queryFn: async () => {
      const res = await instance.get("/store", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    enabled: isOpen,
  });

  // Create box mutation (POST /box)
  const createMutation = useMutation({
    mutationFn: async (data: CreateBoxFormData) => {
      const payload = {
        boxName: data.boxName,
        serie: data.serie,
        serieProforma: data.serieProforma,
        storeId: Number(data.storeId),
      };
      const res = await instance.post<ApiResponse<any>>("/box", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boxes-list"] });
      reset();
      setErrorMsg(null);
      onOpenChange(false);
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        "Ocurrió un error al registrar la caja.";
      setErrorMsg(msg);
    },
  });

  const onSubmit = (formData: CreateBoxFormData) => {
    setErrorMsg(null);
    createMutation.mutate(formData);
  };

  const stores = storesData?.data || [];

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      backdrop="blur"
      onClose={() => reset()}
    >
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader className="flex items-center gap-2">
              <LuBox className="text-primary" size={20} />
              <span>Agregar Nueva Caja</span>
            </ModalHeader>

            <ModalBody className="space-y-4">
              {errorMsg && (
                <div className="p-3 text-xs bg-danger-50 text-danger border border-danger-200 rounded-lg">
                  {errorMsg}
                </div>
              )}

              <Controller
                name="boxName"
                control={control}
                rules={{ required: "El nombre de la caja es obligatorio" }}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Nombre de la Caja"
                    placeholder="Ej: CAJA PRUEBA"
                    variant="bordered"
                    isInvalid={!!errors.boxName}
                    errorMessage={errors.boxName?.message}
                  />
                )}
              />

              <div className="grid grid-cols-2 gap-3">
                <Controller
                  name="serie"
                  control={control}
                  rules={{ required: "Serie requerida" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Serie de Venta"
                      placeholder="Ej: BP01"
                      variant="bordered"
                      isInvalid={!!errors.serie}
                      errorMessage={errors.serie?.message}
                    />
                  )}
                />

                <Controller
                  name="serieProforma"
                  control={control}
                  rules={{ required: "Serie proforma requerida" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Serie Proforma"
                      placeholder="Ej: PF01"
                      variant="bordered"
                      isInvalid={!!errors.serieProforma}
                      errorMessage={errors.serieProforma?.message}
                    />
                  )}
                />
              </div>

              <Controller
                name="storeId"
                control={control}
                rules={{ required: "Debe seleccionar un almacén" }}
                render={({ field }) => (
                  <Select
                    label="Almacén / Sucursal"
                    placeholder="Seleccione un almacén"
                    variant="bordered"
                    isLoading={isLoadingStores}
                    selectedKeys={field.value ? [field.value] : []}
                    onChange={(e) => field.onChange(e.target.value)}
                    isInvalid={!!errors.storeId}
                    errorMessage={errors.storeId?.message}
                  >
                    {stores.map((store) => (
                      <SelectItem key={String(store.storeId)}>
                        {store.name}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              />
            </ModalBody>

            <ModalFooter>
              <Button variant="flat" color="default" onPress={onClose}>
                Cancelar
              </Button>
              <Button
                color="primary"
                type="submit"
                isLoading={createMutation.isPending}
                className="font-semibold"
              >
                Guardar Caja
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
