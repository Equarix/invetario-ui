import Container from "@/components/components/container/Container";
import Header from "@/components/layouts/header/Header";
import { LuUsers } from "react-icons/lu";
import { useNavigate } from "react-router";

export default function Client() {
  const navigate = useNavigate();

  return (
    <Container>
      <Header
        icon={<LuUsers />}
        text={{
          header: "Clientes",
          button: "Agregar Cliente",
        }}
        onClick={() => navigate("/clientes/crear")}
      />
    </Container>
  );
}
