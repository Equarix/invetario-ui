import ReportProduct from "@/pages/reports/report-product/ReportProduct";
import { Route, Routes } from "react-router";

export default function ReportRoute() {
  return (
    <Routes>
      <Route path="/productos-faltantes" element={<ReportProduct />} />
    </Routes>
  );
}
