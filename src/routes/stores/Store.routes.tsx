import StoreProducts from "@/pages/store/products/StoreProducts";
import StorePage from "@/pages/store/StorePage";
import { Route, Routes } from "react-router";

export default function StoreRoutes() {
  return (
    <Routes>
      <Route path="/" element={<StorePage />} />
      <Route path="productos/:storeId" element={<StoreProducts />} />
    </Routes>
  );
}
