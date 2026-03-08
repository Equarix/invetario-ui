import UserPage from "@/pages/users/UserPage";
import { Route, Routes } from "react-router";

export default function UsersRoute() {
  return (
    <Routes>
      <Route path="/" element={<UserPage />} />
    </Routes>
  );
}
