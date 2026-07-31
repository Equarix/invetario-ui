import CategoryPage from "@/pages/categories/CategoryPage";
import PayMethodPage from "@/pages/pay-method/PayMethodPage";
import UnitPage from "@/pages/unit/UnitPage";
import BoxPage from "@/pages/boxes/BoxPage";
import { Route, Routes } from "react-router";

export default function CrudRoute() {
  return (
    <Routes>
      <Route path="/unidades" element={<UnitPage />} />
      <Route path="/categorias" element={<CategoryPage />} />
      <Route path="/metodos-pago" element={<PayMethodPage />} />
      <Route path="/cajas" element={<BoxPage />} />
    </Routes>
  );
}
