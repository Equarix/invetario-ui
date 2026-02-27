import ApprovePage from "@/pages/order-entry/approve/ApprovePage";
import CreateOrderEntry from "@/pages/order-entry/create/CreateOrderEntry";
import OrderEntry from "@/pages/order-entry/OrderEntry";
import { Route, Routes } from "react-router";

export default function OrderEntryRoute() {
  return (
    <Routes>
      <Route path="/" element={<OrderEntry />} />
      <Route path="/crear" element={<CreateOrderEntry />} />
      <Route path="/recepcion" element={<ApprovePage />} />
    </Routes>
  );
}
