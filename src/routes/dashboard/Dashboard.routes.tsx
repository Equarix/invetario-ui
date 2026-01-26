import CategoryPage from "@/pages/categories/CategoryPage";
import GaleryPage from "@/pages/galery/GaleryPage";
import UnitPage from "@/pages/unit/UnitPage";
import { Route, Routes } from "react-router";
import StoreRoutes from "../stores/Store.routes";
import ProductsRoute from "../products/products.route";

export default function DashboardRoutes() {
  return (
    <Routes>
      <Route path="/" element={<h1>Inicio dashboard</h1>} />
      <Route path="/unidades" element={<UnitPage />} />
      <Route path="/categorias" element={<CategoryPage />} />
      <Route path="/galeria" element={<GaleryPage />} />
      <Route path="/almacenes/*" element={<StoreRoutes />} />
      <Route path="/productos/*" element={<ProductsRoute />} />
      <Route
        path="*"
        element={<h1 className="text-white">404 - Not Found</h1>}
      />
    </Routes>
  );
}
