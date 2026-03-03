import { useAuth } from "@/context/AuthContext";
import type {
  ApiResponse,
  ResponseUserStore,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import {
  ModalStoreSchema,
  type ModalStoreSchemaType,
} from "@/schemas/utils/utils.schema";
import {
  Button,
  cn,
  Form,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Load from "../load/Load";
import { parseErrors } from "@/utils/parseErrors";

export default function ModalStore() {
  const { storeId, handleSelectStore, token } = useAuth();
  const [isOpen, setIsOpen] = useState(() => storeId === -1 || !storeId);

  const { isLoading, data: resUserStore } = useQuery<
    ApiResponse<ResponseUserStore[]>
  >({
    queryKey: ["user-stores"],
    queryFn: async () => {
      const res = await instance.get("/storeuser/by-token", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    },
    enabled: isOpen,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ModalStoreSchema),
  });

  const onSubmit = (data: ModalStoreSchemaType) => {
    handleSelectStore(data.storeId);
    setIsOpen(false);
  };

  return (
    <Modal isOpen={isOpen} closeButton={<span />}>
      <Load loading={isLoading} />
      <Form
        validationErrors={parseErrors(errors)}
        onSubmit={handleSubmit(onSubmit)}
        className="w-full"
      >
        <ModalContent>
          <ModalHeader>Selecciona una tienda</ModalHeader>
          <ModalBody>
            <Controller
              control={control}
              name="storeId"
              render={({ field: { value, name, onChange } }) => (
                <div>
                  <Select
                    label="Tienda"
                    labelPlacement="outside"
                    placeholder="Seleccione una tienda"
                    className={cn(!!errors.storeId?.message && "mt-0!")}
                    items={
                      resUserStore?.data.map((c) => ({
                        label: c.store.name,
                        value: c.store.storeId.toString(),
                      })) || []
                    }
                    selectedKeys={
                      value ? new Set([value.toString()]) : new Set()
                    }
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0];
                      onChange(Number(selectedKey));
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
          </ModalBody>
          <ModalFooter>
            <Button color="primary" className="ml-2" type="submit">
              Seleccionar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Form>
    </Modal>
  );
}
