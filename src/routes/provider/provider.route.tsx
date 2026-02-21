import Providers from "@/pages/providers/Providers";
import CreateProviderPage from "@/pages/providers/crear/CreateProviderPage";
import EditProviderPage from "@/pages/providers/edit/EditProviderPage";
import { Route, Routes } from "react-router";

export default function ProviderRoute() {
  return (
    <Routes>
      <Route path="/" element={<Providers />} />
      <Route path="/crear" element={<CreateProviderPage />} />
      <Route path="/editar/:providerId" element={<EditProviderPage />} />
    </Routes>
  );
}
