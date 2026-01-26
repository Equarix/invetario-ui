import CreateProductPage from "@/pages/products/crear/CreateProductPage";
import ProductsPage from "@/pages/products/ProductsPage";
import { Route, Routes } from "react-router";

export default function ProductsRoute() {
  return (
    <Routes>
      <Route path="/" element={<ProductsPage />} />
      <Route path="/crear" element={<CreateProductPage />} />
    </Routes>
  );
}
