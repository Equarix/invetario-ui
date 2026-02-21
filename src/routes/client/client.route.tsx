import Clients from "@/pages/clients/Clients";
import CreateClientPage from "@/pages/clients/crear/CreateClientPage";
import EditClientPage from "@/pages/clients/edit/EditClientPage";
import { Route, Routes } from "react-router";

export default function ClientRoute() {
  return (
    <Routes>
      <Route path="/" element={<Clients />} />
      <Route path="/crear" element={<CreateClientPage />} />
      <Route path="/editar/:clientId" element={<EditClientPage />} />
    </Routes>
  );
}
