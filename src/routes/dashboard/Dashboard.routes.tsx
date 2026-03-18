import GaleryPage from "@/pages/galery/GaleryPage";
import { Route, Routes } from "react-router";
import StoreRoutes from "../stores/Store.routes";
import ProductsRoute from "../products/products.route";
import ProviderRoute from "../provider/provider.route";
import ClientRoute from "../client/client.route";
import OrderEntryRoute from "../order-entry/orderEntry.route";
import SaleRoutes from "../sale/Sale.routes";
import HomePage from "@/pages/dashboard/HomePage";
import Config from "@/pages/config/Config";
import ChatRoute from "../chat/chat.route";
import UsersRoute from "../users/users.route";
import CrudRoute from "../cruds/crud.route";
import ReportRoute from "../reports/report.route";

export default function DashboardRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/mantenedores/*" element={<CrudRoute />} />
      <Route path="/galeria" element={<GaleryPage />} />
      <Route path="/almacenes/*" element={<StoreRoutes />} />
      <Route path="/productos/*" element={<ProductsRoute />} />
      <Route path="/proveedores/*" element={<ProviderRoute />} />
      <Route path="/clientes/*" element={<ClientRoute />} />
      <Route path="/orden-entrada/*" element={<OrderEntryRoute />} />
      <Route path="/venta/*" element={<SaleRoutes />} />
      <Route path="/chat/*" element={<ChatRoute />} />
      <Route path="/usuarios/*" element={<UsersRoute />} />
      <Route path="/configuracion" element={<Config />} />
      <Route path="/reportes/*" element={<ReportRoute />} />

      <Route
        path="*"
        element={<h1 className="text-white">404 - Not Found</h1>}
      />
    </Routes>
  );
}
