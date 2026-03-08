import { useAuth } from "@/context/AuthContext";
import { instance } from "@/libs/axios";
import { UserSchema, type UserSchemaType } from "@/schemas/users/user.schema";
import {
  addToast,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation,  } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

interface CreateUserProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

const roles = [
  { label: "ADMIN", value: "0" },
  { label: "BUY", value: "1" },
  { label: "STORE", value: "2" },
  { label: "AUDIENCE", value: "3" },
];

export default function CreateUser({
  isOpen,
  onClose,
  onConfirm,
}: CreateUserProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserSchemaType>({
    resolver: zodResolver(UserSchema),
  });

  const { token } = useAuth();

  const { mutate: onSubmit, isPending } = useMutation({
    mutationFn: async (data: UserSchemaType) => {
      const res = await instance.post("/user", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      reset();
      onClose();
      onConfirm?.();
      addToast({
        title: "Usuario creado exitosamente",
        description: "El usuario se ha creado correctamente",
        color: "success",
      })
    },
    onError: (error: any) => {
      addToast({
        title: "Error al crear usuario",
        description: error.response.data.message,
        color: "danger",
      })
    },
  });

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="2xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Crear Usuario
            </ModalHeader>
            <form onSubmit={handleSubmit((values) => onSubmit(values))}>
              <ModalBody>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    {...register("firstName")}
                    label="Nombre"
                    placeholder="Ingrese el nombre"
                    isInvalid={!!errors.firstName}
                    errorMessage={errors.firstName?.message}
                    variant="bordered"
                  />
                  <Input
                    {...register("lastName")}
                    label="Apellido"
                    placeholder="Ingrese el apellido"
                    isInvalid={!!errors.lastName}
                    errorMessage={errors.lastName?.message}
                    variant="bordered"
                  />
                </div>
                <Input
                  {...register("email")}
                  label="Correo Electrónico"
                  placeholder="ejemplo@correo.com"
                  isInvalid={!!errors.email}
                  errorMessage={errors.email?.message}
                  variant="bordered"
                  type="email"
                />
                <Input
                  {...register("password")}
                  label="Contraseña"
                  placeholder="Ingrese la contraseña"
                  isInvalid={!!errors.password}
                  errorMessage={errors.password?.message}
                  variant="bordered"
                  type="password"
                />
                <Select
                  {...register("role")}
                  label="Rol de Usuario"
                  placeholder="Seleccione un rol"
                  isInvalid={!!errors.role}
                  errorMessage={errors.role?.message}
                  variant="bordered"
                >
                  {roles.map((role) => (
                    <SelectItem key={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="bordered"
                  onPress={onClose}
                  type="button"
                  className="font-semibold"
                >
                  Cancelar
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  className="ml-2"
                  isLoading={isPending}
                >
                  Crear Usuario
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
