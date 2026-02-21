import Client from "@/pages/client/Client";
import { Route, Routes } from "react-router";

export default function ClientRoute() {
  return (
    <Routes>
      <Route path="/" element={<Client />} />
    </Routes>
  );
}
