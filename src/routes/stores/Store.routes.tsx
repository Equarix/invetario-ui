import StoreCreatePage from "@/pages/store/create/StoreCreatePage";
import StoreProducts from "@/pages/store/products/StoreProducts";
import StorePage from "@/pages/store/StorePage";
import StoreUpdatePage from "@/pages/store/update/StoreUpdatePage";
import { Route, Routes } from "react-router";

export default function StoreRoutes() {
  return (
    <Routes>
      <Route path="/" element={<StorePage />} />
      <Route path="productos/:storeId" element={<StoreProducts />} />
      <Route path="crear" element={<StoreCreatePage />} />
      <Route path="editar/:storeId" element={<StoreUpdatePage />} />
    </Routes>
  );
}
