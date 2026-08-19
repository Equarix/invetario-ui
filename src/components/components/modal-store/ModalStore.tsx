import { useAuth } from "@/context/AuthContext";
import {
  ModalStoreSchema,
  type ModalStoreSchemaType,
} from "@/schemas/utils/utils.schema";
import {
  Button,
  Checkbox,
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
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { parseErrors } from "@/utils/parseErrors";

export default function ModalStore() {
  const { user, storeId, boxId, handleSelectStore, handleSelectBox } =
    useAuth();
  const isRoleAdmin = user?.role === 0;
  const hasStoreAndBox = Boolean(
    storeId && storeId !== -1 && boxId && boxId !== -1,
  );
  const canClose = Boolean(isRoleAdmin || hasStoreAndBox);

  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (!hasStoreAndBox) {
      setIsOpen(true);
    }
  }, [hasStoreAndBox]);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-store-modal", handleOpen);
    return () => window.removeEventListener("open-store-modal", handleOpen);
  }, []);

  const handleClose = () => {
    if (canClose) {
      setIsOpen(false);
    }
  };

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ModalStoreSchemaType>({
    resolver: zodResolver(ModalStoreSchema),
    defaultValues: {
      storeId: storeId && storeId !== -1 ? storeId : undefined,
      boxId: boxId && boxId !== -1 ? boxId : undefined,
    },
  });

  const selectedBoxId = watch("boxId");

  const onSubmit = (data: ModalStoreSchemaType) => {
    handleSelectStore(data.storeId);
    handleSelectBox(data.boxId);
    setIsOpen(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      isDismissable={canClose}
      hideCloseButton={!canClose}
    >
      <Form
        validationErrors={parseErrors(errors)}
        onSubmit={handleSubmit(onSubmit)}
        className="w-full"
      >
        <ModalContent>
          <ModalHeader>Seleccionar Tienda y Caja</ModalHeader>
          <ModalBody className="gap-4">
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
                      user?.stores?.map((s) => ({
                        label: s.name,
                        value: s.storeId.toString(),
                      })) || []
                    }
                    selectedKeys={
                      value ? new Set([value.toString()]) : new Set()
                    }
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0];
                      if (selectedKey) {
                        onChange(Number(selectedKey));
                        setValue("boxId", undefined as unknown as number);
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

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Caja de la tienda</label>
              {user?.boxes?.length === 0 ? (
                <p className="text-xs text-default-400">
                  No hay cajas disponibles en esta tienda.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {user?.boxes?.map((box) => (
                    <Checkbox
                      key={box.boxId}
                      isSelected={selectedBoxId === box.boxId}
                      onValueChange={(isSelected) => {
                        if (isSelected) {
                          setValue("boxId", box.boxId);
                        } else if (selectedBoxId === box.boxId) {
                          setValue("boxId", undefined as unknown as number);
                        }
                      }}
                    >
                      {box.boxName} ({box.serie})
                    </Checkbox>
                  ))}
                </div>
              )}
              {errors.boxId && (
                <span className="text-xs text-danger">
                  {errors.boxId.message}
                </span>
              )}
            </div>
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
