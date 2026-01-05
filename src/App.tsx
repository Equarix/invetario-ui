import { Route, Routes } from "react-router";
import AuthRoutes from "./routes/auth/Auth.routes";
import DashboardRoutes from "./routes/dashboard/Dashboard.routes";

export default function App() {
  return (
    <Routes>
      <Route path="/auth/*" element={<AuthRoutes />} />
      <Route path="/*" element={<DashboardRoutes />}/>
    </Routes>
  );
}
