import CreateSale from "@/pages/sale/create/CreateSale";
import Sale from "@/pages/sale/Sale";
import { Route, Routes } from "react-router";

export default function SaleRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Sale />} />
      <Route path="crear" element={<CreateSale />} />
    </Routes>
  );
}
