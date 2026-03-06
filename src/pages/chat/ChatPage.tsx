import Container from "@/components/components/container/Container";
import Header from "@/components/layouts/header/Header";
import { LuMessageSquareCode } from "react-icons/lu";

export default function ChatPage() {
  return (
    <Container>
      <Header
        icon={<LuMessageSquareCode />}
        text={{
          header: "Chat",
        }}
        disabledButton
      />
    </Container>
  );
}
