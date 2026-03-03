import CreateSale from "@/pages/sale/create/CreateSale";
import { Route, Routes } from "react-router";

export default function SaleRoutes() {
  return (
    <Routes>
      <Route path="/" element={<div>Ventas</div>} />
      <Route path="crear" element={<CreateSale />} />
    </Routes>
  );
}
