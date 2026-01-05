import CategoryPage from "@/pages/categories/CategoryPage";
import UnitPage from "@/pages/unit/UnitPage";
import { Route, Routes } from "react-router";

export default function DashboardRoutes() {
  return (
    <Routes>
      <Route path="/" element={<h1>Inicio dashboard</h1>} />
      <Route path="/unidades" element={<UnitPage />} />
      <Route path="/categorias" element={<CategoryPage />} />
    </Routes>
  );
}
