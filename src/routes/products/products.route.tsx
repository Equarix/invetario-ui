import CreateProductPage from "@/pages/products/crear/CreateProductPage";
import EditProductPage from "@/pages/products/edit/EditProductPage";
import ProductsPage from "@/pages/products/ProductsPage";
import { Route, Routes } from "react-router";

export default function ProductsRoute() {
  return (
    <Routes>
      <Route path="/" element={<ProductsPage />} />
      <Route path="/crear" element={<CreateProductPage />} />
      <Route path="/editar/:productId" element={<EditProductPage />} />
    </Routes>
  );
}
