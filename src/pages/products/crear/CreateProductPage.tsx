import Container from "@/components/components/container/Container";
import Header from "@/components/layouts/header/Header";
import { Form } from "@heroui/react";
import { LuPlus } from "react-icons/lu";

export default function CreateProductPage() {
  return (
    <Form>
      <Container>
        <Header
          icon={<LuPlus />}
          text={{
            header: "Crear Producto",
            button: "Guardar Producto",
          }}
          type="submit"
        />

        <div className="grid grid-cols-2 gap-4 bg-default-50 p-6 rounded-lg"></div>
      </Container>
    </Form>
  );
}
