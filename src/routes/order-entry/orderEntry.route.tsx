import OrderEntry from "@/pages/order-entry/OrderEntry";
import { Route, Routes } from "react-router";

export default function OrderEntryRoute() {
  return (
    <Routes>
      <Route path="/" element={<OrderEntry />} />
    </Routes>
  );
}
