import ChatPage from "@/pages/chat/ChatPage";
import { Route, Routes } from "react-router";

export default function ChatRoute() {
  return (
    <Routes>
      <Route path="/" element={<ChatPage />} />
    </Routes>
  );
}
