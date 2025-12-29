import { Route, Routes } from "react-router";
import AuthRoutes from "./routes/auth/Auth.routes";

export default function App() {
  return (
    <Routes>
      <Route path="/auth/*" element={<AuthRoutes />} />
    </Routes>
  );
}
