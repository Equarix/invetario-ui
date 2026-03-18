import CategoryPage from "@/pages/categories/CategoryPage";
import PayMethodPage from "@/pages/pay-method/PayMethodPage";
import UnitPage from "@/pages/unit/UnitPage";
import { Route, Routes } from "react-router";

export default function CrudRoute() {
  return (
    <Routes>
      <Route path="/unidades" element={<UnitPage />} />
      <Route path="/categorias" element={<CategoryPage />} />
      <Route path="/metodos-pago" element={<PayMethodPage />} />
    </Routes>
  );
}
