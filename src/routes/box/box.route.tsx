import { Navigate, Route, Routes } from "react-router";
import BoxSummaryPage from "@/pages/box/BoxSummaryPage";

export default function BoxRoute() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/caja/resumen" replace />} />
      <Route path="resumen" element={<BoxSummaryPage />} />
      <Route path="reportes" element={<div className="p-6 text-zinc-500">Reportes de Caja</div>} />
    </Routes>
  );
}
