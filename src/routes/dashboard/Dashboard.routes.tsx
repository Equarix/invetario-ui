import ProductPage from "@/pages/products/ProductPage";
import UnitPage from "@/pages/unit/UnitPage";
import { Route, Routes } from "react-router";

export default function DashboardRoutes() {
  return (
    <Routes>
      <Route path="/" element={<h1>Inicio dashboard</h1>} />
      <Route path="/inventario/producto" element={<ProductPage />} />
      <Route path="/unidades" element={<UnitPage />} />
    </Routes>
  );
}
