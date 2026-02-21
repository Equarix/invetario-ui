import Container from "@/components/components/container/Container";
import Header from "@/components/layouts/header/Header";
import { LuBox } from "react-icons/lu";
import { useNavigate } from "react-router";

export default function OrderEntry() {
  const navigate = useNavigate();

  return (
    <Container>
      <Header
        icon={<LuBox />}
        text={{
          header: "Orden de Entrada",
          button: "Agregar Orden de Entrada",
        }}
        onClick={() => navigate("/orden-entrada/crear")}
      />
    </Container>
  );
}
